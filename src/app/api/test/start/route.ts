import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";
import {
    buildResponseMap,
    getActiveGrant,
    getInProgressAttempt,
    getInternalBankV1,
    getResponsesForAttempt,
    INTERNAL_ASSESSMENT_TIME_LIMIT_SECONDS_V1,
    INTERNAL_BANK_VERSION_V1,
    isAttemptExpired,
    finalizeAttempt,
    getLatestAttempt,
    getResultByAttemptId,
} from "@/lib/assessment/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function publicQuestions(bank = getInternalBankV1()) {
    return bank.questions.map((q) => ({
        id: q.id,
        section: q.section,
        category: q.category,
        prompt: q.prompt,
        options: q.options.map((o) => ({ id: o.id, label: o.label, text: o.text })),
    }));
}

type Attempt = NonNullable<Awaited<ReturnType<typeof getInProgressAttempt>>>;

export async function POST(req: NextRequest) {
    const { supabase, applyToResponse } = createRouteHandlerClient(req);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return applyToResponse(NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 }));
    }

    try {
        const grant = await getActiveGrant(supabase, user.id, INTERNAL_BANK_VERSION_V1);
        if (!grant || grant.status !== "active") {
            return applyToResponse(NextResponse.json({ success: false, message: "Internal assessment access is not granted yet." }, { status: 403 }));
        }

        const existingAttempt = await getInProgressAttempt(supabase, user.id, grant.bank_version);

        if (existingAttempt && isAttemptExpired(existingAttempt)) {
            await finalizeAttempt({ supabase, userId: user.id, attemptId: existingAttempt.id, forceExpired: true });
        }

        const latestAttempt = await getLatestAttempt(supabase, user.id, grant.bank_version);
        if (latestAttempt && (latestAttempt.status === "submitted" || latestAttempt.status === "expired")) {
            const result = await getResultByAttemptId(supabase, user.id, latestAttempt.id);
            if (result) {
                return applyToResponse(
                    NextResponse.json(
                        {
                            success: false,
                            code: "already_completed",
                            message: "Assessment already completed for this version.",
                            attemptId: latestAttempt.id,
                            resultId: result.id,
                        },
                        { status: 409 },
                    ),
                );
            }
        }

        let attempt = await getInProgressAttempt(supabase, user.id, grant.bank_version);

        if (!attempt) {
            const now = new Date();
            const expiresAt = new Date(now.getTime() + INTERNAL_ASSESSMENT_TIME_LIMIT_SECONDS_V1 * 1000);

            const { data: inserted, error } = await supabase
                .from("assessment_attempts")
                .insert({
                    user_id: user.id,
                    bank_version: grant.bank_version,
                    status: "in_progress",
                    score_version: "v1",
                    time_limit_seconds: INTERNAL_ASSESSMENT_TIME_LIMIT_SECONDS_V1,
                    started_at: now.toISOString(),
                    expires_at: expiresAt.toISOString(),
                    last_activity_at: now.toISOString(),
                })
                .select(
                    "id,user_id,bank_version,status,score_version,time_limit_seconds,started_at,expires_at,last_activity_at,submitted_at,raw_totals,normalized_totals,aptitude_index,psychometric_index,overall_index",
                )
                .maybeSingle();

            if (error) throw error;
            if (!inserted) throw new Error("Unable to start attempt.");
            attempt = inserted as Attempt;
        }

        const bank = getInternalBankV1();
        const responses = await getResponsesForAttempt(supabase, user.id, attempt.id);
        const responseMap = buildResponseMap(responses);

        return applyToResponse(
            NextResponse.json({
                success: true,
                attempt,
                questions: publicQuestions(bank),
                responses: responseMap,
                serverTime: new Date().toISOString(),
            }),
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to start assessment.";
        return applyToResponse(NextResponse.json({ success: false, message }, { status: 400 }));
    }
}
