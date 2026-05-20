import { SupabaseClient } from "@supabase/supabase-js";
import { INTERNAL_BANK_VERSION_V1, getAssessmentBankByVersion } from "@/lib/assessment/bank";
import { computeContributionSnapshot, getCareerCatalogV1, scoreAssessment } from "@/lib/assessment/scoring";
import { AssessmentBank } from "@/lib/assessment/types";

export { INTERNAL_BANK_VERSION_V1 };

export const INTERNAL_ASSESSMENT_TIME_LIMIT_SECONDS_V1 = 50 * 60;

export type AccessGrantRow = {
    id: string;
    user_id: string;
    bank_version: string;
    status: "active" | "revoked";
    granted_at: string;
    granted_by: string;
    revoked_at: string | null;
    revoked_by: string | null;
    notes: string | null;
};

export type AttemptRow = {
    id: string;
    user_id: string;
    bank_version: string;
    status: "in_progress" | "submitted" | "expired";
    score_version: string;
    time_limit_seconds: number;
    started_at: string;
    expires_at: string;
    last_activity_at: string;
    submitted_at: string | null;
    raw_totals: Record<string, number>;
    normalized_totals: Record<string, number>;
    aptitude_index: number | null;
    psychometric_index: number | null;
    overall_index: number | null;
};

export type ResponseRow = {
    id: string;
    attempt_id: string;
    user_id: string;
    question_id: string;
    selected_option_id: string | null;
    time_spent_seconds: number | null;
    contribution_snapshot: Record<string, number>;
};

export type ResultRow = {
    id: string;
    attempt_id: string;
    user_id: string;
    bank_version: string;
    score_version: string;
    aptitude_scores: Record<string, number>;
    psychometric_scores: Record<string, number>;
    aptitude_index: number;
    psychometric_index: number;
    overall_index: number;
    career_matches: unknown;
    summary: unknown;
    created_at: string;
};

export function getInternalBankV1(): AssessmentBank {
    return getAssessmentBankByVersion(INTERNAL_BANK_VERSION_V1);
}

export async function getActiveGrant(supabase: SupabaseClient, userId: string, bankVersion = INTERNAL_BANK_VERSION_V1) {
    const { data, error } = await supabase
        .from("assessment_access_grants")
        .select("id,user_id,bank_version,status,granted_at,granted_by,revoked_at,revoked_by,notes")
        .eq("user_id", userId)
        .eq("bank_version", bankVersion)
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return data as AccessGrantRow;
}

export async function getInProgressAttempt(supabase: SupabaseClient, userId: string, bankVersion = INTERNAL_BANK_VERSION_V1) {
    const { data, error } = await supabase
        .from("assessment_attempts")
        .select(
            "id,user_id,bank_version,status,score_version,time_limit_seconds,started_at,expires_at,last_activity_at,submitted_at,raw_totals,normalized_totals,aptitude_index,psychometric_index,overall_index",
        )
        .eq("user_id", userId)
        .eq("bank_version", bankVersion)
        .eq("status", "in_progress")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return (data ?? null) as AttemptRow | null;
}

export async function getLatestAttempt(supabase: SupabaseClient, userId: string, bankVersion = INTERNAL_BANK_VERSION_V1) {
    const { data, error } = await supabase
        .from("assessment_attempts")
        .select(
            "id,user_id,bank_version,status,score_version,time_limit_seconds,started_at,expires_at,last_activity_at,submitted_at,raw_totals,normalized_totals,aptitude_index,psychometric_index,overall_index",
        )
        .eq("user_id", userId)
        .eq("bank_version", bankVersion)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return (data ?? null) as AttemptRow | null;
}

export async function getResultByAttemptId(supabase: SupabaseClient, userId: string, attemptId: string) {
    const { data, error } = await supabase
        .from("assessment_results")
        .select(
            "id,attempt_id,user_id,bank_version,score_version,aptitude_scores,psychometric_scores,aptitude_index,psychometric_index,overall_index,career_matches,summary,created_at",
        )
        .eq("attempt_id", attemptId)
        .eq("user_id", userId)
        .maybeSingle();

    if (error) throw error;
    return (data ?? null) as ResultRow | null;
}

export async function getResponsesForAttempt(supabase: SupabaseClient, userId: string, attemptId: string) {
    const { data, error } = await supabase
        .from("assessment_responses")
        .select("id,attempt_id,user_id,question_id,selected_option_id,time_spent_seconds,contribution_snapshot")
        .eq("attempt_id", attemptId)
        .eq("user_id", userId);

    if (error) throw error;
    return (data ?? []) as ResponseRow[];
}

export function buildResponseMap(rows: ResponseRow[]) {
    const map: Record<string, string | null> = {};
    for (const row of rows) {
        map[row.question_id] = row.selected_option_id;
    }
    return map;
}

