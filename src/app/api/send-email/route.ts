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

    const year = new Date().getFullYear();

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      text: [
        firstName ? `Hey ${firstName},` : "",
        "",
        body,
        "",
        "Regards,",
        "The 6POINT Team",
        "6pointsolutions.com",
      ].filter(Boolean).join("\n"),
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; background-color: #f2f2f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f2f2f7; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 680px; background: #ffffff; border-radius: 12px;">
          <tr>
            <td style="padding: 44px 44px 40px;">
              <p style="margin: 0 0 36px; font-size: 22px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.02em;">6POINT</p>
              ${firstName ? `<p style="margin: 0 0 16px; font-size: 15px; color: #1d1d1f; line-height: 1.6;">Hey ${firstName},</p>` : ""}
              <p style="margin: 0; font-size: 15px; color: #1d1d1f; line-height: 1.6; white-space: pre-wrap;">${body}</p>
              <!-- Sign off -->
              <p style="margin: 36px 0 0; font-size: 15px; color: #1d1d1f;">Regards,</p>
              <p style="margin: 2px 0 0; font-size: 15px; color: #7B8C6F; font-weight: 500;">The 6POINT Team</p>
            </td>
          </tr>
        </table>
        <!-- Footer -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 680px;">
          <tr>
            <td style="padding: 24px 0 0; text-align: center; font-size: 12px; color: #86868b; line-height: 1.5;">
              Copyright &copy; ${year} 6POINT Solutions. All rights reserved.
              <br><a href="https://6pointsolutions.com" style="color: #86868b; text-decoration: none;">6pointsolutions.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
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
