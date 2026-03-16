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
    const adminText = [
      `${isBooking ? "New Booking Request" : "New Application"}`,
      new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
      "",
      `Name: ${fullName}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      businessName ? `Business: ${businessName}` : "",
      packageTier && packageTier !== "none" ? `Package: ${packageTier}` : "",
      services?.length ? `Services: ${services.join(", ")}` : "",
      details ? `\nProject Details:\n${details}` : "",
    ].filter(Boolean).join("\n");

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: isBooking
        ? `New Booking Request from ${fullName}`
        : `New Application from ${fullName}`,
      text: adminText,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#333;line-height:1.6;background:#fff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
<tr><td style="padding:32px 24px;">
<p style="margin:0 0 24px;font-size:20px;font-weight:700;color:#1A1A1A;">6POINT</p>
<p style="margin:0 0 4px;font-size:16px;font-weight:600;color:#1A1A1A;">${isBooking ? "New Booking Request" : "New Application"}</p>
<p style="margin:0 0 20px;font-size:13px;color:#86868b;">${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
<table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
<tr><td style="padding:8px 0;color:#86868b;width:100px;">Name</td><td style="padding:8px 0;">${fullName}</td></tr>
<tr><td style="padding:8px 0;color:#86868b;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#0066cc;text-decoration:none;">${email}</a></td></tr>
${phone ? `<tr><td style="padding:8px 0;color:#86868b;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>` : ""}
${businessName ? `<tr><td style="padding:8px 0;color:#86868b;">Business</td><td style="padding:8px 0;">${businessName}</td></tr>` : ""}
${packageTier && packageTier !== "none" ? `<tr><td style="padding:8px 0;color:#86868b;">Package</td><td style="padding:8px 0;font-weight:600;">${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</td></tr>` : ""}
</table>
${services && services.length > 0 ? `<p style="margin:20px 0 0;font-size:13px;color:#86868b;">Services: ${services.join(", ")}</p>` : ""}
${details ? `<p style="margin:12px 0 0;font-size:13px;color:#86868b;">Project Details:</p><p style="margin:4px 0 0;">${details}</p>` : ""}
</td></tr>
</table>
</body>
</html>
      `.trim(),
    });

    // 2. Send confirmation to the applicant
    const confirmText = [
      `Hey ${firstName},`,
      "",
      isBooking ? "Thanks for booking a call with us. We'll be in touch within 24 hours to confirm your strategy call." : "Thanks for reaching out. Our team will review your application and get back to you within 24 hours.",
      !isBooking && packageTier && packageTier !== "none" ? `\nYour selected package: ${packageTier}` : "",
      "",
      "If you have any questions in the meantime, just reply to this email.",
      "",
      "Regards,",
      "The 6POINT Team",
      "6pointsolutions.com",
    ].filter(Boolean).join("\n");

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: isBooking
        ? "Your call is booked — 6POINT Solutions"
        : "We got your application — 6POINT Solutions",
      text: confirmText,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;color:#333;line-height:1.6;background:#fff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
<tr><td style="padding:32px 24px;">
<p style="margin:0 0 24px;font-size:20px;font-weight:700;color:#1A1A1A;">6POINT</p>
<p style="margin:0 0 16px;">Hey ${firstName},</p>
<p style="margin:0 0 16px;">${isBooking ? "Thanks for booking a call with us. We'll be in touch within 24 hours to confirm your strategy call." : "Thanks for reaching out. Our team will review your application and get back to you within 24 hours."}</p>
${!isBooking && packageTier && packageTier !== "none" ? `<p style="margin:0 0 16px;">Your selected package: <strong>${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</strong></p>` : ""}
<p style="margin:0 0 24px;">If you have any questions in the meantime, just reply to this email.</p>
<p style="margin:0;color:#666;">Regards,<br>The 6POINT Team</p>
<p style="margin:12px 0 0;font-size:13px;"><a href="https://6pointsolutions.com" style="color:#86868b;text-decoration:none;">6pointsolutions.com</a></p>
</td></tr>
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
