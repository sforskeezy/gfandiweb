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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="border: 2px solid #7B8C6F; border-radius: 16px; padding: 32px;">
            <div style="margin-bottom: 24px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.02em;">6POINT</h1>
            </div>

            ${firstName ? `<p style="margin: 0 0 16px; font-size: 15px; color: #1A1A1A;">Hey ${firstName},</p>` : ""}

            <div style="font-size: 15px; color: #444; line-height: 1.7; white-space: pre-wrap;">${body}</div>

            <div style="border-top: 1px solid #eee; padding-top: 24px; margin-top: 32px;">
              <p style="margin: 0; font-size: 14px; color: #1A1A1A; font-weight: 500;">
                — The 6POINT Team
              </p>
              <p style="margin: 4px 0 0; font-size: 13px; color: #999;">
                <a href="https://6pointsolutions.com" style="color: #7B8C6F; text-decoration: none;">6pointsolutions.com</a>
              </p>
            </div>
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
