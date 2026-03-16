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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f5f0; padding: 48px 20px;">
          <div style="max-width: 560px; margin: 0 auto;">
            <div style="background: #7B8C6F; height: 4px; border-radius: 8px 8px 0 0;"></div>
            <div style="background: #ffffff; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px; padding: 40px 36px;">
              <h1 style="margin: 0 0 28px; font-size: 26px; font-weight: 600; color: #1A1A1A; letter-spacing: -0.03em;">6POINT <span style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 600;">Solutions</span></h1>

              <div style="background: #1A1A1A; border-radius: 10px; padding: 24px 28px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">
                  ${isBooking ? "New Booking Request" : "New Application"}
                </p>
                <p style="margin: 6px 0 0; font-size: 13px; color: rgba(255,255,255,0.45);">
                  ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                </p>
              </div>

              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; color: #999; width: 110px; vertical-align: top;">Name</td>
                  <td style="padding: 10px 0; font-weight: 600; color: #1A1A1A;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #999; vertical-align: top;">Email</td>
                  <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #7B8C6F; text-decoration: none;">${email}</a></td>
                </tr>
                ${phone ? `<tr><td style="padding: 10px 0; color: #999; vertical-align: top;">Phone</td><td style="padding: 10px 0; color: #1A1A1A;">${phone}</td></tr>` : ""}
                ${businessName ? `<tr><td style="padding: 10px 0; color: #999; vertical-align: top;">Business</td><td style="padding: 10px 0; color: #1A1A1A;">${businessName}</td></tr>` : ""}
                ${packageTier && packageTier !== "none" ? `<tr><td style="padding: 10px 0; color: #999; vertical-align: top;">Package</td><td style="padding: 10px 0; color: #7B8C6F; font-weight: 600;">${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</td></tr>` : ""}
              </table>

              ${services && services.length > 0 ? `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eeeeea;">
                  <p style="margin: 0 0 10px; font-size: 11px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.08em;">Services</p>
                  <div>${services.map((s: string) => `<span style="display: inline-block; background: #f0ede8; padding: 5px 12px; border-radius: 20px; font-size: 12px; color: #666; margin: 3px 4px 3px 0;">${s}</span>`).join("")}</div>
                </div>
              ` : ""}

              ${details ? `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eeeeea;">
                  <p style="margin: 0 0 10px; font-size: 11px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.08em;">Project Details</p>
                  <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.7;">${details}</p>
                </div>
              ` : ""}

              <div style="margin-top: 32px; text-align: center;">
                <a href="mailto:${email}" style="display: inline-block; background: #7B8C6F; color: white; padding: 13px 32px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
                  Reply to ${firstName}
                </a>
              </div>
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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f5f0; padding: 48px 20px;">
          <div style="max-width: 560px; margin: 0 auto;">
            <div style="background: #7B8C6F; height: 4px; border-radius: 8px 8px 0 0;"></div>
            <div style="background: #ffffff; border: 1px solid #e8e8e4; border-top: none; border-radius: 0 0 8px 8px; padding: 40px 36px;">
              <h1 style="margin: 0 0 32px; font-size: 26px; font-weight: 600; color: #1A1A1A; letter-spacing: -0.03em;">6POINT <span style="font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 600;">Solutions</span></h1>

              <h2 style="margin: 0 0 10px; font-size: 22px; font-weight: 600; color: #1A1A1A;">
                ${isBooking ? "Your call is booked!" : "We received your application!"}
              </h2>
              <p style="margin: 0 0 28px; font-size: 15px; color: #777; line-height: 1.7;">
                Hey ${firstName}, thanks for reaching out. ${isBooking
                  ? "We'll be in touch within 24 hours to confirm your strategy call."
                  : "Our team will review your application and get back to you within 24 hours."}
              </p>

              ${!isBooking && packageTier && packageTier !== "none" ? `
                <div style="background: #f0ede8; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px;">
                  <p style="margin: 0 0 4px; font-size: 11px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.08em;">Selected Package</p>
                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1A1A1A;">${packageTier.charAt(0).toUpperCase() + packageTier.slice(1)}</p>
                </div>
              ` : ""}

              <div style="border-top: 1px solid #eeeeea; padding-top: 28px; margin-top: 28px;">
                <p style="margin: 0; font-size: 14px; color: #999; line-height: 1.7;">
                  If you have any questions in the meantime, just reply to this email.
                </p>
                <p style="margin: 16px 0 0; font-size: 14px; color: #1A1A1A; font-weight: 500;">— The 6POINT Team</p>
                <p style="margin: 6px 0 0; font-size: 13px;">
                  <a href="https://6pointsolutions.com" style="color: #7B8C6F; text-decoration: none;">6pointsolutions.com</a>
                </p>
              </div>
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
