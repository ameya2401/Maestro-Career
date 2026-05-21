import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route";

export async function POST(req: NextRequest) {
    try {
        const { supabase, applyToResponse } = createRouteHandlerClient(req);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { career_goals } = await req.json();

        const { error } = await supabase
            .from("profiles")
            .update({ career_goals })
            .eq("id", user.id);

        if (error) {
            console.error(error);
            return NextResponse.json({ success: false, message: "Failed to update aspirations" }, { status: 500 });
        }

        return applyToResponse(NextResponse.json({ success: true, message: "Aspirations updated" }));
    } catch (e) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
