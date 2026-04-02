import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "6POINT Solutions <onboarding@resend.dev>";
const RAPIDAPI_KEY = "5c7ce818cfmsh7e1944115367b76p17808fjsn0956139896ed";

/* ── Rewrite for client consumption ── */
async function rewriteForClient(report: string, businessName: string): Promise<string> {
  const prompt = `You are rewriting a business analysis report so it can be sent directly to the business owner as a professional email from 6POINT Solutions (a web design agency).

The business name is "${businessName}". Use this actual name — NEVER use placeholders like [Business Name] or [Your Name] or any bracketed fillers.

RULES:
- Remove ALL competitive intelligence, competitor names, and competitor URLs
- Remove ALL internal strategy sections like "How 6POINT Can Increase Their Clientele" — reframe as "How We Can Help You Grow"
- Remove risk factors / red flags — don't scare the client
- Remove raw data source references (don't mention "our AI scraped your Facebook")
- Keep the tone warm, professional, and consultative — like a trusted advisor
- Keep scores — business owners love seeing their ratings
- Keep website improvement suggestions — frame them as opportunities, not weaknesses
- Keep social media insights — frame positively with growth potential
- Add a brief intro paragraph addressing the business directly by name
- NEVER use placeholder text in brackets like [Name], [Business], [Your Name], etc. — use real values only
- Sign off with exactly: "Skylar & Jenna :)" then on the next line "6pointsolutions.com" then "davis50088@gmail.com"
- End with a call-to-action inviting them to reply or book a call
- Use ## for section headings, **bold** for emphasis
- Use FEWER bullet points — prefer short paragraphs and prose over long bullet lists. Only use bullets for 3-5 key items max per section.
- Keep it concise — aim for about 60% the length of the original

ORIGINAL INTERNAL REPORT:
${report}

Write ONLY the rewritten client-facing report. No preamble.`;

  try {
    const res = await fetch("https://gpt-4o.p.rapidapi.com/chat/completions", {
      method: "POST",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "gpt-4o.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(60000),
    });
    const data = await res.json();
    if (data?.choices?.[0]?.message?.content) return data.choices[0].message.content;
  } catch { /* fall through to fallback */ }
  
  // Fallback: strip sensitive sections manually
  return report
    .replace(/## (?:Competitive Intelligence|Risk Factors|How 6POINT Can)[\s\S]*?(?=## |$)/gi, "")
    .replace(/## Weaknesses/gi, "## Growth Opportunities");
}

/* ── Convert markdown to styled HTML ── */
function reportToHtml(report: string, businessName: string): string {
  const lines = report.split("\n");
  let html = "";
  for (const line of lines) {
    const t = line.trim();
    if (!t) { html += '<div style="height:12px"></div>'; continue; }
    if (t === "---" || t === "***") { html += '<hr style="border:none;border-top:1px solid #E5E5EA;margin:28px 0">'; continue; }
    if (t.startsWith("## ")) { html += `<h2 style="margin:32px 0 12px;font-size:17px;font-weight:700;color:#1A1A1A;border-bottom:2px solid #7B8C6F;padding-bottom:8px;display:inline-block">${esc(t.slice(3))}</h2>`; continue; }
    if (t.startsWith("### ")) { html += `<h3 style="margin:24px 0 8px;font-size:15px;font-weight:600;color:#333">${esc(t.slice(4))}</h3>`; continue; }
    if (/^# [^#]/.test(t)) { html += `<h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1A1A1A">${esc(t.slice(2))}</h1>`; continue; }
    const scoreMatch = t.match(/^[-*]\s*(.+?):\s*(\d+)\/100$/);
    if (scoreMatch) {
      const num = parseInt(scoreMatch[2]);
      const color = num >= 70 ? "#34A853" : num >= 40 ? "#FBBC04" : "#EA4335";
      html += `<div style="display:flex;align-items:center;gap:12px;margin:6px 0;padding:8px 0"><span style="width:140px;font-size:13px;font-weight:500;color:#666;flex-shrink:0">${esc(scoreMatch[1])}</span><div style="flex:1;height:6px;background:#F0F0F0;border-radius:3px;overflow:hidden"><div style="width:${num}%;height:100%;background:${color};border-radius:3px"></div></div><span style="font-size:14px;font-weight:700;color:${color};width:32px;text-align:right">${scoreMatch[2]}</span></div>`;
      continue;
    }
    const numMatch = t.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) { html += `<div style="display:flex;gap:10px;padding:4px 0;margin-left:4px"><span style="font-size:12px;font-weight:700;color:#999;margin-top:2px;width:18px;text-align:right;flex-shrink:0">${numMatch[1]}.</span><span style="font-size:14px;line-height:1.6;color:#333">${inlineFmt(numMatch[2])}</span></div>`; continue; }
    if (t.startsWith("- ") || t.startsWith("* ")) { html += `<div style="display:flex;gap:10px;padding:3px 0;margin-left:4px"><span style="color:#7B8C6F;margin-top:4px;font-size:13px;font-weight:300">—</span><span style="font-size:14px;line-height:1.6;color:#333">${inlineFmt(t.slice(2))}</span></div>`; continue; }
    html += `<p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:#444">${inlineFmt(t)}</p>`;
  }
  return html;
}

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function inlineFmt(text: string): string {
  let out = esc(text);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:600;color:#1A1A1A">$1</strong>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#2D7FF9;text-decoration:underline;text-underline-offset:2px">$1</a>');
  out = out.replace(/`([^`]+)`/g, '<code style="background:#F5F5F7;padding:2px 6px;border-radius:4px;font-size:12px;font-family:monospace;color:#333">$1</code>');
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const { to, businessName, report } = await req.json();

    if (!to || !report || !businessName) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    // Rewrite for client
    const clientReport = await rewriteForClient(report, businessName);

    const year = new Date().getFullYear();
    const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const reportHtml = reportToHtml(clientReport, businessName);

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2F2F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2F7;padding:40px 16px">
    <tr><td align="center">
      <!-- Header -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px;background:#1A1A1A;border-radius:12px 12px 0 0">
        <tr><td style="padding:32px 40px">
          <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#7B8C6F;text-transform:uppercase">6POINT INTELLIGENCE</p>
          <h1 style="margin:8px 0 0;font-size:24px;font-weight:700;color:#FFFFFF;letter-spacing:-0.03em">${esc(businessName)}</h1>
          <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.4)">${date} · Business Analysis Report</p>
        </td></tr>
      </table>
      <!-- Body -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px;background:#FFFFFF">
        <tr><td style="padding:36px 40px 44px">
          ${reportHtml}
        </td></tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px;background:#FAFAFA;border-radius:0 0 12px 12px">
        <tr><td style="padding:28px 40px">
          <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#1A1A1A">Skylar & Jenna :)</p>
          <p style="margin:0 0 2px;font-size:13px;color:#7B8C6F;font-weight:500"><a href="https://6pointsolutions.com" style="color:#7B8C6F;text-decoration:none">6pointsolutions.com</a></p>
          <p style="margin:0;font-size:13px;color:#999"><a href="mailto:davis50088@gmail.com" style="color:#999;text-decoration:none">davis50088@gmail.com</a></p>
        </td></tr>
      </table>
      <!-- Legal -->
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px">
        <tr><td style="padding:20px 0;text-align:center;font-size:11px;color:#AEAEB2;line-height:1.5">
          © ${year} 6POINT Solutions. All rights reserved.
          <br><a href="https://6pointsolutions.com" style="color:#AEAEB2;text-decoration:none">6pointsolutions.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Business Analysis: ${businessName} — 6POINT Intelligence`,
      html,
      text: report,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Analysis email error:", error);
    const msg = error && typeof error === "object" && "message" in error ? String((error as { message: string }).message) : "Failed to send";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
