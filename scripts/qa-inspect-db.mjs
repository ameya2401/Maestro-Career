import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const env = fs.readFileSync(".env", "utf-8");
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), { auth: { persistSession: false } });

async function inspect() {
    console.log("--- Supabase Data Inspection ---");
    const { data: users, error: uErr } = await supabase.auth.admin.listUsers();
    console.log("Auth Users:", users?.users?.map(u => ({ id: u.id, email: u.email, confirmed: u.email_confirmed_at })));

    const { data: profiles, error: pErr } = await supabase.from("profiles").select("*");
    console.log("Profiles count:", profiles?.length);
    if (profiles?.length) {
        console.log("Profiles:", profiles.map(p => ({ id: p.id, email: p.email, plan: p.selected_plan_id, payment: p.payment_status, goals: p.career_goals })));
    }

    const { data: grants, error: gErr } = await supabase.from("assessment_access_grants").select("*");
    console.log("Grants count:", grants?.length);

    const { data: attempts, error: aErr } = await supabase.from("assessment_attempts").select("*");
    console.log("Attempts count:", attempts?.length);

    const { data: results, error: rErr } = await supabase.from("assessment_results").select("id, attempt_id, user_id, aptitude_index, psychometric_index, overall_index");
    console.log("Results count:", results?.length);
    if (results?.length) {
        console.log("Results sample:", results.slice(0, 3));
    }

    const { data: visitors, error: vErr } = await supabase.from("website_visitors").select("*");
    console.log("Visitors count:", visitors?.length);

    const { data: inquiries, error: iErr } = await supabase.from("inquiries").select("*");
    console.log("Inquiries count:", inquiries?.length);
}

inspect().catch(console.error);
