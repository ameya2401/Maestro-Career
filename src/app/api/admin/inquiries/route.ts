import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticatedRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
    try {
        if (!isAdminAuthenticatedRequest(req)) {
            return NextResponse.json({ success: false, message: "Admin authentication required." }, { status: 401 });
        }

        const admin = createAdminClient();
        const { data: inquiries, error } = await admin
            .from("inquiries")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, data: inquiries });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load inquiries.";
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
}
