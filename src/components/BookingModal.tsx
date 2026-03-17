"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "motion/react";
import { X, CalendarDays, ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";

export function useBookingModal() {
  const [open, setOpen] = useState(false);
  return { open, openModal: () => setOpen(true), closeModal: () => setOpen(false) };
}

export default function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [details, setDetails] = useState("");

  const submitMut = useMutation(api.applications.submit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitMut({
      firstName,
      lastName,
      email,
      packageTier: "none",
      services: service ? [service] : [],
      details: details || undefined,
      type: "booking",
    });
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "booking",
        firstName,
        lastName,
        email,
        services: service ? [service] : [],
        details,
      }),
    }).catch(() => {});
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setService("");
      setDetails("");
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(12px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-black/50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-[28px] bg-white shadow-[0_25px_60px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.03)]"
          >
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-48">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 120% at 30% -20%, rgba(93,139,104,0.15) 0%, transparent 60%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 100% at 80% -10%, rgba(232,167,130,0.1) 0%, transparent 55%)",
                }}
              />
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full border border-black/[0.06] bg-white/80 p-2.5 text-[#999] backdrop-blur-sm transition-all hover:border-black/10 hover:bg-white hover:text-[#1A1A1A] hover:shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center px-8 py-24 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#5D8B68]/15 to-[#5D8B68]/5"
                  >
                    <CheckCircle2 className="h-9 w-9 text-[#5D8B68]" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-[#1A1A1A]"
                  >
                    You&apos;re booked!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-2.5 text-[0.9rem] leading-relaxed text-[#999]"
                  >
                    We&apos;ll be in touch within 24 hours to confirm your session.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative px-8 pt-8 pb-0 sm:px-10">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5D8B68]/15 to-[#5D8B68]/5">
                        <CalendarDays className="h-5.5 w-5.5 text-[#5D8B68]" />
                      </div>
                      <div>
                        <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-[#1A1A1A]">
                          Book a Strategy Call
                        </h3>
                        <p className="mt-1 text-[0.82rem] text-[#AAA]">
                          Let&apos;s talk about growing your brand.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F6F4] px-3.5 py-1.5 text-[0.72rem] font-medium text-[#777]">
                        <Clock className="h-3 w-3" />
                        30 min
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F6F4] px-3.5 py-1.5 text-[0.72rem] font-medium text-[#777]">
                        <Sparkles className="h-3 w-3" />
                        100% Free
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F6F4] px-3.5 py-1.5 text-[0.72rem] font-medium text-[#777]">
                        <CalendarDays className="h-3 w-3" />
                        No strings attached
                      </span>
                    </div>
                  </div>

                  <div className="mx-8 mt-6 h-px bg-gradient-to-r from-transparent via-[#E8E6E3] to-transparent sm:mx-10" />

                  <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 sm:px-10">
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#BBB]">
                            First Name
                          </label>
                          <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full rounded-xl border border-[#E8E6E3] bg-[#FAFAF9] px-4 py-3 text-[0.88rem] text-[#1A1A1A] outline-none transition-all placeholder:text-[#D0D0D0] focus:border-[#5D8B68] focus:bg-white focus:ring-2 focus:ring-[#5D8B68]/10"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#BBB]">
                            Last Name
                          </label>
                          <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full rounded-xl border border-[#E8E6E3] bg-[#FAFAF9] px-4 py-3 text-[0.88rem] text-[#1A1A1A] outline-none transition-all placeholder:text-[#D0D0D0] focus:border-[#5D8B68] focus:bg-white focus:ring-2 focus:ring-[#5D8B68]/10"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#BBB]">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-[#E8E6E3] bg-[#FAFAF9] px-4 py-3 text-[0.88rem] text-[#1A1A1A] outline-none transition-all placeholder:text-[#D0D0D0] focus:border-[#5D8B68] focus:bg-white focus:ring-2 focus:ring-[#5D8B68]/10"
                          placeholder="john@company.com"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#BBB]">
                          What do you need help with?
                        </label>
                        <select
                          required
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-[#E8E6E3] bg-[#FAFAF9] px-4 py-3 text-[0.88rem] text-[#1A1A1A] outline-none transition-all focus:border-[#5D8B68] focus:bg-white focus:ring-2 focus:ring-[#5D8B68]/10"
                        >
                          <option value="" disabled>
                            Select a service
                          </option>
                          <option>Brand Strategy</option>
                          <option>Web Design</option>
                          <option>Performance Marketing</option>
                          <option>Content &amp; Social</option>
                          <option>Full Package</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[#BBB]">
                          Tell us about your project
                        </label>
                        <textarea
                          rows={3}
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          className="w-full resize-none rounded-xl border border-[#E8E6E3] bg-[#FAFAF9] px-4 py-3 text-[0.88rem] text-[#1A1A1A] outline-none transition-all placeholder:text-[#D0D0D0] focus:border-[#5D8B68] focus:bg-white focus:ring-2 focus:ring-[#5D8B68]/10"
                          placeholder="What are you working on?"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="group relative mt-7 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-[#1A1A1A] px-6 py-4 text-[0.9rem] font-medium text-white transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                    >
                      <span className="relative z-10 flex items-center gap-2.5">
                        Book My Free Call
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#333] to-[#1A1A1A] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>

                    <p className="mt-4 text-center text-[0.72rem] text-[#CCC]">
                      No payment required. Cancel anytime.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
