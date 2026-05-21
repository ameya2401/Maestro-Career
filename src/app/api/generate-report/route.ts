import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const resultId = searchParams.get('resultId') || 'latest';

        console.log(`[PDF] Starting generation for resultId: ${resultId}`);

        // In production, we'd use the host from the request or an env var
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const baseUrl = `${protocol}://${host}`;
        const printUrl = `${baseUrl}/report?resultId=${resultId}&print=true`;

        console.log(`[PDF] Navigating to: ${printUrl}`);

        const isLocal = process.env.NODE_ENV === 'development';
        let browser;

        try {
            console.log(`[PDF] Launching browser (Local: ${isLocal})`);
            browser = await puppeteer.launch({
                args: isLocal ? [] : [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
                executablePath: isLocal ?
                    (process.platform === 'win32'
                        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
                    : await chromium.executablePath(),
                headless: true,
            });
            console.log(`[PDF] Browser launched successfully`);
        } catch (launchError) {
            console.error('[PDF] Browser launch failed:', launchError);
            return NextResponse.json({ error: 'Failed to initialize PDF engine', details: String(launchError) }, { status: 500 });
        }

        try {
            const page = await browser.newPage();
            console.log(`[PDF] New page opened`);

            // Set viewport to A4 aspect ratio at high DPI
            await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

            // Forward cookies for authentication
            const cookieHeader = req.headers.get('cookie');
            if (cookieHeader) {
                const cookies = cookieHeader.split(';').map(c => {
                    const [name, ...rest] = c.trim().split('=');
                    return {
                        name,
                        value: rest.join('='),
                        domain: host?.split(':')[0] || 'localhost',
                        path: '/',
                    };
                });
                await page.setCookie(...cookies);
            }

            // Emulate print media type
            await page.emulateMediaType('print');

            // Navigate to the report page
            console.log(`[PDF] Navigating to page...`);
            await page.goto(printUrl, {
                waitUntil: 'networkidle0',
                timeout: 25000 // Reduced timeout for Vercel
            });
            console.log(`[PDF] Navigation complete`);

            // Wait for fonts to be ready
            await page.evaluateHandle('document.fonts.ready');

            // Wait for charts and any final rendering
            console.log(`[PDF] Waiting for final render...`);
            await new Promise(resolve => setTimeout(resolve, 2000));

            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '0', right: '0', bottom: '0', left: '0' },
                preferCSSPageSize: true,
                displayHeaderFooter: false
            });
            console.log(`[PDF] PDF buffer generated (${pdfBuffer.length} bytes)`);

            await browser.close();

            return new NextResponse(pdfBuffer as any, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="Maestro-Career-Intelligence-${resultId}.pdf"`,
                    'Cache-Control': 'no-cache'
                },
            });
        } catch (pageError) {
            console.error('[PDF] Page processing failed:', pageError);
            if (browser) await browser.close();
            return NextResponse.json({
                error: 'Failed to render report PDF',
                details: pageError instanceof Error ? pageError.message : String(pageError)
            }, { status: 500 });
        }
    } catch (globalError) {
        console.error('[PDF] Global Failure:', globalError);
        return NextResponse.json({ error: 'Critical PDF Generation Error' }, { status: 500 });
    }
}