export function isAttemptExpired(attempt: Pick<AttemptRow, "expires_at">) {
    return Date.now() >= new Date(attempt.expires_at).getTime();
}

export async function upsertResponse(params: {
    supabase: SupabaseClient;
    userId: string;
    attempt: AttemptRow;
    questionId: string;
    optionId: string | null;
    timeSpentSeconds?: number | null;
}) {
    const bank = getAssessmentBankByVersion(params.attempt.bank_version);
    const question = bank.questions.find((q) => q.id === params.questionId);
    if (!question) {
        throw new Error("Unknown question.");
    }

    const snapshot = computeContributionSnapshot(question, params.optionId);

    const payload = {
        attempt_id: params.attempt.id,
        user_id: params.userId,
        question_id: params.questionId,
        selected_option_id: params.optionId,
        time_spent_seconds: params.timeSpentSeconds ?? null,
        contribution_snapshot: snapshot,
    };

    const { error } = await params.supabase
        .from("assessment_responses")
        .upsert(payload, { onConflict: "attempt_id,question_id" });

    if (error) throw error;

    const { error: attemptError } = await params.supabase
        .from("assessment_attempts")
        .update({ last_activity_at: new Date().toISOString() })
        .eq("id", params.attempt.id)
        .eq("user_id", params.userId);

    if (attemptError) throw attemptError;

    return { snapshot };
}

export async function finalizeAttempt(params: {
    supabase: SupabaseClient;
    userId: string;
    attemptId: string;
    forceExpired?: boolean;
}) {
    const { supabase, userId, attemptId } = params;

    const { data: attempt, error: attemptError } = await supabase
        .from("assessment_attempts")
        .select(
            "id,user_id,bank_version,status,score_version,time_limit_seconds,started_at,expires_at,last_activity_at,submitted_at,raw_totals,normalized_totals,aptitude_index,psychometric_index,overall_index",
        )
        .eq("id", attemptId)
        .eq("user_id", userId)
        .maybeSingle();

    if (attemptError) throw attemptError;
    if (!attempt) throw new Error("Attempt not found.");

    const attemptRow = attempt as AttemptRow;

    const existingResult = await getResultByAttemptId(supabase, userId, attemptId);
    if (existingResult) {
        return { attempt: attemptRow, result: existingResult, alreadyFinalized: true };
    }

    if (attemptRow.status !== "in_progress") {
        throw new Error("Attempt is not active.");
    }

    const expired = params.forceExpired ? true : isAttemptExpired(attemptRow);

    const bank = getAssessmentBankByVersion(attemptRow.bank_version);
    const responses = await getResponsesForAttempt(supabase, userId, attemptId);
    const responseMap = buildResponseMap(responses);

    const scored = scoreAssessment({
        bank,
        responses: responseMap,
        scoreVersion: attemptRow.score_version,
        careers: getCareerCatalogV1(),
    });

    const submittedAt = new Date().toISOString();

    const { error: updateError } = await supabase
        .from("assessment_attempts")
        .update({
            status: expired ? "expired" : "submitted",
            submitted_at: submittedAt,
            raw_totals: scored.rawTotals,
            normalized_totals: scored.normalizedTotals,
            aptitude_index: scored.aptitudeIndex,
            psychometric_index: scored.psychometricIndex,
            overall_index: scored.overallIndex,
            last_activity_at: submittedAt,
        })
        .eq("id", attemptId)
        .eq("user_id", userId);

    if (updateError) throw updateError;

    const { data: inserted, error: insertError } = await supabase
        .from("assessment_results")
        .insert({
            attempt_id: attemptId,
            user_id: userId,
            bank_version: attemptRow.bank_version,
            score_version: attemptRow.score_version,
            aptitude_scores: scored.aptitudeScores,
            psychometric_scores: scored.psychometricScores,
            aptitude_index: scored.aptitudeIndex,
            psychometric_index: scored.psychometricIndex,
            overall_index: scored.overallIndex,
            career_matches: scored.careerMatches,
            summary: {
                ...scored.summary,
                areasRequiringImprovement: scored.areasRequiringImprovement,
            },
        })
        .select(
            "id,attempt_id,user_id,bank_version,score_version,aptitude_scores,psychometric_scores,aptitude_index,psychometric_index,overall_index,career_matches,summary,created_at",
        )
        .maybeSingle();

    if (insertError) throw insertError;

    const result = (inserted ?? null) as ResultRow | null;
    if (!result) throw new Error("Unable to persist result.");

    return {
        attempt: { ...attemptRow, status: expired ? "expired" : "submitted", submitted_at: submittedAt } as AttemptRow,
        result,
        alreadyFinalized: false,
    };
}

export function getBankVersionForGrant(grant: AccessGrantRow | null) {
    if (!grant) return INTERNAL_BANK_VERSION_V1;
    return grant.bank_version || INTERNAL_BANK_VERSION_V1;
}
