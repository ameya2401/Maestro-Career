import { NextResponse } from "next/server";
import { createPublicServerClient } from "@/lib/supabase/public";

export async function POST(req: Request) {
    try {
        const supabase = createPublicServerClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { career_goals } = await req.json();

        const { error } = await supabase
            .from("profiles")
            .update({ career_goals })
            .eq("id", session.user.id);

        if (error) {
            console.error(error);
            return NextResponse.json({ success: false, message: "Failed to update aspirations" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Aspirations updated" });
    } catch (e) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
