import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";
import {
    finalizeAttempt,
    getInProgressAttempt,
    getActiveGrant,
    INTERNAL_BANK_VERSION_V1,
    isAttemptExpired,
    upsertResponse,
} from "@/lib/assessment/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
    const { supabase, applyToResponse } = createRouteHandlerClient(req);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return applyToResponse(NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 }));
    }

    try {
        const body = await req.json();
        const attemptId = String(body?.attemptId ?? "");
        const questionId = String(body?.questionId ?? "");
        const optionId = body?.optionId === null || body?.optionId === undefined ? null : String(body.optionId);
        const timeSpentSeconds = body?.timeSpentSeconds === null || body?.timeSpentSeconds === undefined ? null : Number(body.timeSpentSeconds);

        if (!attemptId || !questionId) {
            return applyToResponse(NextResponse.json({ success: false, message: "Missing attemptId/questionId." }, { status: 400 }));
        }

        const grant = await getActiveGrant(supabase, user.id, INTERNAL_BANK_VERSION_V1);
        if (!grant || grant.status !== "active") {
            return applyToResponse(NextResponse.json({ success: false, message: "Access not granted." }, { status: 403 }));
        }

        const attempt = await getInProgressAttempt(supabase, user.id, grant.bank_version);
        if (!attempt || attempt.id !== attemptId) {
            return applyToResponse(NextResponse.json({ success: false, message: "Active attempt not found." }, { status: 404 }));
        }

        if (isAttemptExpired(attempt)) {
            const finalized = await finalizeAttempt({ supabase, userId: user.id, attemptId: attempt.id, forceExpired: true });
            return applyToResponse(
                NextResponse.json(
                    {
                        success: false,
                        code: "expired",
                        message: "Attempt expired and was auto-submitted.",
                        attemptId: finalized.attempt.id,
                        resultId: finalized.result.id,
                    },
                    { status: 409 },
                ),
            );
        }

        const saved = await upsertResponse({
            supabase,
            userId: user.id,
            attempt,
            questionId,
            optionId,
            timeSpentSeconds,
        });

        return applyToResponse(NextResponse.json({ success: true, snapshot: saved.snapshot }));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to save response.";
        return applyToResponse(NextResponse.json({ success: false, message }, { status: 400 }));
    }
}
