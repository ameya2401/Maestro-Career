import { createRouteHandlerClient } from "@/lib/supabase/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    let applyToResponse: ((response: NextResponse) => NextResponse) | null = null;
    try {
        const { supabase, applyToResponse: applyCookiesToResponse } = createRouteHandlerClient(req);
        applyToResponse = applyCookiesToResponse;
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return applyToResponse(
                NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
            );
        }

        const { data: result, error } = await supabase
            .from('assessment_results')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        return applyToResponse(
            NextResponse.json({
                success: true,
                result: result
            })
        );

    } catch (err) {
        console.error("Latest result fetch error:", err);
        const response = NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
        return applyToResponse ? applyToResponse(response) : response;
    }
}
