import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const resultId = searchParams.get('resultId') || 'latest';

        // In production, we'd use the host from the request or an env var
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const baseUrl = `${protocol}://${host}`;

        const printUrl = `${baseUrl}/report?resultId=${resultId}&print=true`;

        const isLocal = process.env.NODE_ENV === 'development';
        const browser = await puppeteer.launch({
            args: isLocal ? [] : chromium.args,
            executablePath: isLocal ?
                (process.platform === 'win32'
                    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
                : await chromium.executablePath(),
            headless: true,
        });

        const page = await browser.newPage();

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
        await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 60000 });

        // Wait for fonts to be ready
        await page.evaluateHandle('document.fonts.ready');

        // Wait for charts and any final rendering (3 seconds as requested)
        await new Promise(resolve => setTimeout(resolve, 3000));

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' },
            preferCSSPageSize: true,
            displayHeaderFooter: false
        });

        await browser.close();


        return new NextResponse(pdfBuffer as any, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Maestro-Career-Intelligence-${resultId}.pdf"`,
            },
        });


    } catch (error) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate premium report' }, { status: 500 });
    }
}
