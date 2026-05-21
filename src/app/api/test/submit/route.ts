import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";
import { createClient } from "@supabase/supabase-js";
import { finalizeAttempt, getActiveGrant, INTERNAL_BANK_VERSION_V1 } from "@/lib/assessment/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const { supabase, applyToResponse } = createRouteHandlerClient(req);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const finalUserId = user?.id || "b179fe37-d684-4ad0-857b-d8fc89f2bc9d";

    try {
        const body = await req.json();
        const attemptId = String(body?.attemptId ?? "1c4f1be6-68bc-423c-9098-e3c77b0e98ca");


        const grant = await getActiveGrant(supabase, finalUserId, INTERNAL_BANK_VERSION_V1);
        if (!grant || grant.status !== "active") {
            return applyToResponse(NextResponse.json({ success: false, message: "Access not granted." }, { status: 403 }));
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const finalized = await finalizeAttempt({ supabase: supabaseAdmin, userId: user!.id, attemptId });

        return applyToResponse(
            NextResponse.json({
                success: true,
                attemptId: finalized.attempt.id,
                resultId: finalized.result.id,
                status: finalized.attempt.status,
            }),
        );
    } catch (error) {
        console.error("SUBMIT ERROR:", error);
        const message = error instanceof Error ? error.message : "Unable to submit.";
        return applyToResponse(NextResponse.json({ success: false, message }, { status: 400 }));
    }
}
