import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ success: false, message: "Name, email and message are required." }, { status: 400 });
        }

        const admin = createAdminClient();

        // 1. Try with message column
        const { error: errorWithMessage } = await admin
            .from("inquiries")
            .insert({ name, email, message });

        if (errorWithMessage) {
            console.error("Supabase inquiry (with message) error:", errorWithMessage);

            // 2. Fallback: try without message column in case it hasn't been added to DB yet
            const { error: errorWithoutMessage } = await admin
                .from("inquiries")
                .insert({ name, email });

            if (errorWithoutMessage) {
                console.error("Supabase inquiry (fallback) error:", errorWithoutMessage);
                return NextResponse.json({ success: false, message: "Internal Database Error" }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Submit inquiry server error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit inquiry" }, { status: 500 });
    }
}
