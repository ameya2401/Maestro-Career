import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "@/lib/auth-supabase";
import { createRouteHandlerClient } from "@/lib/supabase/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    let applyToResponse: ((response: NextResponse) => NextResponse) | null = null;
    try {
        const { supabase, applyToResponse: applyCookies } = createRouteHandlerClient(req);
        applyToResponse = applyCookies;
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return applyToResponse(NextResponse.json(
                { success: false, message: "No active session found" },
                { status: 200 }
            ));
        }

        const dashboard = await getDashboardData(supabase);
        if (!dashboard) {
            return applyToResponse(NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            ));
        }

        return applyToResponse(NextResponse.json({ success: true, data: dashboard }));
    } catch (error) {
        console.error("Dashboard /me error:", error);
        const message = error instanceof Error ? error.message : "Unable to load the current session.";
        const status = message.includes("Supabase auth is not configured") ? 503 : 400;
        const response = NextResponse.json({ success: false, message }, { status });
        return applyToResponse ? applyToResponse(response) : response;
    }
}
