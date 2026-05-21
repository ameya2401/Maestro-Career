import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

// Read .env.local manually
const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
    console.error("Missing supabase URL or key in .env");
    process.exit(1);
}

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), { auth: { persistSession: false } });

async function reset() {
    console.log("Looking for stuck submitted attempts...");
    const { data: attempts, error: fetchErr } = await supabase
        .from('assessment_attempts')
        .select('id, user_id, status')
        .eq('status', 'submitted');

    if (fetchErr) {
        console.error("Error fetching attempts:", fetchErr);
        return;
    }

    if (!attempts || attempts.length === 0) {
        console.log("No submitted attempts found.");
        return;
    }

    for (const attempt of attempts) {
        // check if result exists
        const { data: results, error: resErr } = await supabase
            .from('assessment_results')
            .select('id')
            .eq('attempt_id', attempt.id);

        if (resErr) {
            console.error("Error fetching results for attempt", attempt.id, resErr);
            continue;
        }

        if (!results || results.length === 0) {
            console.log(`Resetting stuck attempt: ${attempt.id} (user: ${attempt.user_id})`);
            const { error: updErr } = await supabase
                .from('assessment_attempts')
                .update({ status: 'in_progress', submitted_at: null })
                .eq('id', attempt.id);
            
            if (updErr) {
                console.error("Failed to reset attempt", attempt.id, updErr);
            } else {
                console.log("Successfully reset attempt", attempt.id);
            }
        }
    }
}

reset();
