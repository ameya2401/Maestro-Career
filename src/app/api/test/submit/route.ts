import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";
import { finalizeAttempt, getActiveGrant, INTERNAL_BANK_VERSION_V1 } from "@/lib/assessment/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
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
        if (!attemptId) {
            return applyToResponse(NextResponse.json({ success: false, message: "Missing attemptId." }, { status: 400 }));
        }

        const grant = await getActiveGrant(supabase, user.id, INTERNAL_BANK_VERSION_V1);
        if (!grant || grant.status !== "active") {
            return applyToResponse(NextResponse.json({ success: false, message: "Access not granted." }, { status: 403 }));
        }

        const finalized = await finalizeAttempt({ supabase, userId: user.id, attemptId });

        return applyToResponse(
            NextResponse.json({
                success: true,
                attemptId: finalized.attempt.id,
                resultId: finalized.result.id,
                status: finalized.attempt.status,
            }),
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to submit.";
        return applyToResponse(NextResponse.json({ success: false, message }, { status: 400 }));
    }
}
