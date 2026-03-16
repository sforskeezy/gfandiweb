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
        <div style="background:#f7f7f5;padding:32px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;">
          <div style="max-width:640px;margin:0 auto;border-radius:18px;overflow:hidden;border:1px solid #ecebe8;background:#ffffff;">
            <div style="padding:20px 24px;background:linear-gradient(135deg,#1A1A1A 0%,#2a2a2a 100%);">
              <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:-0.02em;color:#ffffff;">6POINT Solutions</h1>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:0.08em;">Client Communication</p>
            </div>

            <div style="padding:26px 24px;">
              ${firstName ? `<p style="margin:0 0 14px;font-size:15px;color:#222222;font-weight:600;">Hey ${firstName},</p>` : ""}
              <div style="font-size:15px;color:#4a4a4a;line-height:1.75;white-space:pre-wrap;">${body}</div>
            </div>

            <div style="padding:18px 24px;border-top:1px solid #efefef;background:#fcfcfb;">
              <p style="margin:0;font-size:13px;color:#777777;">
                Sent by <span style="font-weight:600;color:#1A1A1A;">6POINT Solutions</span>
              </p>
              <p style="margin:6px 0 0;font-size:12px;color:#9a9a9a;">
                <a href="https://6pointsolutions.com" style="color:#7B8C6F;text-decoration:none;">6pointsolutions.com</a>
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
