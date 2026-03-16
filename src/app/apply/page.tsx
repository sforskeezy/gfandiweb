"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const packages = [
  {
    id: "basic",
    name: "Basic",
    setup: 350,
    monthly: 75,
    description: "Get online and start growing.",
    features: ["Modern Website", "Google Business Profile", "SEO Optimization", "Logo & Graphic Design", "Social Media (12 posts/mo)"],
  },
  {
    id: "pro",
    name: "Pro",
    setup: 450,
    monthly: 100,
    description: "Level up with ordering and more content.",
    badge: "Popular",
    features: ["Everything in Basic", "Online Ordering Integration", "DoorDash, Uber Eats & More", "Weekly Google Posts", "15 Social Posts/mo"],
  },
  {
    id: "elite",
    name: "Elite",
    setup: 550,
    monthly: 150,
    description: "Full-service marketing & ads.",
    features: ["Everything in Basic & Pro", "Paid Ads Management", "Facebook, Google & Instagram Ads", "Influencer Outreach", "Analytics & Monthly Reports"],
  },
];

const serviceOptions = [
  "Website Design & Development",
  "SEO Optimization",
  "Google Ads",
  "Meta Ads (Facebook/Instagram)",
  "Social Media Management",
  "Brand Identity & Logo",
  "Content Creation",
  "Email Marketing",
  "Analytics & Reporting",
];

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("package") || "";

  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(preselected);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    website: "",
    details: "",
    budget: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitMut = useMutation(api.applications.submit);

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await submitMut({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || undefined,
      businessName: form.businessName || undefined,
      packageTier: selectedPackage,
      services: selectedServices,
      details: form.details || undefined,
      budget: form.budget || undefined,
      website: form.website || undefined,
      type: "application",
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const canGoToStep2 = selectedPackage !== "";
  const canGoToStep3 = selectedServices.length > 0;
  const canSubmit = form.firstName && form.lastName && form.email;

  return (
    <div className="min-h-screen bg-[#F4F1EC]">
      <Navbar />

      <div className="mx-auto max-w-[900px] px-4 pb-20 pt-32 sm:px-6 sm:pt-36">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#1A1A1A]/10 px-4 py-2 text-[0.78rem] font-medium text-[#999] transition-all hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-20 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#7B8C6F]/15 to-[#7B8C6F]/5"
              >
                <CheckCircle2 className="h-9 w-9 text-[#7B8C6F]" />
              </motion.div>
              <h2 className="mt-6 text-[clamp(1.6rem,3vw,2.2rem)] font-bold tracking-[-0.03em] text-[#1A1A1A]">
                Application submitted!
              </h2>
              <p className="mt-3 max-w-md text-[0.95rem] text-[#999]">
                We&apos;ll review your application and get back to you within 24 hours to discuss next steps.
              </p>
              <Link
                href="/"
                className="mt-8 rounded-full bg-[#1A1A1A] px-8 py-3.5 text-[0.88rem] font-medium text-white transition-colors hover:bg-[#333]"
              >
                Back to Home
              </Link>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Progress */}
              <div className="mb-10">
                <div className="mb-4 flex items-center gap-3">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[0.72rem] font-bold transition-colors"
                        style={{
                          backgroundColor: step >= s ? "#1A1A1A" : "rgba(0,0,0,0.05)",
                          color: step >= s ? "#fff" : "#C5C2BC",
                        }}
                      >
                        {step > s ? <Check className="h-4 w-4" /> : s}
                      </div>
                      {s < 3 && (
                        <div
                          className="h-px w-8 sm:w-16 transition-colors"
                          style={{ backgroundColor: step > s ? "#1A1A1A" : "rgba(0,0,0,0.08)" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.15em] text-[#C5C2BC]">
                  {step === 1 ? "Choose a Package" : step === 2 ? "Select Services" : "Your Details"}
                </p>
              </div>

              {/* Step 1: Package selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.04em] text-[#1A1A1A]">
                    Choose your{" "}
                    <span style={{ fontFamily: "var(--font-serif)" }} className="italic text-[#888]">
                      package
                    </span>
                  </h1>
                  <p className="mt-3 text-[0.95rem] text-[#999]">
                    Select the plan that fits your business. You can always upgrade later.
                  </p>

                  <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {packages.map((pkg) => {
                      const active = selectedPackage === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg.id)}
                          className="relative flex flex-col rounded-[24px] p-6 text-left transition-all duration-200"
                          style={{
                            backgroundColor: active ? "#1A1A1A" : "#fff",
                            border: active ? "2px solid #1A1A1A" : "2px solid rgba(0,0,0,0.05)",
                            boxShadow: active ? "0 8px 30px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.03)",
                          }}
                        >
                          {pkg.badge && (
                            <span
                              className="absolute -top-3 left-6 rounded-full px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.06em]"
                              style={{
                                backgroundColor: active ? "#7B8C6F" : "#F4F1EC",
                                color: active ? "#fff" : "#7B8C6F",
                              }}
                            >
                              {pkg.badge}
                            </span>
                          )}

                          <h3
                            className="text-[1.1rem] font-bold"
                            style={{ color: active ? "#fff" : "#1A1A1A" }}
                          >
                            {pkg.name}
                          </h3>
                          <p
                            className="mt-1 text-[0.78rem]"
                            style={{ color: active ? "rgba(255,255,255,0.5)" : "#999" }}
                          >
                            {pkg.description}
                          </p>

                          <div className="mt-4 flex items-baseline gap-0.5">
                            <span
                              className="text-[2rem] font-bold tracking-tight"
                              style={{ color: active ? "#fff" : "#1A1A1A" }}
                            >
                              ${pkg.monthly}
                            </span>
                            <span
                              className="text-[0.78rem]"
                              style={{ color: active ? "rgba(255,255,255,0.4)" : "#BBB" }}
                            >
                              /mo
                            </span>
                          </div>
                          <p
                            className="text-[0.68rem]"
                            style={{ color: active ? "rgba(255,255,255,0.3)" : "#CCC" }}
                          >
                            + ${pkg.setup} setup
                          </p>

                          <div className="mt-5 space-y-2">
                            {pkg.features.map((f) => (
                              <div key={f} className="flex items-start gap-2">
                                <Check
                                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                  style={{ color: active ? "rgba(255,255,255,0.4)" : "#7B8C6F" }}
                                />
                                <span
                                  className="text-[0.78rem] leading-snug"
                                  style={{ color: active ? "rgba(255,255,255,0.7)" : "#666" }}
                                >
                                  {f}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div
                            className="mt-5 flex items-center justify-center rounded-full py-2.5 text-[0.78rem] font-semibold"
                            style={{
                              backgroundColor: active ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.03)",
                              color: active ? "#fff" : "#999",
                            }}
                          >
                            {active ? "Selected" : "Select"}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!canGoToStep2}
                      className="group flex items-center gap-2 rounded-full bg-[#1A1A1A] px-8 py-3.5 text-[0.88rem] font-medium text-white transition-all hover:bg-[#333] disabled:opacity-30"
                    >
                      Next: Services
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Services */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.04em] text-[#1A1A1A]">
                    What do you{" "}
                    <span style={{ fontFamily: "var(--font-serif)" }} className="italic text-[#888]">
                      need?
                    </span>
                  </h1>
                  <p className="mt-3 text-[0.95rem] text-[#999]">
                    Select all the services you&apos;re interested in.
                  </p>

                  <div className="mt-10 flex flex-wrap gap-3">
                    {serviceOptions.map((s) => {
                      const active = selectedServices.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleService(s)}
                          className="flex items-center gap-2 rounded-full px-5 py-3 text-[0.85rem] font-medium transition-all"
                          style={{
                            backgroundColor: active ? "#1A1A1A" : "#fff",
                            color: active ? "#fff" : "#666",
                            border: active ? "1.5px solid #1A1A1A" : "1.5px solid rgba(0,0,0,0.08)",
                          }}
                        >
                          {active && <Check className="h-4 w-4" />}
                          {s}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-10 flex items-center justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="text-[0.85rem] font-medium text-[#999] transition-colors hover:text-[#1A1A1A]"
                    >
                      &larr; Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!canGoToStep3}
                      className="group flex items-center gap-2 rounded-full bg-[#1A1A1A] px-8 py-3.5 text-[0.88rem] font-medium text-white transition-all hover:bg-[#333] disabled:opacity-30"
                    >
                      Next: Your Details
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-[-0.04em] text-[#1A1A1A]">
                    Tell us about{" "}
                    <span style={{ fontFamily: "var(--font-serif)" }} className="italic text-[#888]">
                      you
                    </span>
                  </h1>
                  <p className="mt-3 text-[0.95rem] text-[#999]">
                    Fill in your details so we can get back to you.
                  </p>

                  <div className="mt-10 space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#C5C2BC]">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          required
                          className="w-full rounded-2xl border-2 border-[#EEECEA] bg-[#FAF9F7] px-5 py-3.5 text-[0.85rem] font-medium text-[#1A1A1A] outline-none transition-all placeholder:font-normal placeholder:text-[#D0D0D0] focus:border-[#7B8C6F] focus:bg-white"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#C5C2BC]">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          required
                          className="w-full rounded-2xl border-2 border-[#EEECEA] bg-[#FAF9F7] px-5 py-3.5 text-[0.85rem] font-medium text-[#1A1A1A] outline-none transition-all placeholder:font-normal placeholder:text-[#D0D0D0] focus:border-[#7B8C6F] focus:bg-white"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#C5C2BC]">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full rounded-2xl border-2 border-[#EEECEA] bg-[#FAF9F7] px-5 py-3.5 text-[0.85rem] font-medium text-[#1A1A1A] outline-none transition-all placeholder:font-normal placeholder:text-[#D0D0D0] focus:border-[#7B8C6F] focus:bg-white"
                        placeholder="john@company.com"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#C5C2BC]">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full rounded-2xl border-2 border-[#EEECEA] bg-[#FAF9F7] px-5 py-3.5 text-[0.85rem] font-medium text-[#1A1A1A] outline-none transition-all placeholder:font-normal placeholder:text-[#D0D0D0] focus:border-[#7B8C6F] focus:bg-white"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#C5C2BC]">
                          Business Name
                        </label>
                        <input
                          type="text"
                          value={form.businessName}
                          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                          className="w-full rounded-2xl border-2 border-[#EEECEA] bg-[#FAF9F7] px-5 py-3.5 text-[0.85rem] font-medium text-[#1A1A1A] outline-none transition-all placeholder:font-normal placeholder:text-[#D0D0D0] focus:border-[#7B8C6F] focus:bg-white"
                          placeholder="Acme Inc."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#C5C2BC]">
                        Existing Website (if any)
                      </label>
                      <input
                        type="url"
                        value={form.website}
                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                        className="w-full rounded-2xl border-2 border-[#EEECEA] bg-[#FAF9F7] px-5 py-3.5 text-[0.85rem] font-medium text-[#1A1A1A] outline-none transition-all placeholder:font-normal placeholder:text-[#D0D0D0] focus:border-[#7B8C6F] focus:bg-white"
                        placeholder="https://mysite.com"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#C5C2BC]">
                        Tell us about your project
                      </label>
                      <textarea
                        rows={4}
                        value={form.details}
                        onChange={(e) => setForm({ ...form, details: e.target.value })}
                        className="w-full resize-none rounded-2xl border-2 border-[#EEECEA] bg-[#FAF9F7] px-5 py-3.5 text-[0.85rem] font-medium text-[#1A1A1A] outline-none transition-all placeholder:font-normal placeholder:text-[#D0D0D0] focus:border-[#7B8C6F] focus:bg-white"
                        placeholder="What are your goals? Any specific requirements or timeline?"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-8 rounded-2xl bg-white p-5" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#C5C2BC]">Summary</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#1A1A1A] px-3 py-1.5 text-[0.72rem] font-semibold text-white">
                        {packages.find((p) => p.id === selectedPackage)?.name} Package
                      </span>
                      {selectedServices.map((s) => (
                        <span key={s} className="rounded-full bg-[#F4F1EC] px-3 py-1.5 text-[0.72rem] font-medium text-[#888]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 flex items-center justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="text-[0.85rem] font-medium text-[#999] transition-colors hover:text-[#1A1A1A]"
                    >
                      &larr; Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitting}
                      className="group flex items-center gap-2 rounded-full px-8 py-3.5 text-[0.88rem] font-medium text-white transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-30"
                      style={{ background: "linear-gradient(135deg, #7B8C6F, #6A7A5F)", boxShadow: "0 4px 14px rgba(123,140,111,0.25)" }}
                    >
                      {submitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
