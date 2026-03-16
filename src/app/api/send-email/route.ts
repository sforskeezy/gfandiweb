import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

function normalizeFromEmail(raw: string): string {
  const match = raw.match(/<([^>]+)>/);
  const addr = (match ? match[1] : raw).trim();
  const atIdx = addr.lastIndexOf("@");
  if (atIdx === -1) return raw;
  const local = addr.slice(0, atIdx);
  const domain = addr.slice(atIdx + 1).toLowerCase();
  const normalized = `${local}@${domain}`;
  return match ? raw.replace(match[1], normalized) : normalized;
}

const FROM_EMAIL = normalizeFromEmail(process.env.FROM_EMAIL || "6POINT Solutions <hello@6pointsolutions.com>");

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, firstName } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const textBody = [
      firstName ? `Hey ${firstName},\n\n` : "",
      body,
      "\n\nRegards,\nThe 6POINT Team\n\n6pointsolutions.com",
    ].join("");

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      text: textBody,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;color:#333;line-height:1.6;background:#fff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
<tr><td style="padding:32px 24px;">
<p style="margin:0 0 24px;font-size:20px;font-weight:700;color:#1A1A1A;">6POINT</p>
${firstName ? `<p style="margin:0 0 16px;">Hey ${firstName},</p>` : ""}
<p style="margin:0 0 24px;white-space:pre-wrap;">${body}</p>
<p style="margin:0;color:#666;">Regards,<br>The 6POINT Team</p>
<p style="margin:12px 0 0;font-size:13px;"><a href="https://6pointsolutions.com" style="color:#86868b;text-decoration:none;">6pointsolutions.com</a></p>
</td></tr>
</table>
</body>
</html>
      `.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Send email error:", error);
    const msg = error && typeof error === "object" && "message" in error ? String((error as { message: string }).message) : "Failed to send";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
