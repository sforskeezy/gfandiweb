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
  const raw = process.env.FROM_EMAIL || "6POINT Solutions <onboarding@resend.dev>";
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
    const year = new Date().getFullYear();
    const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

    // ── 1. Admin notification ──
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: isBooking
        ? `New Booking Request from ${fullName}`
        : `New Application from ${fullName}`,
      text: [
        isBooking ? "New Booking Request" : "New Application",
        dateStr,
        "",
        `Name: ${fullName}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : "",
        businessName ? `Business: ${businessName}` : "",
        packageTier && packageTier !== "none" ? `Package: ${packageTier}` : "",
        services?.length ? `Services: ${services.join(", ")}` : "",
        details ? `\nProject Details:\n${details}` : "",
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
              <p style="margin: 0 0 32px; font-size: 22px; font-weight: 700; color: #1A1A1A; letter-spacing: -0.02em;">6POINT</p>
              <!-- Title -->
              <p style="margin: 0 0 4px; font-size: 17px; font-weight: 600; color: #1d1d1f;">${isBooking ? "New Booking Request" : "New Application"}</p>
              <p style="margin: 0 0 28px; font-size: 13px; color: #86868b;">${dateStr}</p>
              <!-- Details -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #1d1d1f;">
                <tr>
                  <td style="padding: 10px 0; color: #86868b; width: 110px; vertical-align: top;">Name</td>
                  <td style="padding: 10px 0;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #86868b; vertical-align: top;">Email</td>
                  <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a></td>
                </tr>
                ${phone ? `<tr><td style="padding: 10px 0; color: #86868b; vertical-align: top;">Phone</td><td style="padding: 10px 0;">${phone}</td></tr>` : ""}
                ${businessName ? `<tr><td style="padding: 10px 0; color: #86868b; vertical-align: top;">Business</td><td style="padding: 10px 0;">${businessName}</td></tr>` : ""}
                ${packageTier && packageTier !== "none" ? `<tr><td style="padding: 10px 0; color: #86868b; vertical-align: top;">Package</td><td style="padding: 10px 0; font-weight: 600;">${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</td></tr>` : ""}
              </table>
              ${services && services.length > 0 ? `
              <p style="margin: 24px 0 6px; font-size: 13px; color: #86868b;">Services</p>
              <p style="margin: 0; font-size: 14px; color: #1d1d1f; line-height: 1.6;">${services.join(", ")}</p>
              ` : ""}
              ${details ? `
              <p style="margin: 24px 0 6px; font-size: 13px; color: #86868b;">Project Details</p>
              <p style="margin: 0; font-size: 14px; color: #1d1d1f; line-height: 1.6;">${details}</p>
              ` : ""}
            </td>
          </tr>
        </table>
        <!-- Footer -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 680px;">
          <tr>
            <td style="padding: 24px 0 0; text-align: center; font-size: 12px; color: #86868b;">
              Copyright &copy; ${year} 6POINT Solutions. All rights reserved.
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

    // ── 2. Confirmation to applicant ──
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: isBooking
        ? "Your call is booked — 6POINT Solutions"
        : "We got your application — 6POINT Solutions",
      text: [
        `Hey ${firstName},`,
        "",
        isBooking
          ? "Thanks for booking a call with us. We'll be in touch within 24 hours to confirm your strategy call."
          : "Thanks for reaching out. Our team will review your application and get back to you within 24 hours.",
        !isBooking && packageTier && packageTier !== "none" ? `\nYour selected package: ${packageTier}` : "",
        "",
        "If you have any questions in the meantime, just reply to this email.",
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
              <!-- Body -->
              <p style="margin: 0 0 16px; font-size: 15px; color: #1d1d1f; line-height: 1.6;">Hey ${firstName},</p>
              <p style="margin: 0 0 16px; font-size: 15px; color: #1d1d1f; line-height: 1.6;">${isBooking
                ? "Thanks for booking a call with us. We'll be in touch within 24 hours to confirm your strategy call."
                : "Thanks for reaching out. Our team will review your application and get back to you within 24 hours."}</p>
              ${!isBooking && packageTier && packageTier !== "none" ? `<p style="margin: 0 0 16px; font-size: 15px; color: #1d1d1f; line-height: 1.6;">Your selected package: <strong>${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</strong></p>` : ""}
              <p style="margin: 0 0 16px; font-size: 15px; color: #1d1d1f; line-height: 1.6;">If you have any questions in the meantime, just reply to this email.</p>
              <!-- Sign off -->
              <p style="margin: 28px 0 0; font-size: 15px; color: #1d1d1f;">Regards,</p>
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
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
