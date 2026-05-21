import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json({ success: false, message: "Name and email are required." }, { status: 400 });
        }

        const admin = createAdminClient();
        const { error } = await admin
            .from("inquiries")
            .insert({ name, email });

        if (error) {
            console.error("Supabase inquiry insert error:", error);
            throw new Error("Database error while submitting inquiry.");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Submit inquiry error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit inquiry" }, { status: 500 });
    }
}
