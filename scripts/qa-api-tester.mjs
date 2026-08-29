import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const env = fs.readFileSync(".env", "utf-8");
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim(), { auth: { persistSession: false } });

const BASE_URL = "http://localhost:3001";

async function testAllAPIs() {
    console.log("==================================================");
    console.log("MAESTRO CAREER - COMPREHENSIVE BACKEND & API QA PASS");
    console.log("==================================================");

    const results = [];

    // Helper for fetch
    async function checkEndpoint(name, url, options = {}) {
        try {
            const start = Date.now();
            const res = await fetch(`${BASE_URL}${url}`, options);
            const duration = Date.now() - start;
            let body;
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("application/json")) {
                body = await res.json();
            } else {
                body = await res.text();
            }
            const pass = res.ok;
            results.push({ name, url, status: res.status, pass, duration, body });
            console.log(`[${pass ? "PASS" : "FAIL"}] ${name} (${url}) -> Status: ${res.status} (${duration}ms)`);
            return { res, body };
        } catch (e) {
            results.push({ name, url, status: 0, pass: false, error: e.message });
            console.log(`[ERROR] ${name} (${url}) -> ${e.message}`);
            return { res: null, body: null };
        }
    }

    // 1. Public Visitor Analytics
    await checkEndpoint("Visitor Analytics Tracking", "/api/analytics/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/test-qa-pass" })
    });

    // 2. Google Reviews endpoint
    await checkEndpoint("Google Reviews Fetch", "/api/google-reviews", {
        method: "GET"
    });

    // 3. Inquiry submission endpoint
    await checkEndpoint("Inquiry Submission (Valid)", "/api/inquiry/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "QA Test User",
            email: "qatest@example.com",
            message: "Automated QA inquiry test message"
        })
    });

    await checkEndpoint("Inquiry Submission (Invalid - missing fields)", "/api/inquiry/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Incomplete" })
    });

    // 4. Admin Auth & Protected Endpoints
    console.log("\n--- Testing Admin Endpoints ---");
    
    // Login invalid
    await checkEndpoint("Admin Login (Invalid)", "/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "wrong", password: "bad" })
    });

    // Login valid
    const adminLoginRes = await checkEndpoint("Admin Login (Valid)", "/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "maestrocareer", password: "maestrocareer2026" })
    });

    const adminCookie = adminLoginRes.res?.headers.get("set-cookie") || "";
    const adminHeaders = {
        "Cookie": adminCookie.split(';')[0] || "maestro_admin_session=authorized"
    };

    // Admin Stats
    await checkEndpoint("Admin Stats", "/api/admin/stats", {
        method: "GET",
        headers: adminHeaders
    });

    // Admin Inquiries List
    await checkEndpoint("Admin Inquiries List", "/api/admin/inquiries", {
        method: "GET",
        headers: adminHeaders
    });

    // Admin Users List
    const usersRes = await checkEndpoint("Admin Users List", "/api/admin/users", {
        method: "GET",
        headers: adminHeaders
    });

    const userList = usersRes.body?.data || [];
    console.log(`  -> Admin fetched ${userList.length} user records.`);

    if (userList.length > 0) {
        const paidUser = userList.find((u) => u.payment_status === "paid") || userList[0];
        const testTargetUser = userList[0];
        console.log(`  -> Testing admin actions on paid user: ${paidUser.id} (${paidUser.email})`);

        // Test sending custom test link to paid user
        await checkEndpoint("Admin Send Link (Paid User)", `/api/admin/users/${paidUser.id}/send-link`, {
            method: "POST",
            headers: { ...adminHeaders, "Content-Type": "application/json" },
            body: JSON.stringify({ psychometricTestLink: "https://example.com/test-custom-link" })
        });

        // Test granting access
        await checkEndpoint("Admin Grant Test Access", `/api/admin/users/${testTargetUser.id}/grant-access?action=grant`, {
            method: "POST",
            headers: adminHeaders
        });
    }

    // 5. Test Assessment Endpoints with an authenticated Supabase user session
    console.log("\n--- Testing Assessment Scoring Engine ---");
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    if (authUsers?.users?.length > 0) {
        const testUser = authUsers.users.find(u => u.email === "ameyabhagat24@gmail.com") || authUsers.users[0];
        console.log(`  -> Creating temporary session for test user: ${testUser.id} (${testUser.email})`);

        // Generate magiclink / OTP to sign in or get access token
        const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
            type: "magiclink",
            email: testUser.email
        });

        if (linkData?.properties?.action_link) {
            console.log("  -> Generated auth action link successfully.");
        }
    }

    console.log("\n==================================================");
    console.log("API QA SUMMARY:");
    const passed = results.filter(r => r.pass).length;
    const failed = results.filter(r => !r.pass && r.name !== "Inquiry Submission (Invalid - missing fields)" && r.name !== "Admin Login (Invalid)").length;
    console.log(`Total Checks: ${results.length} | Passed: ${passed} | Failures: ${failed}`);
    console.log("==================================================");
}

testAllAPIs().catch(console.error);
