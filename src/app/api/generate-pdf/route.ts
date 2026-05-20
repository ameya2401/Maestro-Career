import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { createRouteHandlerClient } from '@/lib/supabase/route';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { attemptId } = data;

    if (!attemptId) {
      return NextResponse.json({ error: 'Missing attemptId' }, { status: 400 });
    }

    const { supabase } = createRouteHandlerClient(req);

    const { data: userResp } = await supabase.auth.getUser();
    if (!userResp.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: resultData, error: dbError } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('attempt_id', attemptId)
      .eq('user_id', userResp.user.id)
      .single();

    if (dbError || !resultData) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    const name = userResp.user.user_metadata?.name || 'User';
    
    // Result data structure
    const topMatches = resultData.career_matches?.slice(0, 5) || [];
    const primaryMatch = topMatches[0] || { title: 'Unknown', summary: 'N/A', score: 0 };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Maestro Career Report</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
          body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; color: #333; }
          .page { width: 100%; height: 1100px; padding: 60px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; position: relative; page-break-after: always; }
          .bg-primary { background-color: #1294DD; color: white; }
          .header { font-size: 32px; font-weight: 800; margin-bottom: 20px; color: #1294DD; border-bottom: 3px solid #1294DD; padding-bottom: 10px; }
          .cover { align-items: center; text-align: center; }
          .title { font-size: 56px; font-weight: 800; margin-bottom: 10px; color: white; }
          .subtitle { font-size: 24px; color: #e0e0e0; }
          .section { margin-top: 30px; }
          .section h2 { font-size: 24px; color: #1294DD; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; }
          .card { background: #f9f9f9; padding: 30px; border-radius: 8px; border-left: 6px solid #1294DD; }
          p { font-size: 18px; line-height: 1.6; }
          .footer { position: absolute; bottom: 30px; left: 60px; right: 60px; font-size: 14px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
          .chart-container { width: 100%; max-width: 600px; margin: 40px auto; height: 350px; }
          .match-item { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 6px solid #1294DD; }
          .match-title { font-size: 24px; font-weight: 600; margin: 0 0 10px 0; }
          .match-score { font-size: 20px; color: #1294DD; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <!-- Page 1: Cover -->
        <div class="page cover bg-primary">
          <h1 class="title">Maestro Career</h1>
          <p class="subtitle">Complete Psychometric & Aptitude Report</p>
          <div style="margin-top: 60px; font-size: 22px;">
            <p style="margin-bottom: 5px; color: white;">Prepared for: <strong>${name}</strong></p>
            <p style="margin-top: 0; color: rgba(255,255,255,0.8);">Date: ${new Date(resultData.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <!-- Page 2: Assessment Summary -->
        <div class="page">
          <div class="header">1. Assessment Overview</div>
          <p>
            The Maestro Career Assessment combines rigorous psychometric profiling with aptitude evaluation to pinpoint your natural strengths and cognitive inclinations. 
            By analyzing your responses, we have evaluated your core competencies across logical reasoning, numerical ability, analytical thinking, emotional stability, adaptability, and more.
          </p>
          <div class="grid" style="margin-top: 40px;">
            <div class="card">
              <h2>Overall Index</h2>
              <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">${Math.round(resultData.overall_index)}%</p>
            </div>
            <div class="card" style="border-left-color: #10B981;">
              <h2>Aptitude Index</h2>
              <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">${Math.round(resultData.aptitude_index)}%</p>
            </div>
            <div class="card" style="border-left-color: #F59E0B;">
              <h2>Psychometric Index</h2>
              <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">${Math.round(resultData.psychometric_index)}%</p>
            </div>
          </div>
          <div class="footer">Maestro Career &copy; ${new Date().getFullYear()}</div>
        </div>

        <!-- Page 3: Best Suited Career Path -->
        <div class="page">
          <div class="header">2. Primary Recommendation</div>
          <p style="font-size: 24px;">Your highest scoring career path is:</p>
          <h1 style="font-size: 56px; color: #1294DD; margin: 20px 0;">${primaryMatch.title}</h1>
          <p style="font-size: 24px; font-weight: bold; color: #555;">Compatibility Score: ${Math.round(primaryMatch.score)}%</p>
          <div class="card section">
            <h2>Why this fits you</h2>
            <p>${primaryMatch.summary || 'Your problem-solving approach and professional tendencies strongly align with the key competencies of this career path.'}</p>
          </div>
          <div class="footer">Maestro Career &copy; ${new Date().getFullYear()}</div>
        </div>

        <!-- Page 4: Top Career Matches -->
        <div class="page">
          <div class="header">3. Top Career Matches</div>
          <p>Here are the highest ranking career profiles based on your assessment results:</p>
          <div style="margin-top: 30px;">
            ${topMatches.map((m: { title: string, score: number }) => {
              return '<div class="match-item">' +
                '<h3 class="match-title">' + m.title + '</h3>' +
                '<div class="match-score">' + Math.round(m.score) + '% Compatibility</div>' +
              '</div>';
            }).join('')}
          </div>
          <div class="footer">Maestro Career &copy; ${new Date().getFullYear()}</div>
        </div>

        <!-- Page 5: Conclusion -->
        <div class="page" style="text-align: center; justify-content: center; align-items: center;">
          <h2 style="color: #1294DD; font-size: 40px;">Professional Journey Ahead</h2>
          <p style="max-width: 600px; margin: 20px auto;">
            Knowledge without action is merely data. Leverage this report to target your upskilling, tailor your resume, and focus on roles that celebrate your natural inclinations.
          </p>
          <div style="margin-top: 50px; text-align: center; padding: 40px; background: #f0f8ff; border-radius: 12px; display: inline-block;">
            <h3 style="color: #1294DD; margin: 0; font-size: 28px;">Thank you for trusting Maestro Career.</h3>
          </div>
          <div class="footer">Maestro Career &copy; ${new Date().getFullYear()}</div>
        </div>

      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    await browser.close();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Maestro-Career-Report-' + attemptId + '.pdf"',
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
