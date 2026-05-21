import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";

export async function POST(req: NextRequest) {
    let applyToResponse: ((response: NextResponse) => NextResponse) | null = null;
    try {
        const { supabase, applyToResponse: applyCookies } = createRouteHandlerClient(req);
        applyToResponse = applyCookies;
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return applyToResponse(NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }));
        }

        const { career_goals } = await req.json();

        const { error } = await supabase
            .from("profiles")
            .update({ career_goals })
            .eq("id", user.id);

        if (error) {
            console.error("Aspirations update error:", error);
            const detail = error.message || "Database update failed";
            return applyToResponse(NextResponse.json({
                success: false,
                message: `Failed to update aspirations: ${detail} (Code: ${error.code})`
            }, { status: 500 }));
        }

        return applyToResponse(NextResponse.json({ success: true, message: "Aspirations updated" }));
    } catch (e) {
        console.error("Aspirations server error:", e);
        const response = NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
        return applyToResponse ? applyToResponse(response) : response;
    }
}
