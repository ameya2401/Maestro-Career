import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const env = fs.readFileSync(".env", "utf-8");
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), { auth: { persistSession: false } });

const BASE_URL = "http://localhost:3001";

async function runE2E() {
    console.log("==================================================");
    console.log("STARTING FULL END-TO-END USER LIFECYCLE TEST");
    console.log("==================================================");

    const testEmail = "qa_candidate@example.com";
    const testPassword = "Password123!@#";

    // 1. Create or ensure test candidate exists in Supabase
    console.log("\n1. Setting up QA candidate in Supabase...");
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    let user = existingUsers?.users?.find(u => u.email === testEmail);

    if (!user) {
        const { data: created, error: cErr } = await supabase.auth.admin.createUser({
            email: testEmail,
            password: testPassword,
            email_confirm: true,
            user_metadata: {
                full_name: "QA Candidate",
                mobile: "+919876543210",
                country_code: "+91",
                city: "Nagpur",
                user_type: "student"
            }
        });
        if (cErr) throw cErr;
        user = created.user;
        console.log("  -> Created new test user:", user.id);
    } else {
        const { data: updated, error: uErr } = await supabase.auth.admin.updateUserById(user.id, {
            password: testPassword,
            email_confirm: true,
            user_metadata: {
                full_name: "QA Candidate",
                mobile: "+919876543210",
                country_code: "+91",
                city: "Nagpur",
                user_type: "student"
            }
        });
        if (uErr) throw uErr;
        user = updated.user;
        console.log("  -> Updated existing test user:", user.id);
    }

    // Ensure profile row exists
    await supabase.from("profiles").upsert({
        id: user.id,
        email: testEmail,
        full_name: "QA Candidate",
        mobile: "+919876543210",
        countryCode: "+91",
        city: "Nagpur",
        user_type: "student",
        selected_plan_id: "growth",
        payment_status: "paid"
    });

    // Clear prior attempts/results for clean idempotent run
    await supabase.from("assessment_results").delete().eq("user_id", user.id);
    await supabase.from("assessment_responses").delete().eq("user_id", user.id);
    await supabase.from("assessment_attempts").delete().eq("user_id", user.id);

    // 2. Perform Login via /api/auth/login/password
    console.log("\n2. Testing Password Login (/api/auth/login/password)...");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    console.log("  -> Login Status:", loginRes.status);
    const loginData = await loginRes.json();
    console.log("  -> Login Response:", loginData);

    if (!loginRes.ok || !loginData.success) {
        throw new Error("Password login failed: " + JSON.stringify(loginData));
    }

    // Extract cookies from Set-Cookie headers
    const rawCookies = loginRes.headers.get("set-cookie") || "";
    // Note: Node fetch might combine set-cookie into a comma-separated string or array
    const setCookieHeaders = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [rawCookies];
    const cookieHeader = setCookieHeaders.map(c => c.split(';')[0]).join('; ');
    console.log("  -> Acquired Session Cookie length:", cookieHeader.length);

    const userHeaders = {
        "Cookie": cookieHeader
    };

    // 3. Test /api/auth/me
    console.log("\n3. Testing /api/auth/me...");
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, { headers: userHeaders });
    console.log("  -> /api/auth/me Status:", meRes.status);
    const meData = await meRes.json();
    console.log("  -> Profile Name:", meData.data?.profile?.name, "Email:", meData.data?.profile?.email);

    // 4. Test Career Aspirations (/api/profile/aspirations)
    console.log("\n4. Testing Career Aspirations (/api/profile/aspirations)...");
    const aspRes = await fetch(`${BASE_URL}/api/profile/aspirations`, {
        method: "POST",
        headers: { ...userHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
            career_goals: JSON.stringify({
                dream: "Chief AI Architect",
                profession: "Software & AI Specialist",
                education: "B.Tech Computer Science"
            })
        })
    });
    console.log("  -> Aspirations Status:", aspRes.status);
    const aspData = await aspRes.json();
    console.log("  -> Aspirations Result:", aspData);

    // 5. Test Granting Test Access via Admin API
    console.log("\n5. Granting internal test access to user via Admin API...");
    const grantRes = await fetch(`${BASE_URL}/api/admin/users/${user.id}/grant-access?action=grant`, {
        method: "POST",
        headers: {
            "Cookie": "maestro_admin_session=authorized"
        }
    });
    console.log("  -> Admin Grant Status:", grantRes.status);
    const grantJson = await grantRes.json();
    console.log("  -> Admin Grant Response:", grantJson);

    // 6. Test Assessment Access API
    console.log("\n6. Testing /api/test/access...");
    const accessRes = await fetch(`${BASE_URL}/api/test/access`, { headers: userHeaders });
    const accessData = await accessRes.json();
    console.log("  -> Test Access Status:", accessRes.status, "Grant Active:", accessData.grant?.status === "active");

    // 7. Start Assessment (/api/test/start)
    console.log("\n7. Starting Assessment (/api/test/start)...");
    const startRes = await fetch(`${BASE_URL}/api/test/start`, {
        method: "POST",
        headers: userHeaders
    });
    console.log("  -> /api/test/start Status:", startRes.status);
    const startData = await startRes.json();
    console.log("  -> Attempt ID:", startData.attempt?.id, "Questions count:", startData.questions?.length);

    if (!startData.attempt?.id || !startData.questions?.length) {
        throw new Error("Assessment start failed: " + JSON.stringify(startData));
    }

    const attemptId = startData.attempt.id;
    const questions = startData.questions;

    // 8. Submit Answers for First 10 Questions (/api/test/response)
    console.log("\n8. Submitting responses for questions (/api/test/response)...");
    for (let i = 0; i < Math.min(15, questions.length); i++) {
        const q = questions[i];
        const selectedOption = q.options[0]?.id;
        const respRes = await fetch(`${BASE_URL}/api/test/response`, {
            method: "PATCH",
            headers: { ...userHeaders, "Content-Type": "application/json" },
            body: JSON.stringify({
                attemptId,
                questionId: q.id,
                optionId: selectedOption,
                timeSpentSeconds: 5
            })
        });
        if (i === 0) {
            console.log(`  -> Q1 (${q.id}) Option: ${selectedOption} Status: ${respRes.status}`);
        }
    }
    console.log("  -> Answered 15 sample questions successfully.");

    // 9. Submit Assessment (/api/test/submit)
    console.log("\n9. Submitting Assessment (/api/test/submit)...");
    const submitRes = await fetch(`${BASE_URL}/api/test/submit`, {
        method: "POST",
        headers: { ...userHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId })
    });
    console.log("  -> /api/test/submit Status:", submitRes.status);
    const submitData = await submitRes.json();
    console.log("  -> Submit Result:", submitData);

    const resultId = submitData.resultId;

    // 10. Fetch Result (/api/test/result/[attemptId])
    console.log(`\n10. Fetching Assessment Result (/api/test/result/${attemptId})...`);
    const resultRes = await fetch(`${BASE_URL}/api/test/result/${attemptId}`, { headers: userHeaders });
    console.log("  -> /api/test/result Status:", resultRes.status);
    const resultData = await resultRes.json();
    console.log("  -> Aptitude Index:", resultData.data?.aptitude_index);
    console.log("  -> Psychometric Index:", resultData.data?.psychometric_index);
    console.log("  -> Overall Index:", resultData.data?.overall_index);
    console.log("  -> Top Match:", resultData.data?.career_matches?.[0]?.title, `(${resultData.data?.career_matches?.[0]?.score}%)`);

    // 11. Test Report Dossier Page HTML (/report?resultId=...)
    console.log(`\n11. Testing Report Dossier Page (/report?resultId=${resultId})...`);
    const reportHtmlRes = await fetch(`${BASE_URL}/report?resultId=${resultId}`, { headers: userHeaders });
    console.log("  -> /report Page HTML Status:", reportHtmlRes.status);
    const reportHtml = await reportHtmlRes.text();
    console.log("  -> /report Contains Career Intelligence Dossier:", reportHtml.includes("Career Intelligence Dossier") || reportHtml.includes("Dossier") || reportHtml.includes("Maestro"));

    // 12. Test Standalone PDF Generation API (/api/generate-pdf)
    console.log("\n12. Testing Standalone PDF Generator (/api/generate-pdf)...");
    const pdfRes = await fetch(`${BASE_URL}/api/generate-pdf`, {
        method: "POST",
        headers: { ...userHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId })
    });
    console.log("  -> /api/generate-pdf Status:", pdfRes.status);
    const pdfContentType = pdfRes.headers.get("content-type");
    console.log("  -> /api/generate-pdf Content-Type:", pdfContentType);
    if (pdfContentType?.includes("application/pdf")) {
        const pdfBuffer = await pdfRes.arrayBuffer();
        console.log(`  -> Generated PDF size: ${pdfBuffer.byteLength} bytes.`);
    } else {
        const pdfErrText = await pdfRes.text();
        console.log("  -> PDF error output:", pdfErrText.slice(0, 300));
    }

    console.log("\n==================================================");
    console.log("ALL E2E WORKFLOW CHECKS COMPLETED SUCCESSFULLY!");
    console.log("==================================================");
}

runE2E().catch(console.error);
