"use client";

import { useState, useRef } from "react";
import { Send, Plus, X, CheckCircle2, AlertCircle, Paperclip, ChevronDown } from "lucide-react";

type SentEmail = {
  id: string;
  to: string;
  subject: string;
  sentAt: Date;
};

const templates = [
  { name: "Welcome", subject: "Welcome to 6POINT!", body: "We're excited to have you on board. Here's what you can expect as we get started working together." },
  { name: "Follow-up", subject: "Following up", body: "Just wanted to check in and see how things are going. Let me know if you have any questions or need anything from us." },
  { name: "Invoice Reminder", subject: "Invoice Reminder", body: "This is a friendly reminder that your invoice is due soon. Please let us know if you have any questions about the charges." },
  { name: "Project Update", subject: "Project Update", body: "Here's a quick update on where we are with your project. We've made some great progress and wanted to keep you in the loop." },
];

export default function MailPage() {
  const [to, setTo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!to || !subject || !body) {
      setStatus({ type: "error", msg: "Please fill in To, Subject, and Body." });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body, firstName: firstName || undefined }),
      });
      const data = await res.json();

      if (data.success) {
        setSentEmails((prev) => [{ id: crypto.randomUUID(), to, subject, sentAt: new Date() }, ...prev]);
        setStatus({ type: "success", msg: `Email sent to ${to}` });
        setTo("");
        setFirstName("");
        setSubject("");
        setBody("");
      } else {
        setStatus({ type: "error", msg: data.error || "Failed to send email" });
      }
    } catch {
      setStatus({ type: "error", msg: "Network error — try again" });
    } finally {
      setSending(false);
    }
  };

  const applyTemplate = (template: typeof templates[number]) => {
    setSubject(template.subject);
    setBody(template.body);
    setShowTemplates(false);
    bodyRef.current?.focus();
  };

  const clearForm = () => {
    setTo("");
    setFirstName("");
    setSubject("");
    setBody("");
    setStatus(null);
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
      {/* Composer */}
      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[1.6rem] font-bold tracking-[-0.03em] text-white">Compose Email</h1>
            <p className="mt-1 text-[0.82rem] text-[#555]">Send emails directly — no appointment required</p>
          </div>
          <button
            onClick={clearForm}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[0.78rem] font-medium text-[#555] transition-all hover:bg-white/[0.04] hover:text-[#888]"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </button>
        </div>

        <div className="rounded-2xl p-6 sm:p-8" style={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Status banner */}
          {status && (
            <div
              className="mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-[0.82rem] font-medium"
              style={{
                backgroundColor: status.type === "success" ? "rgba(93,139,104,0.12)" : "rgba(220,80,80,0.12)",
                color: status.type === "success" ? "#8AB695" : "#E07070",
                border: `1px solid ${status.type === "success" ? "rgba(93,139,104,0.2)" : "rgba(220,80,80,0.2)"}`,
              }}
            >
              {status.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
              {status.msg}
              <button onClick={() => setStatus(null)} className="ml-auto">
                <X className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
              </button>
            </div>
          )}

          {/* To + First Name row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex-1">
              <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#444]">To</label>
              <input
                type="email"
                placeholder="recipient@email.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-[0.88rem] text-white placeholder-[#333] outline-none transition-all focus:ring-1 focus:ring-[#5D8B68]/40"
                style={{ backgroundColor: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)" }}
              />
            </div>
            <div className="w-full sm:w-48">
              <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#444]">First Name</label>
              <input
                type="text"
                placeholder="Optional"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-[0.88rem] text-white placeholder-[#333] outline-none transition-all focus:ring-1 focus:ring-[#5D8B68]/40"
                style={{ backgroundColor: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)" }}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#444]">Subject</label>
              <div className="relative">
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-1 text-[0.7rem] font-medium text-[#5D8B68] transition-all hover:text-[#8AB695]"
                >
                  <Paperclip className="h-3 w-3" />
                  Templates
                  <ChevronDown className={`h-3 w-3 transition-transform ${showTemplates ? "rotate-180" : ""}`} />
                </button>
                {showTemplates && (
                  <div
                    className="absolute right-0 top-7 z-20 w-52 rounded-xl py-1.5 shadow-2xl"
                    style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {templates.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => applyTemplate(t)}
                        className="block w-full px-4 py-2.5 text-left text-[0.78rem] text-[#888] transition-all hover:bg-white/[0.04] hover:text-white"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <input
              type="text"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-[0.88rem] text-white placeholder-[#333] outline-none transition-all focus:ring-1 focus:ring-[#5D8B68]/40"
              style={{ backgroundColor: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)" }}
            />
          </div>

          {/* Body */}
          <div className="mt-4">
            <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[#444]">Body</label>
            <textarea
              ref={bodyRef}
              placeholder="Write your email..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full resize-none rounded-xl px-4 py-3 text-[0.88rem] leading-relaxed text-white placeholder-[#333] outline-none transition-all focus:ring-1 focus:ring-[#5D8B68]/40"
              style={{ backgroundColor: "#0A0A0A", border: "1px solid rgba(255,255,255,0.06)" }}
            />
          </div>

          {/* Send */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-[0.72rem] text-[#333]">
              Sends from <span className="text-[#555]">hello@6pointsolutions.com</span>
            </p>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex items-center gap-2.5 rounded-xl px-6 py-3 text-[0.84rem] font-semibold text-white transition-all disabled:opacity-40"
              style={{
                background: sending ? "#333" : "linear-gradient(135deg, #5D8B68, #4a7254)",
                boxShadow: sending ? "none" : "0 4px 20px rgba(93,139,104,0.25)",
              }}
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      </div>

      {/* Sent history sidebar */}
      <div className="w-full lg:w-72 xl:w-80">
        <h2 className="mb-4 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-[#444]">
          Sent This Session
        </h2>
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}>
          {sentEmails.length === 0 ? (
            <p className="py-8 text-center text-[0.82rem] text-[#333]">No emails sent yet</p>
          ) : (
            <div className="space-y-2">
              {sentEmails.map((email) => (
                <div
                  key={email.id}
                  className="rounded-xl px-4 py-3 transition-all hover:bg-white/[0.02]"
                  style={{ border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <p className="text-[0.78rem] font-medium text-[#CCC] truncate">{email.subject}</p>
                  <p className="mt-0.5 text-[0.7rem] text-[#555] truncate">{email.to}</p>
                  <p className="mt-1 text-[0.62rem] text-[#333]">
                    {email.sentAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
