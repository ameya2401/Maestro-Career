import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const resultId = searchParams.get('resultId') || 'latest';

        // In production, we'd use the host from the request or an env var
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const baseUrl = `${protocol}://${host}`;

        const printUrl = `${baseUrl}/report?resultId=${resultId}&print=true`;

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set viewport to A4 aspect ratio at high DPI
        await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

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
