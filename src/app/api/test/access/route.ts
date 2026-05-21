import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";
import {
    getActiveGrant,
    getInProgressAttempt,
    getLatestAttempt,
    getResultByAttemptId,
    finalizeAttempt,
    isAttemptExpired,
    INTERNAL_BANK_VERSION_V1,
} from "@/lib/assessment/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const { supabase, applyToResponse } = createRouteHandlerClient(req);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return applyToResponse(
            NextResponse.json({
                success: true,
                authenticated: false,
                grant: null,
                attempt: null,
                latestAttempt: null,
                serverTime: new Date().toISOString(),
            }),
        );
    }

    try {
        const grant = await getActiveGrant(supabase, user.id, INTERNAL_BANK_VERSION_V1);
        const attempt = await getInProgressAttempt(supabase, user.id, INTERNAL_BANK_VERSION_V1);

        let finalized: { attemptId: string; resultId: string } | null = null;

        if (attempt && isAttemptExpired(attempt)) {
            const result = await finalizeAttempt({ supabase, userId: user.id, attemptId: attempt.id, forceExpired: true });
            finalized = { attemptId: result.attempt.id, resultId: result.result.id };
        }

        const latestAttempt = await getLatestAttempt(supabase, user.id, INTERNAL_BANK_VERSION_V1);
        const latestResultId =
            latestAttempt && (latestAttempt.status === "submitted" || latestAttempt.status === "expired")
                ? (await getResultByAttemptId(supabase, user.id, latestAttempt.id))?.id ?? null
                : null;

        return applyToResponse(
            NextResponse.json({
                success: true,
                authenticated: true,
                grant: grant ? { status: grant.status, bankVersion: grant.bank_version, grantedAt: grant.granted_at } : null,
                attempt: attempt,
                latestAttempt,
                latestResultId,
                finalized,
                serverTime: new Date().toISOString(),
            }),
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to fetch access.";
        return applyToResponse(NextResponse.json({ success: false, message }, { status: 400 }));
    }
}
