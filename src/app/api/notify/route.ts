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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f2f2f7; padding: 40px 0;">
          <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 48px 44px;">
            <p style="margin: 0 0 36px; font-size: 22px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.02em;">6POINT</p>

            <p style="margin: 0 0 4px; font-size: 17px; font-weight: 600; color: #1A1A1A;">
              ${isBooking ? "New Booking Request" : "New Application"}
            </p>
            <p style="margin: 0 0 28px; font-size: 13px; color: #86868b;">
              ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
            </p>

            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 10px 0; color: #86868b; width: 110px; vertical-align: top;">Name</td>
                <td style="padding: 10px 0; color: #1A1A1A;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #86868b; vertical-align: top;">Email</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a></td>
              </tr>
              ${phone ? `<tr><td style="padding: 10px 0; color: #86868b; vertical-align: top;">Phone</td><td style="padding: 10px 0; color: #1A1A1A;">${phone}</td></tr>` : ""}
              ${businessName ? `<tr><td style="padding: 10px 0; color: #86868b; vertical-align: top;">Business</td><td style="padding: 10px 0; color: #1A1A1A;">${businessName}</td></tr>` : ""}
              ${packageTier && packageTier !== "none" ? `<tr><td style="padding: 10px 0; color: #86868b; vertical-align: top;">Package</td><td style="padding: 10px 0; font-weight: 600; color: #1A1A1A;">${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</td></tr>` : ""}
            </table>

            ${services && services.length > 0 ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e5ea;">
                <p style="margin: 0 0 8px; font-size: 14px; color: #86868b;">Services</p>
                <p style="margin: 0; font-size: 14px; color: #1A1A1A; line-height: 1.6;">${services.join(", ")}</p>
              </div>
            ` : ""}

            ${details ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e5ea;">
                <p style="margin: 0 0 8px; font-size: 14px; color: #86868b;">Project Details</p>
                <p style="margin: 0; font-size: 14px; color: #1A1A1A; line-height: 1.6;">${details}</p>
              </div>
            ` : ""}
          </div>

          <div style="max-width: 680px; margin: 0 auto; text-align: center; padding: 28px 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #86868b;">Copyright &copy; ${new Date().getFullYear()} 6POINT Solutions. All rights reserved.</p>
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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f2f2f7; padding: 40px 0;">
          <div style="max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 48px 44px;">
            <p style="margin: 0 0 40px; font-size: 22px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.02em;">6POINT</p>

            <p style="margin: 0 0 16px; font-size: 15px; color: #333; line-height: 1.6;">Hey ${firstName},</p>

            <p style="margin: 0 0 16px; font-size: 15px; color: #333; line-height: 1.6;">
              ${isBooking
                ? "Thanks for booking a call with us. We'll be in touch within 24 hours to confirm your strategy call."
                : "Thanks for reaching out. Our team will review your application and get back to you within 24 hours."}
            </p>

            ${!isBooking && packageTier && packageTier !== "none" ? `
              <p style="margin: 0 0 16px; font-size: 15px; color: #333; line-height: 1.6;">Your selected package: <strong>${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</strong></p>
            ` : ""}

            <p style="margin: 0 0 16px; font-size: 15px; color: #333; line-height: 1.6;">If you have any questions in the meantime, just reply to this email.</p>

            <p style="margin: 28px 0 0; font-size: 15px; color: #333;">Regards,</p>
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
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
