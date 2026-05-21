import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), { auth: { persistSession: false } });

async function debug() {
    const attemptId = "1c4f1be6-68bc-423c-9098-e3c77b0e98ca";

    console.log("Deleting dummy result...");
    await supabase.from("assessment_results").delete().eq("attempt_id", attemptId);

    console.log("Setting attempt to in_progress...");
    await supabase.from("assessment_attempts").update({ status: 'in_progress', submitted_at: null }).eq('id', attemptId);

    console.log("Calling localhost /api/test/submit...");
    // Since we don't have session token, we can't easily call /api/test/submit directly.
    // Instead, let's just fetch all responses and call finalizeAttempt logic.
}
debug();
