import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";
import { getResultByAttemptId } from "@/lib/assessment/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: { attemptId: string } }) {
    const { supabase, applyToResponse } = createRouteHandlerClient(req);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return applyToResponse(NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 }));
    }

    try {
        const attemptId = String(ctx?.params?.attemptId ?? "");
        if (!attemptId) {
            return applyToResponse(NextResponse.json({ success: false, message: "Missing attemptId." }, { status: 400 }));
        }

        const result = await getResultByAttemptId(supabase, user.id, attemptId);
        if (!result) {
            return applyToResponse(NextResponse.json({ success: false, message: "Result not found." }, { status: 404 }));
        }

        return applyToResponse(NextResponse.json({ success: true, data: result }));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load result.";
        return applyToResponse(NextResponse.json({ success: false, message }, { status: 400 }));
    }
}
