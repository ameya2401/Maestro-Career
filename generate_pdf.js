const puppeteer = require('puppeteer-core');

(async () => {
    try {
        console.log("Starting browser...");
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true
        });
        
        console.log("Opening new page...");
        const page = await browser.newPage();
        
        console.log("Navigating to report...");
        await page.goto('http://localhost:3000/report?mock=true&print=true', { waitUntil: 'networkidle0' });
        
        console.log("Generating PDF...");
        await page.pdf({ 
            path: 'C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\0e49d002-1e98-40c0-8231-a9f92eb2af68\\mock_career_report.pdf',
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });
        
        await browser.close();
        console.log("PDF generated successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error generating PDF:", err);
        process.exit(1);
    }
})();
