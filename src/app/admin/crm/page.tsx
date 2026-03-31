"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAdminSession } from "../layout";
import { motion, AnimatePresence } from "motion/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Phone, Calendar, Plus, Building2, MessageSquare, Target,
  PhoneCall, PhoneOff, PhoneMissed, Clock, Check, X, Search,
  Trash2, ChevronDown, Sparkles, Zap, Mail, BarChart3, Users2, TrendingUp,
  ArrowUpRight, ArrowDownRight, Star, Filter, AlertCircle, History, Save, Eye
} from "lucide-react";

/* ─── Animated Counter ─── */
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 600;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span>{display}</span>;
}

/* ─── Types ─── */
type ColdCall = {
  _id: string; contactName: string; phone: string; company: string;
  notes: string; status: string;
  createdAt: number; createdByUser: string;
};
type Appointment = {
  _id: string; contactName: string; company: string; email: string; date: string;
  time: string; type: string;
  notes: string; status: string;
  createdAt: number; createdByUser: string;
};

type Lead = {
  _id: string; name: string; email: string; company: string; source: string;
  score: number; status: string;
  notes: string; createdAt: number; createdByUser: string;
  assignedTo?: string;
};

const CALL_STATUSES = ["new", "contacted", "follow-up", "converted", "lost"] as const;
const APPT_STATUSES = ["scheduled", "completed", "cancelled", "no-show"] as const;
const APPT_TYPES = ["discovery", "proposal", "follow-up", "onboarding", "other"] as const;

/* ─── Color configs (muted / professional) ─── */
const callStatusConfig: Record<string, { bg: string; color: string; border: string; icon: any; label: string }> = {
  new:         { bg: "rgba(180,155,120,0.12)", color: "#B49B78", border: "rgba(180,155,120,0.2)", icon: Clock,     label: "New" },
  contacted:   { bg: "rgba(120,155,180,0.12)", color: "#789BB4", border: "rgba(120,155,180,0.2)", icon: PhoneCall, label: "Contacted" },
  "follow-up": { bg: "rgba(155,130,175,0.12)", color: "#9B82AF", border: "rgba(155,130,175,0.2)", icon: Phone,     label: "Follow-up" },
  converted:   { bg: "rgba(107,143,113,0.12)", color: "#6B8F71", border: "rgba(107,143,113,0.2)", icon: Sparkles,  label: "Converted" },
  lost:        { bg: "rgba(140,140,140,0.08)", color: "#6A6A6A", border: "rgba(140,140,140,0.12)", icon: PhoneOff, label: "Lost" },
};

const apptStatusConfig: Record<string, { bg: string; color: string; border: string; icon: any; label: string }> = {
  scheduled:  { bg: "rgba(120,155,180,0.12)", color: "#789BB4", border: "rgba(120,155,180,0.2)", icon: Calendar,    label: "Scheduled" },
  completed:  { bg: "rgba(107,143,113,0.12)", color: "#6B8F71", border: "rgba(107,143,113,0.2)", icon: Check,       label: "Completed" },
  cancelled:  { bg: "rgba(140,140,140,0.08)", color: "#6A6A6A", border: "rgba(140,140,140,0.12)", icon: X,          label: "Cancelled" },
  "no-show":  { bg: "rgba(180,120,120,0.12)", color: "#B47878", border: "rgba(180,120,120,0.2)", icon: PhoneMissed, label: "No-show" },
};

const apptTypeConfig: Record<string, { label: string; color: string }> = {
  discovery:   { label: "Discovery", color: "#789BB4" },
  proposal:    { label: "Proposal", color: "#9B82AF" },
  "follow-up": { label: "Follow-up", color: "#B49B78" },
  onboarding:  { label: "Onboarding", color: "#6B8F71" },
  other:       { label: "Other", color: "#6A6A6A" },
};

/* ─── Convex CRM data (synced across all devices) ─── */

/* ─── Shared UI ─── */
const inputCls = "w-full rounded-xl bg-white/[0.04] px-4 py-3 text-[0.85rem] font-medium text-white/90 outline-none transition-all duration-200 placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-1 focus:ring-white/10 border border-white/[0.06] focus:border-white/[0.12]";

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: "rgba(18,18,20,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}>{children}</div>
  );
}

function PanelHead({ icon: Icon, title, count }: { icon: any; title: string; count?: number }) {
  return (
    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-white/30" />
        <h3 className="text-[0.88rem] font-semibold text-white/80">{title}</h3>
      </div>
      {count !== undefined && <span className="rounded-lg px-2.5 py-1 text-[0.7rem] font-bold text-white/30" style={{ background: "rgba(255,255,255,0.04)" }}>{count}</span>}
    </div>
  );
}

/* ═══════════════════════ MAIN CRM PAGE ═══════════════════════ */
const leadStatusConfig: Record<string, { bg: string; color: string; border: string; label: string }> = {
  new:       { bg: "rgba(180,155,120,0.12)", color: "#B49B78", border: "rgba(180,155,120,0.2)", label: "New" },
  qualified: { bg: "rgba(120,155,180,0.12)", color: "#789BB4", border: "rgba(120,155,180,0.2)", label: "Qualified" },
  nurturing: { bg: "rgba(155,130,175,0.12)", color: "#9B82AF", border: "rgba(155,130,175,0.2)", label: "Nurturing" },
  converted: { bg: "rgba(107,143,113,0.12)", color: "#6B8F71", border: "rgba(107,143,113,0.2)", label: "Converted" },
  lost:      { bg: "rgba(140,140,140,0.08)", color: "#6A6A6A", border: "rgba(140,140,140,0.12)", label: "Lost" },
};

