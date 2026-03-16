import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

function normalizeEmail(raw: string): string {
  const addr = raw.trim();
  const atIdx = addr.lastIndexOf("@");
  if (atIdx === -1) return raw;
  return addr.slice(0, atIdx + 1) + addr.slice(atIdx + 1).toLowerCase();
}

const ADMIN_EMAIL = normalizeEmail(process.env.ADMIN_EMAIL || "hello@6pointsolutions.com");
const FROM_EMAIL = (() => {
  const raw = process.env.FROM_EMAIL || "6POINT Solutions <hello@6pointsolutions.com>";
  const match = raw.match(/<([^>]+)>/);
  const addr = (match ? match[1] : raw).trim();
  const atIdx = addr.lastIndexOf("@");
  if (atIdx === -1) return raw;
  const normalized = addr.slice(0, atIdx + 1) + addr.slice(atIdx + 1).toLowerCase();
  return match ? raw.replace(match[1], normalized) : normalized;
})();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      firstName,
      lastName,
      email,
      phone,
      businessName,
      packageTier,
      services,
      details,
    } = body;

    const isBooking = type === "booking";
    const fullName = `${firstName} ${lastName}`;

    // 1. Send notification to admin
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: isBooking
        ? `New Booking Request from ${fullName}`
        : `New Application from ${fullName}`,
      html: `
        <div style="background:#f7f7f5;padding:32px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;">
          <div style="max-width:680px;margin:0 auto;border-radius:18px;overflow:hidden;border:1px solid #ecebe8;background:#ffffff;">
            <div style="background:linear-gradient(135deg,#1A1A1A 0%,#2a2a2a 100%);padding:22px 24px;">
              <h1 style="margin:0;font-size:20px;font-weight:700;color:white;letter-spacing:-0.01em;">
              ${isBooking ? "📞 New Booking Request" : "📋 New Application"}
            </h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.65);font-size:12px;letter-spacing:0.06em;text-transform:uppercase;">
              ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
            </p>
            </div>

            <div style="padding:24px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr>
                <td style="padding:8px 0;color:#999;width:120px;">Name</td>
                <td style="padding:8px 0;font-weight:600;color:#1A1A1A;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#999;">Email</td>
                <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#7B8C6F;text-decoration:none;font-weight:500;">${email}</a></td>
              </tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#999;">Phone</td><td style="padding:8px 0;color:#1A1A1A;">${phone}</td></tr>` : ""}
              ${businessName ? `<tr><td style="padding:8px 0;color:#999;">Business</td><td style="padding:8px 0;color:#1A1A1A;">${businessName}</td></tr>` : ""}
              ${packageTier && packageTier !== "none" ? `<tr><td style="padding:8px 0;color:#999;">Package</td><td style="padding:8px 0;color:#7B8C6F;font-weight:700;">${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</td></tr>` : ""}
              </table>

            ${services && services.length > 0 ? `
              <div style="margin-top:18px;padding-top:16px;border-top:1px solid #f0f0f0;">
                <p style="margin:0 0 8px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Services</p>
                <div>${services.map((s: string) => `<span style="display:inline-block;background:#F4F1EC;padding:5px 10px;border-radius:20px;font-size:12px;color:#666;margin:2px 4px 2px 0;">${s}</span>`).join("")}</div>
              </div>
            ` : ""}

            ${details ? `
              <div style="margin-top:18px;padding-top:16px;border-top:1px solid #f0f0f0;">
                <p style="margin:0 0 8px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Project Details</p>
                <p style="margin:0;font-size:14px;color:#666;line-height:1.65;white-space:pre-wrap;">${details}</p>
              </div>
            ` : ""}
            </div>

            <div style="padding:18px 24px;border-top:1px solid #efefef;background:#fcfcfb;">
              <a href="mailto:${email}" style="display:inline-block;background:#1A1A1A;color:white;padding:10px 20px;border-radius:999px;text-decoration:none;font-size:13px;font-weight:600;">
                Reply to ${firstName}
              </a>
              <p style="margin:10px 0 0;font-size:12px;color:#9a9a9a;">Inbox alert from 6POINT Solutions</p>
            </div>
          </div>
        </div>
      `,
    });

    // 2. Send confirmation to the applicant
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: isBooking
        ? "Your call is booked — 6POINT Solutions"
        : "We got your application — 6POINT Solutions",
      html: `
        <div style="background:#f7f7f5;padding:32px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;">
          <div style="max-width:640px;margin:0 auto;border-radius:18px;overflow:hidden;border:1px solid #ecebe8;background:#ffffff;">
            <div style="padding:22px 24px;background:linear-gradient(135deg,#1A1A1A 0%,#2a2a2a 100%);">
              <h1 style="margin:0;font-size:24px;font-weight:700;letter-spacing:-0.02em;color:#ffffff;">6POINT Solutions</h1>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.65);text-transform:uppercase;letter-spacing:0.08em;">Thanks for reaching out</p>
            </div>

            <div style="padding:26px 24px;">
              <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1A1A1A;letter-spacing:-0.01em;">
                ${isBooking ? "Your call is booked!" : "We received your application!"}
              </h2>
              <p style="margin:0 0 22px;font-size:15px;color:#6f6f6f;line-height:1.65;">
                Hey ${firstName}, thanks for reaching out. ${isBooking
              ? "We'll be in touch within 24 hours to confirm your strategy call."
              : "Our team will review your application and get back to you within 24 hours."}
              </p>

              ${!isBooking && packageTier && packageTier !== "none" ? `
                <div style="background:#F4F1EC;border:1px solid #ece7df;border-radius:12px;padding:16px 18px;margin-bottom:18px;">
                  <p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Selected Package</p>
                  <p style="margin:0;font-size:18px;font-weight:700;color:#1A1A1A;">${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</p>
                </div>
              ` : ""}

              <div style="background:#f9faf8;border:1px solid #edf1ea;border-radius:12px;padding:14px 16px;">
                <p style="margin:0;font-size:13px;color:#5a6a52;line-height:1.6;">
                  If you have any questions in the meantime, just reply to this email.
                </p>
              </div>
            </div>

            <div style="padding:18px 24px;border-top:1px solid #efefef;background:#fcfcfb;">
              <p style="margin:0;font-size:13px;color:#777777;">
                — The <span style="font-weight:700;color:#1A1A1A;">6POINT Team</span>
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
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
