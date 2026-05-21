import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { finalizeAttempt } from "@/lib/assessment/server";

export async function GET(req: NextRequest) {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const attemptId = "1c4f1be6-68bc-423c-9098-e3c77b0e98ca";
    const userId = "b179fe37-d684-4ad0-857b-d8fc89f2bc9d";

    try {
        await supabaseAdmin.from("assessment_attempts").update({ status: 'in_progress', submitted_at: null }).eq('id', attemptId);
        await supabaseAdmin.from("assessment_results").delete().eq("attempt_id", attemptId);

        const finalized = await finalizeAttempt({ supabase: supabaseAdmin, userId, attemptId });

        return NextResponse.json({ success: true, finalized });
    } catch (error) {
        console.error("ADMIN FIX ERROR:", error);
        return NextResponse.json({ success: false, error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))) });
    }
}
