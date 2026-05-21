import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), { auth: { persistSession: false } });

async function debugDirect() {
    const attemptId = "1c4f1be6-68bc-423c-9098-e3c77b0e98ca";
    const userId = "b179fe37-d684-4ad0-857b-d8fc89f2bc9d";

    await supabase.from("assessment_attempts").update({ status: 'in_progress', submitted_at: null }).eq('id', attemptId);
    await supabase.from("assessment_results").delete().eq("attempt_id", attemptId);

    // Call the actual module!
    // Since we are running outside Next.js, we need to compile it or we can just fetch the API but using a valid session.
    // Easiest is to generate a JWT for the user using jsonwebtoken.
    
}
debugDirect();