export default function CRMPage() {
  const { user } = useAdminSession(); // require admin auth
  const username = user?.username || "unknown";

  // ── Convex queries (real-time, synced across devices)
  const calls = (useQuery(api.crm.listCalls) || []) as ColdCall[];
  const appts = (useQuery(api.crm.listAppointments) || []) as Appointment[];
  const leads = (useQuery(api.crm.listLeads) || []) as Lead[];

  // ── Convex mutations
  const addCallMut = useMutation(api.crm.addCall);
  const updateCallStatusMut = useMutation(api.crm.updateCallStatus);
  const removeCallMut = useMutation(api.crm.removeCall);
  const addApptMut = useMutation(api.crm.addAppointment);
  const updateApptStatusMut = useMutation(api.crm.updateApptStatus);
  const removeApptMut = useMutation(api.crm.removeAppointment);
  const addLeadMut = useMutation(api.crm.addLead);
  const updateLeadStatusMut = useMutation(api.crm.updateLeadStatus);
  const assignLeadMut = useMutation(api.crm.assignLead);
  const removeLeadMut = useMutation(api.crm.removeLead);
  const staffUsers = useQuery(api.crm.listStaffUsers) || [];
  const isAdmin = user?.role === "admin" || user?.isAdmin;

  const [view, setView] = useState<"calls" | "appts" | "leads" | "analysis">("calls");
  const [callFilter, setCallFilter] = useState("all");
  const [apptFilter, setApptFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", company: "", source: "", notes: "", assignTo: "" });

  // ── Call form
  const [callForm, setCallForm] = useState({ contactName: "", phone: "", company: "", notes: "" });
  const addCall = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCallMut({ ...callForm, createdByUser: username });
    setCallForm({ contactName: "", phone: "", company: "", notes: "" });
    setShowForm(false);
  };

  // ── Appt form
  const [apptForm, setApptForm] = useState({ contactName: "", company: "", email: "", date: "", time: "", type: "discovery", notes: "" });
  const addAppt = async (e: React.FormEvent) => {
    e.preventDefault();
    await addApptMut({ ...apptForm, createdByUser: username });
    setApptForm({ contactName: "", company: "", email: "", date: "", time: "", type: "discovery", notes: "" });
    setShowForm(false);
  };
  const addLead = async (e: React.FormEvent) => {
    e.preventDefault();
    await addLeadMut({ ...{ name: leadForm.name, email: leadForm.email, company: leadForm.company, source: leadForm.source, notes: leadForm.notes }, createdByUser: username, assignedTo: leadForm.assignTo || undefined });
    setLeadForm({ name: "", email: "", company: "", source: "", notes: "", assignTo: "" });
    setShowForm(false);
  };

  // ── Stats
  const today = new Date().toDateString();
  const todayCalls = calls.filter((c) => new Date(c.createdAt).toDateString() === today).length;
  const upcoming = appts.filter((a) => a.status === "scheduled" && new Date(`${a.date}T${a.time || "00:00"}`) >= new Date()).length;
  const convRate = calls.length > 0 ? Math.round((calls.filter((c) => c.status === "converted").length / calls.length) * 100) : 0;

  // ── Filtered
  const filteredCalls = calls
    .filter((c) => callFilter === "all" || c.status === callFilter)
    .filter((c) => !search || c.contactName.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));
  const filteredAppts = appts.filter((a) => apptFilter === "all" || a.status === apptFilter);

  // ── Lead assignment notifications ──
  type LeadNotif = { id: string; leadName: string; company: string; assignedBy: string; ts: number };
  const [notifications, setNotifications] = useState<LeadNotif[]>([]);
  const seenLeadIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);

  const playNotifSound = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const playTone = (freq: number, start: number, dur: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      playTone(880, 0, 0.15, 0.3);
      playTone(1174.66, 0.12, 0.2, 0.25);
      playTone(1318.51, 0.28, 0.3, 0.2);
    } catch { /* audio not available */ }
  }, []);

  const dismissNotif = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    if (!leads.length) return;
    // On first load, just record all existing IDs
    if (initialLoadRef.current) {
      leads.forEach((l) => seenLeadIdsRef.current.add(l._id));
      initialLoadRef.current = false;
      return;
    }
    // Check for new leads assigned to this user
    const newLeads = leads.filter(
      (l) => !seenLeadIdsRef.current.has(l._id) && l.assignedTo === username
    );
    if (newLeads.length > 0) {
      playNotifSound();
      const newNotifs = newLeads.map((l) => ({
        id: l._id,
        leadName: l.name,
        company: l.company,
        assignedBy: l.createdByUser,
        ts: Date.now(),
      }));
      setNotifications((prev) => [...newNotifs, ...prev].slice(0, 5));
      // Auto-dismiss after 6s
      newNotifs.forEach((n) => setTimeout(() => dismissNotif(n.id), 6000));
    }
    leads.forEach((l) => seenLeadIdsRef.current.add(l._id));
  }, [leads, username, playNotifSound, dismissNotif]);

  return (
    <div>
      {/* ── Lead assignment notification toasts ── */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-auto sm:top-4 sm:right-4 z-[200] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: 380 }}>
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 80, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="pointer-events-auto relative overflow-hidden rounded-2xl shadow-2xl"
              style={{ background: "rgba(14,14,16,0.97)", border: "1px solid rgba(93,139,104,0.25)", backdropFilter: "blur(20px)" }}
            >
              {/* Top green accent bar */}
              <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, #5D8B68, #8AB695, #5D8B68)" }} />
              <div className="flex items-start gap-3 px-4 py-3.5">
                {/* Pulse icon */}
                <div className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(93,139,104,0.15)" }}>
                  <div className="absolute inset-0 animate-ping rounded-xl" style={{ background: "rgba(93,139,104,0.15)" }} />
                  <Target className="relative h-4 w-4" style={{ color: "#8AB695" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em]" style={{ color: "#8AB695" }}>New Lead Assigned</p>
                  <p className="mt-0.5 text-[0.88rem] font-bold text-white/90 truncate">{n.leadName}{n.company ? ` · ${n.company}` : ""}</p>
                  <p className="mt-0.5 text-[0.72rem] text-white/30">Assigned by <span className="font-semibold text-white/50">@{n.assignedBy}</span></p>
                </div>
                <button onClick={() => dismissNotif(n.id)} className="shrink-0 mt-0.5 rounded-lg p-1.5 text-white/15 transition-colors hover:bg-white/[0.05] hover:text-white/40">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {/* Progress bar / auto-dismiss timer */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="h-[2px]" style={{ background: "rgba(93,139,104,0.4)" }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* ─── Header ─── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[1.5rem] font-bold tracking-[-0.02em] text-white/90">CRM</h1>
          <p className="mt-1 text-[0.82rem] text-white/35">Track cold calls and manage appointments</p>
        </div>
        {view !== "analysis" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.8rem] font-semibold text-white/90 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : view === "calls" ? "Log Call" : view === "appts" ? "Book Appointment" : view === "leads" ? "Add Lead" : ""}
          </button>
        )}
      </div>

      {/* ─── Stats Row ─── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatMini icon={PhoneCall} label="Total Calls" value={calls.length} color="#789BB4" />
        <StatMini icon={Zap} label="Today" value={todayCalls} color="#B49B78" />
        <StatMini icon={Calendar} label="Upcoming" value={upcoming} color="#9B82AF" />
        <StatMini icon={Target} label="Conversion" value={convRate} suffix="%" color="#6B8F71" />
      </motion.div>

      {/* ─── View Toggle ─── */}
      <div className="mb-6 flex items-center gap-4 overflow-x-auto">
        <div className="flex items-center rounded-xl p-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
          {(["calls", "appts", "leads", "analysis"] as const).map((v) => (
            <button key={v} onClick={() => { setView(v); setShowForm(false); }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-[0.78rem] font-semibold transition-all duration-200 whitespace-nowrap"
              style={{
                color: view === v ? "#fff" : "rgba(255,255,255,0.35)",
                background: view === v ? "rgba(255,255,255,0.08)" : "transparent",
              }}
            >
              {v === "calls" ? <><Phone className="h-3.5 w-3.5" /> Cold Calls</> : v === "appts" ? <><Calendar className="h-3.5 w-3.5" /> Appointments</> : v === "leads" ? <><Users2 className="h-3.5 w-3.5" /> Lead Tracker</> : <><BarChart3 className="h-3.5 w-3.5" /> Analysis</>}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Add Form ─── */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="mb-6 overflow-hidden">
            <Panel>
              <PanelHead icon={view === "calls" ? PhoneCall : view === "appts" ? Calendar : Users2} title={view === "calls" ? "Log New Call" : view === "appts" ? "Schedule Appointment" : "Add New Lead"} />
              <div className="p-5">
                {view === "calls" ? (
                  <form onSubmit={addCall} className="grid gap-3 sm:grid-cols-2">
                    <input className={inputCls} placeholder="Contact name *" value={callForm.contactName} onChange={(e) => setCallForm({ ...callForm, contactName: e.target.value })} required />
                    <input className={inputCls} placeholder="Phone *" value={callForm.phone} onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })} required />
                    <input className={inputCls} placeholder="Company" value={callForm.company} onChange={(e) => setCallForm({ ...callForm, company: e.target.value })} />
                    <input className={inputCls} placeholder="Notes" value={callForm.notes} onChange={(e) => setCallForm({ ...callForm, notes: e.target.value })} />
                    <button type="submit" className="sm:col-span-2 flex items-center justify-center gap-2 rounded-xl py-3 text-[0.82rem] font-semibold text-white/90 transition-all hover:brightness-110 active:scale-[0.98]" style={{ background: "rgba(120,155,180,0.2)", border: "1px solid rgba(120,155,180,0.25)" }}>
                      <PhoneCall className="h-4 w-4" /> Log Call
                    </button>
                  </form>
                ) : view === "appts" ? (
                  <form onSubmit={addAppt} className="grid gap-3 sm:grid-cols-2">
                    <input className={inputCls} placeholder="Contact name *" value={apptForm.contactName} onChange={(e) => setApptForm({ ...apptForm, contactName: e.target.value })} required />
                    <input className={inputCls} placeholder="Company" value={apptForm.company} onChange={(e) => setApptForm({ ...apptForm, company: e.target.value })} />
                    <input className={inputCls} type="email" placeholder="Email" value={apptForm.email} onChange={(e) => setApptForm({ ...apptForm, email: e.target.value })} />
                    <input className={inputCls} type="date" value={apptForm.date} onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })} required style={{ colorScheme: "dark" }} />
                    <input className={inputCls} type="time" value={apptForm.time} onChange={(e) => setApptForm({ ...apptForm, time: e.target.value })} required style={{ colorScheme: "dark" }} />
                    <div className="relative">
                      <select className={`${inputCls} appearance-none pr-10`} value={apptForm.type} onChange={(e) => setApptForm({ ...apptForm, type: e.target.value as Appointment["type"] })}>
                        {APPT_TYPES.map((t) => <option key={t} value={t}>{apptTypeConfig[t].label}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                    </div>
                    <input className={inputCls} placeholder="Notes" value={apptForm.notes} onChange={(e) => setApptForm({ ...apptForm, notes: e.target.value })} />
                    <button type="submit" className="sm:col-span-2 flex items-center justify-center gap-2 rounded-xl py-3 text-[0.82rem] font-semibold text-white/90 transition-all hover:brightness-110 active:scale-[0.98]" style={{ background: "rgba(155,130,175,0.2)", border: "1px solid rgba(155,130,175,0.25)" }}>
                      <Calendar className="h-4 w-4" /> Schedule
                    </button>
                  </form>
                ) : (
                  <form onSubmit={addLead} className="grid gap-3 sm:grid-cols-2">
                    <input className={inputCls} placeholder="Lead name *" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} required />
                    <input className={inputCls} type="email" placeholder="Email *" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} required />
                    <input className={inputCls} placeholder="Company" value={leadForm.company} onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })} />
                    <input className={inputCls} placeholder="Source (e.g. Referral, Website)" value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })} />
                    <input className={`${inputCls} sm:col-span-2`} placeholder="Notes" value={leadForm.notes} onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })} />
                    {isAdmin && staffUsers.length > 0 && (
                      <div className="relative sm:col-span-2">
                        <select className={`${inputCls} appearance-none pr-10`} value={leadForm.assignTo} onChange={(e) => setLeadForm({ ...leadForm, assignTo: e.target.value })}>
                          <option value="">Assign to (optional)</option>
                          {staffUsers.map((su) => <option key={su.username} value={su.username}>{su.name} (@{su.username}) — {su.role}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                      </div>
                    )}
                    <button type="submit" className="sm:col-span-2 flex items-center justify-center gap-2 rounded-xl py-3 text-[0.82rem] font-semibold text-white/90 transition-all hover:brightness-110 active:scale-[0.98]" style={{ background: "rgba(180,155,120,0.2)", border: "1px solid rgba(180,155,120,0.25)" }}>
                      <Users2 className="h-4 w-4" /> Add Lead
                    </button>
                  </form>
                )}
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === "calls" && (
          <motion.div key="calls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {/* Filters + search */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-1.5">
                {["all", ...CALL_STATUSES].map((f) => {
                  const active = callFilter === f;
                  return (
                    <button key={f} onClick={() => setCallFilter(f)} className="rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold transition-all" style={{ background: active ? "rgba(255,255,255,0.08)" : "transparent", color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", border: `1px solid ${active ? "rgba(255,255,255,0.1)" : "transparent"}` }}>
                      {f === "all" ? "All" : callStatusConfig[f]?.label || f}
                    </button>
                  );
                })}
              </div>
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/20" />
                <input className={`${inputCls} pl-9 !py-2 text-[0.78rem]`} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50"><X className="h-3 w-3" /></button>}
              </div>
            </div>

            <Panel>
              <PanelHead icon={Phone} title="Cold Calls" count={filteredCalls.length} />
              <div className="divide-y divide-white/[0.04]">
                {filteredCalls.length > 0 ? filteredCalls.map((call) => (
                  <CallRow key={call._id} call={call}
                    onStatus={(s) => updateCallStatusMut({ id: call._id as any, status: s })}
                    onDelete={() => { if (confirm("Delete this call?")) removeCallMut({ id: call._id as any }); }}
                  />
                )) : (
                  <div className="flex flex-col items-center py-16 text-center">
                    <Phone className="mb-3 h-8 w-8 text-white/10" />
                    <p className="text-[0.82rem] text-white/25">{search || callFilter !== "all" ? "No matching calls" : "No calls yet"}</p>
                  </div>
                )}
              </div>
            </Panel>
          </motion.div>
        )}

        {view === "appts" && (
          <motion.div key="appts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {/* Filters */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {["all", ...APPT_STATUSES].map((f) => {
                const active = apptFilter === f;
                return (
                  <button key={f} onClick={() => setApptFilter(f)} className="rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold transition-all" style={{ background: active ? "rgba(255,255,255,0.08)" : "transparent", color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", border: `1px solid ${active ? "rgba(255,255,255,0.1)" : "transparent"}` }}>
                    {f === "all" ? "All" : apptStatusConfig[f]?.label || f}
                  </button>
                );
              })}
            </div>

            <Panel>
              <PanelHead icon={Calendar} title="Appointments" count={filteredAppts.length} />
              <div className="divide-y divide-white/[0.04]">
                {filteredAppts.length > 0 ? filteredAppts.map((appt) => (
                  <ApptRow key={appt._id} appt={appt}
                    onStatus={(s) => updateApptStatusMut({ id: appt._id as any, status: s })}
                    onDelete={() => { if (confirm("Delete this appointment?")) removeApptMut({ id: appt._id as any }); }}
                  />
                )) : (
                  <div className="flex flex-col items-center py-16 text-center">
                    <Calendar className="mb-3 h-8 w-8 text-white/10" />
                    <p className="text-[0.82rem] text-white/25">{apptFilter !== "all" ? "No matching appointments" : "No appointments yet"}</p>
                  </div>
                )}
              </div>
            </Panel>
          </motion.div>
        )}

        {/* ─── Lead Tracker View ─── */}
        {view === "leads" && (() => {
          // Staff only see leads assigned to them; admins see all
          const visibleLeads = isAdmin ? leads : leads.filter((l) => l.assignedTo === username);
          return (
          <motion.div key="leads" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Panel>
              <PanelHead icon={Users2} title="Lead Pipeline" count={visibleLeads.length} />
              <div className="divide-y divide-white/[0.04]">
                {visibleLeads.length > 0 ? visibleLeads.map((lead) => {
                  const sc = leadStatusConfig[lead.status] || leadStatusConfig.new;
                  return (
                    <div key={lead._id} className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.015]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[0.8rem] font-bold" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[0.85rem] font-semibold text-white/85">{lead.name}</span>
                          {lead.company && (
                            <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.6rem] font-medium text-white/30" style={{ background: "rgba(255,255,255,0.04)" }}>
                              <Building2 className="h-2.5 w-2.5" /> {lead.company}
                            </span>
                          )}
                          <span className="rounded px-2 py-0.5 text-[0.6rem] font-semibold uppercase" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{sc.label}</span>
                          <span className="flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[0.6rem] font-bold" style={{ background: `${lead.score >= 70 ? "rgba(107,143,113,0.12)" : lead.score >= 40 ? "rgba(180,155,120,0.12)" : "rgba(180,120,120,0.12)"}`, color: lead.score >= 70 ? "#6B8F71" : lead.score >= 40 ? "#B49B78" : "#B47878" }}>
                            <Star className="h-2.5 w-2.5" /> {lead.score}
                          </span>
                          {lead.assignedTo && (
                            <span className="rounded px-1.5 py-0.5 text-[0.58rem] font-semibold" style={{ background: "rgba(93,139,104,0.15)", color: "#8AB695", border: "1px solid rgba(93,139,104,0.2)" }}>
                              → @{lead.assignedTo}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-[0.72rem] text-white/25">
                          {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</span>}
                          {lead.source && <span className="flex items-center gap-1"><Filter className="h-3 w-3" /> {lead.source}</span>}
                          <span>{new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </div>
                      </div>
                      {/* Assign dropdown — admins only */}
                      {isAdmin && staffUsers.length > 0 && (
                        <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <select
                            className="h-7 appearance-none rounded-lg bg-white/[0.04] px-2 pr-6 text-[0.65rem] font-medium text-white/40 outline-none border border-white/[0.06] cursor-pointer hover:bg-white/[0.07]"
                            value={lead.assignedTo || ""}
                            onChange={(e) => assignLeadMut({ id: lead._id as any, assignedTo: e.target.value })}
                          >
                            <option value="">Assign</option>
                            {staffUsers.map((su) => <option key={su.username} value={su.username}>{su.name}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/15" />
                        </div>
                      )}
                      <div className="flex gap-1">
                        {(["new","qualified","nurturing","converted","lost"] as const).map((s) => (
                          <button key={s} onClick={() => updateLeadStatusMut({ id: lead._id as any, status: s })}
                            className="h-2 w-2 rounded-full transition-all hover:scale-150" title={leadStatusConfig[s].label}
                            style={{ background: lead.status === s ? leadStatusConfig[s].color : "rgba(255,255,255,0.08)", border: `1px solid ${lead.status === s ? leadStatusConfig[s].border : "rgba(255,255,255,0.06)"}` }} />
                        ))}
                      </div>
                      <button onClick={() => { if (confirm("Delete this lead?")) removeLeadMut({ id: lead._id as any }); }}
                        className="shrink-0 rounded-lg p-2 text-white/10 opacity-0 transition-all hover:bg-white/[0.04] hover:text-red-400/70 group-hover:opacity-100">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                }) : (
                  <div className="flex flex-col items-center py-16 text-center">
                    <Users2 className="mb-3 h-8 w-8 text-white/10" />
                    <p className="text-[0.82rem] text-white/25">{isAdmin ? "No leads yet — add your first lead above" : "No leads assigned to you yet"}</p>
                  </div>
                )}
              </div>
            </Panel>
          </motion.div>
          );
        })()}

        {/* ─── Business Analysis View ─── */}
        {view === "analysis" && (
          <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <AnalysisTool />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════ STAT MINI ═══════════════════════ */
function StatMini({ icon: Icon, label, value, suffix, color }: { icon: any; label: string; value: number; suffix?: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 hover:bg-white/[0.02]" style={{ background: "rgba(18,18,20,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${color}15`, border: `1px solid ${color}20` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-white/30">{label}</p>
        <p className="text-[1.15rem] font-bold tracking-tight text-white/80 leading-tight"><AnimatedNumber value={value} />{suffix && <span className="text-[0.75rem] ml-0.5 text-white/40">{suffix}</span>}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════ CALL ROW ═══════════════════════ */
function CallRow({ call, onStatus, onDelete }: { call: ColdCall; onStatus: (s: string) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const sc = callStatusConfig[call.status] || callStatusConfig.new;
  const StatusIcon = sc.icon;

  return (
    <div className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.015]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
        <Phone className="h-4 w-4" style={{ color: sc.color }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.85rem] font-semibold text-white/85">{call.contactName}</span>
          {call.company && (
            <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.6rem] font-medium text-white/30" style={{ background: "rgba(255,255,255,0.04)" }}>
              <Building2 className="h-2.5 w-2.5" /> {call.company}
            </span>
          )}
          {/* Status dropdown */}
          <div className="relative">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1 rounded px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.03em] transition-all hover:brightness-125" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
              <StatusIcon className="h-2.5 w-2.5" /> {sc.label}
              <ChevronDown className="h-2.5 w-2.5 opacity-50" />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }} className="absolute left-0 top-full z-30 mt-1 w-36 overflow-hidden rounded-lg py-1" style={{ background: "#1A1A1E", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                  {CALL_STATUSES.map((s) => {
                    const cf = callStatusConfig[s];
                    return (
                      <button key={s} onClick={() => { onStatus(s); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[0.72rem] font-medium transition-all hover:bg-white/[0.04]" style={{ color: call.status === s ? cf.color : "rgba(255,255,255,0.4)" }}>
                        <div className="h-1.5 w-1.5 rounded-full" style={{ background: cf.color }} /> {cf.label}
                        {call.status === s && <Check className="ml-auto h-3 w-3" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-[0.72rem] text-white/25">
          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {call.phone}</span>
          {call.notes && <span className="flex items-center gap-1 truncate"><MessageSquare className="h-3 w-3" /> {call.notes}</span>}
          <span>{new Date(call.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>
      </div>

      <button onClick={onDelete} className="shrink-0 rounded-lg p-2 text-white/10 opacity-0 transition-all hover:bg-white/[0.04] hover:text-red-400/70 group-hover:opacity-100">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ═══════════════════════ APPT ROW ═══════════════════════ */
function ApptRow({ appt, onStatus, onDelete }: { appt: Appointment; onStatus: (s: string) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const sc = apptStatusConfig[appt.status] || apptStatusConfig.scheduled;
  const StatusIcon = sc.icon;
  const typeInfo = apptTypeConfig[appt.type] || apptTypeConfig.other;
  const dt = new Date(`${appt.date}T${appt.time || "00:00"}`);
  const overdue = dt < new Date() && appt.status === "scheduled";

  return (
    <div className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.015]">
      {/* Date block */}
      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg" style={{ background: sc.bg, border: `1px solid ${sc.border}` }}>
        <span className="text-[0.55rem] font-bold uppercase tracking-wider" style={{ color: sc.color }}>{dt.toLocaleDateString("en-US", { month: "short" })}</span>
        <span className="text-[1rem] font-extrabold leading-none text-white/80">{dt.getDate()}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.85rem] font-semibold text-white/85">{appt.contactName}</span>
          {appt.company && (
            <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.6rem] font-medium text-white/30" style={{ background: "rgba(255,255,255,0.04)" }}>
              <Building2 className="h-2.5 w-2.5" /> {appt.company}
            </span>
          )}
          <span className="rounded px-1.5 py-0.5 text-[0.58rem] font-semibold" style={{ background: `${typeInfo.color}12`, color: typeInfo.color, border: `1px solid ${typeInfo.color}20` }}>{typeInfo.label}</span>
          {/* Status dropdown */}
          <div className="relative">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1 rounded px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.03em] transition-all hover:brightness-125" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
              <StatusIcon className="h-2.5 w-2.5" /> {sc.label}
              <ChevronDown className="h-2.5 w-2.5 opacity-50" />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }} className="absolute left-0 top-full z-30 mt-1 w-36 overflow-hidden rounded-lg py-1" style={{ background: "#1A1A1E", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                  {APPT_STATUSES.map((s) => {
                    const cf = apptStatusConfig[s];
                    return (
                      <button key={s} onClick={() => { onStatus(s); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[0.72rem] font-medium transition-all hover:bg-white/[0.04]" style={{ color: appt.status === s ? cf.color : "rgba(255,255,255,0.4)" }}>
                        <div className="h-1.5 w-1.5 rounded-full" style={{ background: cf.color }} /> {cf.label}
                        {appt.status === s && <Check className="ml-auto h-3 w-3" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {overdue && <span className="text-[0.6rem] font-semibold text-[#B47878]">Overdue</span>}
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-[0.72rem] text-white/25">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
          {appt.notes && <span className="flex items-center gap-1 truncate"><MessageSquare className="h-3 w-3" /> {appt.notes}</span>}
        </div>
      </div>

      <button onClick={onDelete} className="shrink-0 rounded-lg p-2 text-white/10 opacity-100 sm:opacity-0 transition-all hover:bg-white/[0.04] hover:text-red-400/70 group-hover:opacity-100">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ═══════════════════════ ANALYSIS TOOL ═══════════════════════ */
const TOOL_CALLS = [
  { id: "google", label: "google_search", desc: "Indexing search results" },
  { id: "facebook", label: "fb_pages_scan", desc: "Scanning Facebook pages" },
  { id: "twitter", label: "x_profile_lookup", desc: "Pulling X / Twitter data" },
  { id: "exa", label: "deep_web_crawl", desc: "Crawling web sources" },
  { id: "ai", label: "generate_report", desc: "Synthesizing intelligence report" },
];

function AnalysisTool() {
  const [mode, setMode] = useState<"form" | "searching" | "disambiguate" | "report" | "history">("form");
  const [form, setForm] = useState({ businessName: "", website: "", facebookUrl: "", twitterHandle: "", location: "" });
  const [activeStep, setActiveStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [resultCount, setResultCount] = useState(0);
  const [report, setReport] = useState("");
  const [sources, setSources] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [disambigOptions, setDisambigOptions] = useState<{ name: string; detail: string }[]>([]);
  const [emailTo, setEmailTo] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [thinkingLog, setThinkingLog] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const counterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const thinkingRef = useRef<HTMLDivElement>(null);

  // Convex
  const savedAnalyses = useQuery(api.analyses.list) || [];
  const saveAnalysis = useMutation(api.analyses.save);
  const removeAnalysis = useMutation(api.analyses.remove);

  const clearTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (counterRef.current) clearInterval(counterRef.current);
  };

  // Simulated thinking messages during search
  const pushThought = (msg: string) => {
    setThinkingLog((prev) => [...prev, msg]);
    setTimeout(() => thinkingRef.current?.scrollTo({ top: thinkingRef.current.scrollHeight, behavior: "smooth" }), 50);
  };

  const runAnalysis = async (e?: React.FormEvent, selectedBusiness?: string) => {
    if (e) e.preventDefault();
    if (!form.businessName.trim()) return;
    setMode("searching");
    setActiveStep(0);
    setElapsed(0);
    setResultCount(0);
    setError("");
    setThinkingLog([]);

    timerRef.current = setInterval(() => setElapsed((p) => +(p + 0.1).toFixed(1)), 100);
    counterRef.current = setInterval(() => setResultCount((p) => p + Math.floor(Math.random() * 3) + 1), 300);

    // Simulated thinking messages
    const thoughts = [
      `Initializing search for "${form.businessName}"...`,
      form.location ? `Filtering results for ${form.location}` : "No location filter — scanning all regions",
      "Querying Google Search API...",
      "Scanning Facebook business pages...",
      "Pulling Twitter/X mentions and activity...",
      "Crawling deep web sources via Exa.ai...",
      "Cross-referencing data points...",
    ];
    let thoughtIdx = 0;
    const thoughtInterval = setInterval(() => {
      if (thoughtIdx < thoughts.length) { pushThought(thoughts[thoughtIdx]); thoughtIdx++; }
    }, 1800);

    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      if (step < TOOL_CALLS.length - 1) setActiveStep(step);
      else { clearInterval(stepInterval); setActiveStep(TOOL_CALLS.length - 1); }
    }, 2400);

    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, selectedBusiness }),
      });
      const data = await res.json();
      clearInterval(stepInterval);
      clearInterval(thoughtInterval);
      clearTimers();

      // Push real snippets from the API
      if (data.snippets) {
        for (const s of data.snippets) pushThought(s);
      }

      if (data.success && data.disambiguation) {
        setDisambigOptions(data.options || []);
        setSources(data.sources || {});
        setMode("disambiguate");
      } else if (data.success) {
        setActiveStep(TOOL_CALLS.length);
        setSources(data.sources || {});
        pushThought("✓ Report generated successfully");
        // Auto-save to Convex
        try {
          await saveAnalysis({
            businessName: form.businessName,
            location: form.location || undefined,
            website: form.website || undefined,
            report: data.report,
            sources: data.sources,
          });
          pushThought("✓ Analysis saved");
        } catch { /* silent */ }
        setTimeout(() => { setReport(data.report); setMode("report"); }, 800);
      } else {
        setError(data.error || "Analysis failed");
        setMode("form");
      }
    } catch {
      clearInterval(stepInterval);
      clearInterval(thoughtInterval);
      clearTimers();
      setError("Network error. Please try again.");
      setMode("form");
    }
  };

  const pickBusiness = (selected: string) => {
    runAnalysis(undefined, selected);
  };

  const emailReport = async () => {
    if (!emailTo) return;
    setEmailSending(true);
    try {
      const res = await fetch("/api/analysis/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo,
          businessName: form.businessName,
          report,
        }),
      });
      const data = await res.json();
      if (data.success) { setEmailSent(true); setTimeout(() => setEmailSent(false), 4000); }
      else setError(data.error || "Email failed");
    } catch { setError("Failed to send email"); }
    setEmailSending(false);
  };

  const viewSavedReport = (analysis: any) => {
    setForm({ businessName: analysis.businessName, website: analysis.website || "", facebookUrl: "", twitterHandle: "", location: analysis.location || "" });
    setReport(analysis.report);
    setSources(analysis.sources);
    setMode("report");
  };

  const resetForm = () => {
    setMode("form"); setReport(""); setActiveStep(0); setSources({}); setDisambigOptions([]); setEmailTo(""); setThinkingLog([]);
    setForm({ businessName: "", website: "", facebookUrl: "", twitterHandle: "", location: "" });
  };

  /* ── Form ── */
  if (mode === "form") {
    return (
      <Panel>
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-white/25" />
            <span className="text-[0.82rem] font-semibold text-white/70">Business Intelligence</span>
            <span className="ml-auto rounded px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-wider text-white/20" style={{ background: "rgba(255,255,255,0.04)" }}>AI Powered</span>
          </div>
        </div>
        <form onSubmit={runAnalysis} className="p-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/25">Target Business *</label>
              <input className={inputCls} placeholder="Business name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/25">City / Location</label>
              <input className={inputCls} placeholder="e.g. Denver, CO" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/25">Website</label>
              <input className={inputCls} placeholder="https://..." value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/25">Facebook</label>
              <input className={inputCls} placeholder="Page name or URL" value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/25">X / Twitter</label>
              <input className={inputCls} placeholder="@handle" value={form.twitterHandle} onChange={(e) => setForm({ ...form, twitterHandle: e.target.value })} />
            </div>
          </div>
          {error && <div className="rounded-lg px-3.5 py-2.5 text-[0.78rem] font-medium text-[#B47878]" style={{ background: "rgba(180,120,120,0.08)" }}>{error}</div>}
          <div className="flex gap-2">
            <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[0.82rem] font-semibold text-white/80 transition-all hover:text-white active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Search className="h-3.5 w-3.5" /> Run Analysis
            </button>
            {savedAnalyses.length > 0 && (
              <button type="button" onClick={() => setMode("history")} className="flex items-center gap-1.5 rounded-xl px-4 py-3 text-[0.75rem] font-medium text-white/30 transition-all hover:text-white/50"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <History className="h-3.5 w-3.5" /> {savedAnalyses.length}
              </button>
            )}
          </div>
        </form>
      </Panel>
    );
  }

  /* ── Disambiguation ── */
  if (mode === "disambiguate") {
    return (
      <Panel>
        <div className="p-6">
          <div className="mb-5">
            <h3 className="text-[0.92rem] font-semibold text-white/80">Multiple businesses found</h3>
            <p className="mt-1 text-[0.72rem] text-white/30">We found several businesses named &quot;{form.businessName}&quot;. Which one are you looking for?</p>
          </div>
          <div className="space-y-2">
            {disambigOptions.map((opt, i) => (
              <button key={i} onClick={() => pickBusiness(opt.name)}
                className="flex w-full items-start gap-3 rounded-xl px-4 py-3.5 text-left transition-all hover:bg-white/[0.04]"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[0.7rem] font-bold text-white/30" style={{ background: "rgba(255,255,255,0.04)" }}>{i + 1}</div>
                <div>
                  <span className="text-[0.82rem] font-semibold text-white/70">{opt.name}</span>
                  {opt.detail && <p className="mt-0.5 text-[0.72rem] text-white/25">{opt.detail}</p>}
                </div>
                <ArrowUpRight className="ml-auto mt-1 h-3.5 w-3.5 shrink-0 text-white/15" />
              </button>
            ))}
          </div>
          <button onClick={resetForm} className="mt-4 w-full text-center text-[0.72rem] font-medium text-white/20 hover:text-white/40 transition-colors">Start over</button>
        </div>
      </Panel>
    );
  }

  /* ── Searching (tool-call style) ── */
  if (mode === "searching") {
    return (
      <Panel>
        <div className="p-6">
          {/* Timer bar */}
          <div className="mb-6 flex items-center justify-between text-[0.68rem] font-mono text-white/25">
            <span>analyzing <span className="text-white/50">{form.businessName}</span></span>
            <span>{elapsed}s · {resultCount} results</span>
          </div>

          {/* Tool calls */}
          <div className="space-y-1">
            {TOOL_CALLS.map((tc, i) => {
              const done = i < activeStep;
              const active = i === activeStep;
              return (
                <motion.div key={tc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 }}
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 font-mono text-[0.75rem]"
                  style={{ background: active ? "rgba(255,255,255,0.03)" : "transparent" }}>
                  {/* Status indicator */}
                  <div className="w-4 flex justify-center">
                    {done ? (
                      <Check className="h-3 w-3 text-white/30" />
                    ) : active ? (
                      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity }}
                        className="h-1.5 w-1.5 rounded-full bg-white/50" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-white/[0.06]" />
                    )}
                  </div>
                  {/* Function name */}
                  <span className={done ? "text-white/25 line-through" : active ? "text-white/60" : "text-white/15"}>
                    {tc.label}()
                  </span>
                  {/* Description */}
                  {active && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-auto text-[0.65rem] text-white/20">
                      {tc.desc}...
                    </motion.span>
                  )}
                  {done && <span className="ml-auto text-[0.6rem] text-white/15">done</span>}
                </motion.div>
              );
            })}
          </div>

          {/* AI Thinking Feed */}
          {thinkingLog.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
                <span className="text-[0.58rem] font-semibold uppercase tracking-wider text-white/15">AI Thinking</span>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
              <div ref={thinkingRef} className="max-h-32 overflow-y-auto rounded-lg px-3 py-2 font-mono text-[0.68rem] space-y-0.5" style={{ background: "rgba(255,255,255,0.02)" }}>
                {thinkingLog.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                    className={msg.startsWith("→") ? "text-white/25 pl-3" : msg.startsWith("  ") ? "text-blue-400/40 pl-5 text-[0.6rem]" : msg.startsWith("✓") ? "text-green-400/50" : "text-white/30"}>
                    {msg}
                  </motion.div>
                ))}
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-white/20">▋</motion.div>
              </div>
            </div>
          )}

          {/* Bottom pulse */}
          <div className="mt-4 flex items-center gap-3 justify-center">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} animate={{ opacity: [0.15, 0.5, 0.15] }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                  className="h-1 w-1 rounded-full bg-white/40" />
              ))}
            </div>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
          </div>
        </div>
      </Panel>
    );
  }

  /* ── History ── */
  if (mode === "history") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-white/25" />
            <span className="text-[0.88rem] font-semibold text-white/70">Saved Analyses</span>
            <span className="rounded px-1.5 py-0.5 text-[0.6rem] font-bold text-white/20" style={{ background: "rgba(255,255,255,0.04)" }}>{savedAnalyses.length}</span>
          </div>
          <button onClick={() => setMode("form")} className="text-[0.72rem] font-medium text-white/30 hover:text-white/50 transition-colors">← New Analysis</button>
        </div>
        <div className="space-y-2">
          {savedAnalyses.map((a: any) => (
            <Panel key={a._id}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[0.82rem] font-semibold text-white/65">{a.businessName}</span>
                  {a.location && <span className="ml-2 text-[0.68rem] text-white/20">{a.location}</span>}
                  <p className="text-[0.62rem] font-mono text-white/15 mt-0.5">{new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <button onClick={() => viewSavedReport(a)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.68rem] font-medium text-white/30 hover:text-white/50 hover:bg-white/[0.03] transition-all" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Eye className="h-3 w-3" /> View
                </button>
                <button onClick={() => removeAnalysis({ id: a._id })} className="rounded-lg p-1.5 text-white/15 hover:text-red-400/50 hover:bg-white/[0.03] transition-all">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    );
  }

  /* ── Report ── */
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-[1rem] font-semibold text-white/80">{form.businessName}</h3>
          <p className="text-[0.68rem] text-white/20 font-mono">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · 6POINT Intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={resetForm} className="rounded-lg px-3 py-1.5 text-[0.72rem] font-medium text-white/30 transition-all hover:text-white/50 hover:bg-white/[0.03]"
            style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
            New Analysis
          </button>
        </div>
      </div>

      {/* Source pills */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(sources).map(([key, ok]) => (
          <span key={key} className="flex items-center gap-1 rounded px-2 py-0.5 text-[0.58rem] font-mono"
            style={{ background: "rgba(255,255,255,0.03)", color: ok ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.04)" }}>
            {ok ? "✓" : "✗"} {key}
          </span>
        ))}
      </div>

      {/* Report body */}
      <Panel>
        <div className="p-4 sm:p-6 md:p-8">
          <ReportRenderer content={report} />
        </div>
      </Panel>

      {/* Email Report */}
      <Panel>
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-3.5 w-3.5 text-white/25" />
            <span className="text-[0.78rem] font-semibold text-white/50">Email Report</span>
          </div>
          <div className="flex gap-2">
            <input className={inputCls + " flex-1"} type="email" placeholder="recipient@email.com" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} />
            <button onClick={emailReport} disabled={!emailTo || emailSending}
              className="shrink-0 rounded-lg px-4 py-2 text-[0.75rem] font-semibold text-white/60 transition-all hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {emailSent ? "✓ Sent" : emailSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ═══════════════════════ REPORT RENDERER ═══════════════════════ */
function ReportRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  const scoreLines: { label: string; score: number }[] = [];
  let collectingScores = false;

  // First pass: collect score lines for the score card
  for (const line of lines) {
    const t = line.trim();
    const sm = t.match(/^[-*]\s*(.+?):\s*(\d+)\/100$/);
    if (sm) scoreLines.push({ label: sm[1], score: parseInt(sm[2]) });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) { elements.push(<div key={i} className="h-2" />); continue; }
    if (trimmed === "---" || trimmed === "***") { elements.push(<div key={i} className="my-6 h-px" style={{ background: "rgba(255,255,255,0.04)" }} />); continue; }

    // # H1 heading
    if (/^# [^#]/.test(trimmed)) {
      elements.push(
        <div key={i} className="mt-8 mb-5 first:mt-0">
          <h1 className="text-[1.1rem] font-bold text-white/85 tracking-[-0.02em]">{renderInline(trimmed.slice(2))}</h1>
          <div className="mt-2 h-px w-16" style={{ background: "rgba(255,255,255,0.12)" }} />
        </div>
      );
      continue;
    }

    // ## H2 heading
    if (trimmed.startsWith("## ")) {
      const headingText = trimmed.slice(3);
      // If this is the Scoring section, render the score card instead
      if ((headingText.toLowerCase().includes("score") || headingText.toLowerCase().includes("scoring")) && scoreLines.length > 0) {
        collectingScores = true;
        const overall = scoreLines.find((s) => s.label.toLowerCase().includes("overall"));
        const others = scoreLines.filter((s) => !s.label.toLowerCase().includes("overall"));
        elements.push(
          <div key={i} className="mt-8 mb-4">
            <h2 className="text-[0.95rem] font-bold text-white/80">{headingText}</h2>
            <div className="mt-1.5 h-px w-12 mb-5" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((s, si) => {
                const c = s.score >= 70 ? "#5B9A6B" : s.score >= 40 ? "#C4A35A" : "#C45A5A";
                return (
                  <div key={si} className="rounded-xl p-3 sm:p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[0.62rem] sm:text-[0.68rem] font-medium text-white/35 truncate pr-2">{s.label}</span>
                      <span className="text-[0.82rem] font-bold font-mono shrink-0" style={{ color: c }}>{s.score}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${s.score}%`, background: c }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {overall && (
              <div className="mt-4 flex items-center justify-between rounded-xl px-4 sm:px-5 py-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[0.78rem] sm:text-[0.82rem] font-semibold text-white/50">Overall Score</span>
                <span className="text-[1.3rem] font-bold font-mono" style={{ color: overall.score >= 70 ? "#5B9A6B" : overall.score >= 40 ? "#C4A35A" : "#C45A5A" }}>{overall.score}<span className="text-[0.7rem] text-white/20">/100</span></span>
              </div>
            )}
          </div>
        );
        continue;
      }
      collectingScores = false;
      elements.push(
        <div key={i} className="mt-8 mb-4 first:mt-0">
          <h2 className="text-[0.95rem] font-bold text-white/80 tracking-[-0.01em]">{renderInline(headingText)}</h2>
          <div className="mt-1.5 h-px w-12" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>
      );
      continue;
    }

    // ### H3 subheading
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mt-5 mb-2 text-[0.88rem] font-semibold text-white/65">{renderInline(trimmed.slice(4))}</h3>
      );
      continue;
    }

    // Skip score lines if we already rendered the score card
    const isScoreLine = /^[-*]\s*.+?:\s*\d+\/100$/.test(trimmed);
    if (isScoreLine && collectingScores) continue;

    // Numbered list
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      const [, num, text] = numberedMatch;
      elements.push(
        <div key={i} className="flex gap-3 py-1 ml-0.5">
          <span className="text-[0.72rem] font-bold font-mono text-white/20 mt-[3px] w-5 shrink-0 text-right">{num}.</span>
          <span className="text-[0.8rem] leading-relaxed text-white/45">{renderInline(text)}</span>
        </div>
      );
      continue;
    }

    // Bullet
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const bulletText = trimmed.slice(2);
      elements.push(
        <div key={i} className="flex gap-2.5 py-1 ml-0.5">
          <div className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-white/15" />
          <span className="text-[0.8rem] leading-relaxed text-white/45">{renderInline(bulletText)}</span>
        </div>
      );
      continue;
    }

    // Regular paragraph
    elements.push(<p key={i} className="text-[0.8rem] leading-[1.7] text-white/40">{renderInline(trimmed)}</p>);
  }

  return <div>{elements}</div>;
}

/* ── Inline: **bold**, [link](url), `code` ── */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i} className="font-semibold text-white/70">{p.slice(2, -2)}</strong>;
    }
    if (p.startsWith("`") && p.endsWith("`")) {
      return <code key={i} className="rounded px-1.5 py-0.5 text-[0.72rem] font-mono text-white/50" style={{ background: "rgba(255,255,255,0.05)" }}>{p.slice(1, -1)}</code>;
    }
    const linkMatch = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
        className="font-medium underline underline-offset-2 decoration-blue-400/30 text-blue-400 hover:text-blue-300 transition-colors">{linkMatch[1]}</a>;
    }
    return p;
  });
}

