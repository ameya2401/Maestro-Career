import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), { auth: { persistSession: false } });

async function debugGet() {
    const attemptId = "1c4f1be6-68bc-423c-9098-e3c77b0e98ca";
    const userId = "b179fe37-d684-4ad0-857b-d8fc89f2bc9d";

    const { data, error } = await supabase
        .from("assessment_results")
        .select(
            "id,attempt_id,user_id,bank_version,score_version,aptitude_scores,psychometric_scores,aptitude_index,psychometric_index,overall_index,career_matches,summary,created_at",
        )
        .eq("attempt_id", attemptId)
        .eq("user_id", userId)
        .maybeSingle();

    console.log("Error:", error);
    console.log("Data:", data);
}
debugGet();
