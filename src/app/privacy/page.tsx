"use client";

import { ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    content: `When you use our services, we may collect information you provide directly to us, including your name, email address, phone number, business name, and any other information you choose to provide. We also collect information automatically when you visit our website, such as your IP address, browser type, operating system, referring URLs, and information about how you interact with our site.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to provide, maintain, and improve our services, to process transactions and send related information, to communicate with you about products, services, offers, and events, and to monitor and analyze trends, usage, and activities in connection with our services. We may also use your information to personalize and improve your experience, and to carry out any other purpose described to you at the time the information was collected.`,
  },
  {
    title: "Information Sharing",
    content: `We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.`,
  },
  {
    title: "Data Security",
    content: `We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems and are required to keep the information confidential. All sensitive information you supply is encrypted via Secure Socket Layer (SSL) technology.`,
  },
  {
    title: "Cookies & Tracking",
    content: `We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our site.`,
  },
  {
    title: "Third-Party Services",
    content: `Our website may contain links to third-party websites or services that are not owned or controlled by 6POINT Solutions. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. We strongly advise you to review the privacy policy of every site you visit.`,
  },
  {
    title: "Data Retention",
    content: `We will retain your personal information only for as long as is necessary for the purposes set out in this privacy policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies. If you wish to request that we no longer use your information, please contact us at the email address provided below.`,
  },
  {
    title: "Your Rights",
    content: `You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving promotional communications from us by following the unsubscribe link in any email we send. If you are a resident of the European Economic Area (EEA), you have certain data protection rights under GDPR, including the right to request access, correction, or deletion of your personal data.`,
  },
  {
    title: "Children's Privacy",
    content: `Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions about this privacy policy, please contact us at hello@6pointsolutions.com. We will respond to your inquiry within a reasonable timeframe.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0E0E0E]" style={{ fontFamily: "var(--font-dm), sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.04] px-6 py-5 backdrop-blur-xl" style={{ backgroundColor: "rgba(14,14,14,0.8)" }}>
        <div className="mx-auto flex max-w-[800px] items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img
              src="/d2b8263f-f484-4783-8fd0-daf49e85220b.png"
              alt="6POINT"
              className="h-7 w-7 brightness-0 invert"
            />
            <span className="text-[0.95rem] font-bold tracking-[-0.04em] text-white">6POINT</span>
          </a>
          <a
            href="/"
            className="flex items-center gap-1.5 text-[0.78rem] font-medium text-white/25 transition-colors hover:text-white/50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </a>
        </div>
      </nav>

      {/* White paper card on dark background */}
      <div className="px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32">
        <div className="mx-auto max-w-[860px] rounded-2xl bg-white px-8 py-14 shadow-[0_0_80px_rgba(0,0,0,0.4)] sm:px-14 sm:py-18 lg:px-20 lg:py-20">
          {/* Header */}
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#5D8B68]">Legal</p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] text-[#1A1A1A]">
            Privacy Policy
          </h1>
          <p className="mt-3 text-[0.88rem] text-[#1A1A1A]/35">
            Last updated — March 2026
          </p>
          <div className="mt-8 h-px w-full bg-[#1A1A1A]/[0.06]" />

          {/* Intro */}
          <p className="mt-8 text-[0.92rem] leading-[1.8] text-[#1A1A1A]/50">
            At 6POINT Solutions, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>

          {/* Sections */}
          <div className="mt-12 space-y-10">
            {sections.map((section, i) => (
              <div key={section.title}>
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1A1A1A]/[0.04] text-[0.65rem] font-bold text-[#1A1A1A]/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-[1.05rem] font-semibold tracking-[-0.01em] text-[#1A1A1A]/80">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-[0.88rem] leading-[1.8] text-[#1A1A1A]/40">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-6 py-8">
        <div className="mx-auto flex max-w-[800px] flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[0.72rem] text-white/15">
            &copy; {new Date().getFullYear()} 6POINT Solutions. All rights reserved.
          </p>
          <a
            href="mailto:hello@6pointsolutions.com"
            className="text-[0.72rem] text-white/15 transition-colors hover:text-white/30"
          >
            hello@6pointsolutions.com
          </a>
        </div>
      </footer>
    </div>
  );
}
