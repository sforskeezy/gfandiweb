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

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f2f2f7; padding: 40px 0;">
          <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 48px 44px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
              <tr>
                <td style="vertical-align: middle;"><p style="margin: 0; font-size: 22px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.02em;">6POINT</p></td>
                <td style="vertical-align: middle; text-align: right;"><img src="https://6pointsolutions.com/d2b8263f-f484-4783-8fd0-daf49e85220b.png" alt="6POINT" width="32" height="32" style="display: block; margin-left: auto;" /></td>
              </tr>
            </table>

            ${firstName ? `<p style="margin: 0 0 16px; font-size: 15px; color: #1A1A1A; line-height: 1.6;">Hey ${firstName},</p>` : ""}

            <div style="font-size: 15px; color: #333; line-height: 1.7; white-space: pre-wrap;">${body}</div>

            <p style="margin: 40px 0 0; font-size: 15px; color: #333;">Regards,</p>
            <p style="margin: 4px 0 0; font-size: 15px; color: #333;">The 6POINT Team</p>
          </div>

          <div style="max-width: 680px; margin: 0 auto; text-align: center; padding: 28px 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #86868b;">Copyright &copy; ${new Date().getFullYear()} 6POINT Solutions. All rights reserved.</p>
            <p style="margin: 8px 0 0; font-size: 12px;">
              <a href="https://6pointsolutions.com" style="color: #86868b; text-decoration: none;">6pointsolutions.com</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Send email error:", error);
    const msg = error && typeof error === "object" && "message" in error ? String((error as { message: string }).message) : "Failed to send";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
