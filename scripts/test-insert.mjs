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

async function testInsert() {
    const { data, error } = await supabase.from('assessment_results').insert({
        attempt_id: "1c4f1be6-68bc-423c-9098-e3c77b0e98ca",
        user_id: "b179fe37-d684-4ad0-857b-d8fc89f2bc9d",
        bank_version: "v1",
        score_version: "v1",
        aptitude_scores: {},
        psychometric_scores: {},
        aptitude_index: 0,
        psychometric_index: 0,
        overall_index: 0,
        career_matches: [],
        summary: {},
    });
    console.log(error);
}

testInsert();
