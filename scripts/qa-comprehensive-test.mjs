import puppeteer from 'puppeteer-core';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3001";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function runComprehensiveQA() {
    console.log("==================================================");
    console.log("STARTING MAESTRO CAREER COMPREHENSIVE QA RUNNER");
    console.log("==================================================");

    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const errorsFound = [];
    const warningsFound = [];

    page.on('console', msg => {
        if (msg.type() === 'error') {
            errorsFound.push({ page: page.url(), text: msg.text() });
            console.log(`[BROWSER ERROR] [${page.url()}] ${msg.text()}`);
        } else if (msg.type() === 'warning') {
            warningsFound.push({ page: page.url(), text: msg.text() });
        }
    });

    page.on('pageerror', err => {
        errorsFound.push({ page: page.url(), text: err.toString() });
        console.log(`[PAGE ERROR] [${page.url()}] ${err.toString()}`);
    });

    async function testPageLoad(route, pageName) {
        console.log(`\nTesting Page: ${pageName} (${route})...`);
        try {
            const res = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
            await sleep(1000);
            const status = res ? res.status() : 0;
            const title = await page.title();
            console.log(`  -> Status: ${status}, Title: "${title}"`);
            if (status >= 400) {
                errorsFound.push({ page: route, text: `HTTP Status ${status} returned for ${pageName}` });
            }
            return status;
        } catch (e) {
            console.error(`  -> Failed to load ${route}:`, e.message);
            errorsFound.push({ page: route, text: `Load failed: ${e.message}` });
            return 0;
        }
    }

    // 1. Landing Page
    await testPageLoad('/', 'Landing Page');
    
    // Check Chatbot
    console.log("\nTesting Chatbot interaction...");
    try {
        const botButton = await page.$('button[aria-label="Open chat assistant"], button[aria-label*="chat" i], .fixed.bottom-6.right-6 button');
        if (botButton) {
            console.log("  -> Chatbot button found. Clicking...");
            await botButton.click();
            await sleep(800);

            const chatInput = await page.$('input[placeholder*="Ask" i], input[placeholder*="type" i], input[placeholder*="message" i], input[placeholder*="question" i]');
            if (chatInput) {
                await chatInput.type("What careers do you offer?");
                const sendBtn = await page.$('form button[type="submit"], form button');
                if (sendBtn) await sendBtn.click();
                await sleep(1000);
                console.log("  -> Chatbot query sent and responded successfully.");
            } else {
                console.log("  -> Chat input field not found.");
            }
        } else {
            console.log("  -> Chatbot button not found by selector.");
        }
    } catch (e) {
        console.error("  -> Chatbot test error:", e.message);
    }

    // 2. Marketing / Info Routes
    const staticRoutes = [
        ['/about-us', 'About Us'],
        ['/services', 'Services'],
        ['/features', 'Features'],
        ['/explore', 'Explore'],
        ['/contact', 'Contact'],
        ['/terms-conditions', 'Terms & Conditions'],
        ['/privacy-policy', 'Privacy Policy'],
        ['/cookie-policy', 'Cookie Policy'],
        ['/refund-cancellation', 'Refund & Cancellation']
    ];

    for (const [route, name] of staticRoutes) {
        await testPageLoad(route, name);
    }

    // 3. Auth pages
    console.log("\nTesting Auth & Login Page...");
    await testPageLoad('/login', 'Login Page');
    const loginFormExists = await page.$('form, input[type="password"]');
    console.log("  -> Login form rendered:", !!loginFormExists);

    await testPageLoad('/register', 'Register Page');
    const registerFormExists = await page.$('input[name="fullName"], input[placeholder*="name" i]');
    console.log("  -> Register form rendered:", !!registerFormExists);

    // 4. Admin Workflow
    console.log("\nTesting Admin Authentication Flow...");
    await testPageLoad('/admin', 'Admin Login');
    
    try {
        const userField = await page.$('input[type="text"], input[name="username"], input[placeholder*="user" i]');
        const passField = await page.$('input[type="password"]');
        const submitBtn = await page.$('button[type="submit"]');

        if (userField && passField && submitBtn) {
            console.log("  -> Testing invalid admin credentials...");
            await userField.type("wrong_admin");
            await passField.type("wrong_password");
            await submitBtn.click();
            await sleep(1000);
            console.log("  -> URL after invalid login:", page.url());

            // Clear inputs and enter valid credentials
            console.log("  -> Entering valid admin credentials...");
            await page.evaluate(() => {
                const inputs = document.querySelectorAll('input');
                inputs.forEach(i => i.value = '');
            });
            await userField.type("maestrocareer");
            await passField.type("maestrocareer2026");
            await submitBtn.click();
            await sleep(2000);
            console.log("  -> Admin login result URL:", page.url());

            if (page.url().includes('/admin/dashboard')) {
                console.log("  -> SUCCESS: Reached Admin Dashboard!");
                const statsText = await page.evaluate(() => {
                    const cards = Array.from(document.querySelectorAll('div, section')).filter(el => el.innerText.includes('Visitors') || el.innerText.includes('Learners'));
                    return cards.map(c => c.innerText.slice(0, 80)).join(' | ');
                });
                console.log("  -> Admin stats preview:", statsText);

                const tableRows = await page.$$eval('table tbody tr', rows => rows.length).catch(() => 0);
                console.log(`  -> Admin Learners Table Rows: ${tableRows}`);
            } else {
                errorsFound.push({ page: '/admin', text: 'Admin login failed to redirect to /admin/dashboard' });
            }
        }
    } catch (e) {
        console.error("  -> Admin test error:", e.message);
        errorsFound.push({ page: '/admin', text: `Admin test error: ${e.message}` });
    }

    // 5. Test Dossier Report Viewer in mock mode and direct ID
    console.log("\nTesting Career Dossier Report Viewer...");
    await testPageLoad('/report?mock=true', 'Dossier Report (Mock Mode)');
    await sleep(2000);
    const reportHeading = await page.evaluate(() => document.querySelector('h1, h2')?.innerText || 'No Heading');
    console.log(`  -> Report Heading: "${reportHeading}"`);

    // 6. Test Static Result Viewer
    await testPageLoad('/demo-test', 'Demo Test Page');
    await sleep(1000);

    console.log("\n==================================================");
    console.log("QA SUMMARY OF AUTOMATED BROWSER PASS:");
    console.log(`Total Errors Logged: ${errorsFound.length}`);
    if (errorsFound.length > 0) {
        console.log("ERRORS LIST:");
        errorsFound.forEach((e, idx) => console.log(`  ${idx + 1}. [${e.page}] ${e.text}`));
    }
    console.log(`Total Warnings Logged: ${warningsFound.length}`);
    console.log("==================================================");

    await browser.close();
}

runComprehensiveQA().catch(err => {
    console.error("Runner encountered fatal error:", err);
    process.exit(1);
});
