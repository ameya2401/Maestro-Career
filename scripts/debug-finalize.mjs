import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Let's just do it directly here using the exact same logic.
const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), { auth: { persistSession: false } });

async function debugFinalize() {
    const attemptId = "1c4f1be6-68bc-423c-9098-e3c77b0e98ca";
    const userId = "b179fe37-d684-4ad0-857b-d8fc89f2bc9d";

    const { data: attempt, error: attemptError } = await supabase
        .from("assessment_attempts")
        .select("*")
        .eq("id", attemptId)
        .eq("user_id", userId)
        .single();
        
    console.log("Attempt state:", attempt.status);

    // reset attempt to in_progress if it was expired or submitted
    if (attempt.status !== 'in_progress') {
        await supabase.from("assessment_attempts").update({ status: 'in_progress', submitted_at: null }).eq('id', attemptId);
        attempt.status = 'in_progress';
    }

    // Now try to update to submitted and insert result
    const submittedAt = new Date().toISOString();
    const { error: updateError } = await supabase
        .from("assessment_attempts")
        .update({
            status: "submitted",
            submitted_at: submittedAt,
            last_activity_at: submittedAt,
        })
        .eq("id", attemptId)
        .eq("user_id", userId);

    if (updateError) {
        console.error("Update error:", updateError);
        return;
    }

    const { data: inserted, error: insertError } = await supabase
        .from("assessment_results")
        .insert({
            attempt_id: attemptId,
            user_id: userId,
            bank_version: "prototype-1-v1",
            score_version: "v1",
            aptitude_scores: {},
            psychometric_scores: {},
            aptitude_index: 0,
            psychometric_index: 0,
            overall_index: 0,
            career_matches: [],
            summary: {},
        })
        .select();

    if (insertError) {
        console.error("Insert error details:", JSON.stringify(insertError, null, 2));
    } else {
        console.log("Insert success!", inserted);
    }
}
debugFinalize();
