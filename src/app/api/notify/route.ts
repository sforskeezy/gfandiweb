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
        <style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&display=swap');</style>
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1A1A1A; letter-spacing: -0.03em;">6POINT <span style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 600;">Solutions</span></h1>
          </div>
          <div style="border: 5px solid #7B8C6F; border-radius: 16px; overflow: hidden;">
            <div style="background: #1A1A1A; padding: 32px; color: white;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 600;">
                ${isBooking ? "📞 New Booking Request" : "📋 New Application"}
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.5); font-size: 14px;">
                ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
              </p>
            </div>

            <div style="background: #fff; padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #999; width: 120px;">Name</td>
                <td style="padding: 8px 0; font-weight: 600; color: #1A1A1A;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #999;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #7B8C6F; text-decoration: none;">${email}</a></td>
              </tr>
              ${phone ? `<tr><td style="padding: 8px 0; color: #999;">Phone</td><td style="padding: 8px 0; color: #1A1A1A;">${phone}</td></tr>` : ""}
              ${businessName ? `<tr><td style="padding: 8px 0; color: #999;">Business</td><td style="padding: 8px 0; color: #1A1A1A;">${businessName}</td></tr>` : ""}
              ${packageTier && packageTier !== "none" ? `<tr><td style="padding: 8px 0; color: #999;">Package</td><td style="padding: 8px 0; color: #7B8C6F; font-weight: 600;">${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</td></tr>` : ""}
            </table>

            ${services && services.length > 0 ? `
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.05em;">Services</p>
                <div>${services.map((s: string) => `<span style="display: inline-block; background: #F4F1EC; padding: 4px 10px; border-radius: 20px; font-size: 12px; color: #666; margin: 2px 4px 2px 0;">${s}</span>`).join("")}</div>
              </div>
            ` : ""}

            ${details ? `
              <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.05em;">Project Details</p>
                <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">${details}</p>
              </div>
            ` : ""}
            </div>

            <div style="text-align: center; padding: 20px; border-top: 1px solid #f0f0f0;">
              <a href="mailto:${email}" style="display: inline-block; background: #1A1A1A; color: white; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 500;">
                Reply to ${firstName}
              </a>
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
        <style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&display=swap');</style>
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="border: 5px solid #7B8C6F; border-radius: 16px; padding: 32px;">
            <div style="margin-bottom: 24px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #1A1A1A; letter-spacing: -0.03em;">6POINT <span style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 600;">Solutions</span></h1>
            </div>

            <h2 style="margin: 0 0 8px; font-size: 22px; font-weight: 600; color: #1A1A1A;">
              ${isBooking ? "Your call is booked!" : "We received your application!"}
            </h2>
            <p style="margin: 0 0 24px; font-size: 15px; color: #888; line-height: 1.6;">
              Hey ${firstName}, thanks for reaching out. ${isBooking
                ? "We'll be in touch within 24 hours to confirm your strategy call."
                : "Our team will review your application and get back to you within 24 hours."}
            </p>

            ${!isBooking && packageTier && packageTier !== "none" ? `
              <div style="background: #F4F1EC; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 4px; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.08em;">Selected Package</p>
                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1A1A1A;">${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</p>
              </div>
            ` : ""}

            <div style="border-top: 1px solid #eee; padding-top: 24px; margin-top: 24px;">
              <p style="margin: 0; font-size: 14px; color: #999; line-height: 1.6;">
                If you have any questions in the meantime, just reply to this email.
              </p>
              <p style="margin: 16px 0 0; font-size: 14px; color: #1A1A1A; font-weight: 500;">
                — The 6POINT Team
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
