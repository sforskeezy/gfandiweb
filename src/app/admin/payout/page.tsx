"use client";

import { useState } from "react";
import { useAdminSession } from "../layout";
import { motion, AnimatePresence } from "motion/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  DollarSign, TrendingUp, Clock, CheckCircle2, Plus, X,
  ChevronDown, Wallet, ArrowUpRight, Banknote, Sparkles,
} from "lucide-react";

type Commission = {
  _id: string;
  username: string;
  amount: number;
  description: string;
  status: string;
  createdAt: number;
  paidAt?: number;
  createdBy: string;
};

export default function PayoutPage() {
  const { user } = useAdminSession();
  const username = user?.username || "";
  const isAdmin = user?.role === "admin" || user?.isAdmin;

  // All commissions for admin; own commissions for staff
  const allCommissions = (useQuery(api.commissions.list, isAdmin ? {} : { username }) || []) as Commission[];
  const myCommissions = isAdmin ? allCommissions : allCommissions.filter((c) => c.username === username);

  const addCommission = useMutation(api.commissions.add);
  const markPaid = useMutation(api.commissions.markPaid);
  const removeCommission = useMutation(api.commissions.remove);

  // Staff users for admin dropdown
  const staffUsers = useQuery(api.crm.listStaffUsers) || [];

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", amount: "", description: "" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.amount) return;
    await addCommission({
      username: form.username,
      amount: parseFloat(form.amount),
      description: form.description,
      createdBy: username,
    });
    setForm({ username: "", amount: "", description: "" });
    setShowForm(false);
  };

  // Stats
  const totalEarned = myCommissions.reduce((s, c) => s + c.amount, 0);
  const totalPaid = myCommissions.filter((c) => c.status === "paid").reduce((s, c) => s + c.amount, 0);
  const totalPending = myCommissions.filter((c) => c.status === "pending").reduce((s, c) => s + c.amount, 0);
  const commissionCount = myCommissions.length;

  const inputCls = "w-full rounded-xl bg-white/[0.04] px-4 py-3 text-[0.85rem] font-medium text-white/90 outline-none transition-all duration-200 placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-1 focus:ring-white/10 border border-white/[0.06] focus:border-white/[0.12]";

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[1.5rem] font-bold tracking-[-0.02em] text-white/90">Payouts</h1>
          <p className="mt-1 text-[0.82rem] text-white/35">
            {isAdmin ? "Manage commissions for your team" : "Track your earnings and payouts"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.82rem] font-semibold text-white/90 transition-all hover:brightness-110 active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, rgba(93,139,104,0.3), rgba(93,139,104,0.15))", border: "1px solid rgba(93,139,104,0.25)" }}
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add Commission"}
          </button>
        )}
      </div>

      {/* Admin: Add commission form */}
      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 overflow-hidden">
            <div className="rounded-2xl p-5" style={{ background: "rgba(18,18,20,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-3">
                <div className="relative">
                  <select
                    className={`${inputCls} appearance-none pr-10`}
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  >
                    <option value="">Select user *</option>
                    {staffUsers.map((u) => (
                      <option key={u.username} value={u.username}>{u.name} (@{u.username})</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[0.85rem] font-bold text-white/25">$</span>
                  <input
                    className={`${inputCls} pl-8`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Amount *"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
                <input
                  className={inputCls}
                  placeholder="Description (e.g. March commission)"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <button
                  type="submit"
                  className="sm:col-span-3 flex items-center justify-center gap-2 rounded-xl py-3 text-[0.82rem] font-semibold text-white/90 transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ background: "rgba(93,139,104,0.2)", border: "1px solid rgba(93,139,104,0.25)" }}
                >
                  <DollarSign className="h-4 w-4" /> Submit Commission
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Earned", value: totalEarned, icon: TrendingUp, color: "#8AB695", bg: "rgba(93,139,104,0.1)" },
          { label: "Paid Out", value: totalPaid, icon: CheckCircle2, color: "#6B8F71", bg: "rgba(107,143,113,0.1)" },
          { label: "Pending", value: totalPending, icon: Clock, color: "#B49B78", bg: "rgba(180,155,120,0.1)" },
          { label: "Commissions", value: commissionCount, icon: Sparkles, color: "#789BB4", bg: "rgba(120,155,180,0.1)", isCurrency: false },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl p-4 sm:p-5"
              style={{ background: "rgba(18,18,20,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full" style={{ background: stat.bg }} />
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: stat.bg }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: stat.color }} />
                </div>
                <span className="text-[0.68rem] font-medium text-white/30 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-[1.3rem] sm:text-[1.6rem] font-bold tracking-[-0.02em] text-white/90">
                {stat.isCurrency === false ? stat.value : `$${stat.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Commission List */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(18,18,20,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3">
            <Wallet className="h-4 w-4 text-white/30" />
            <h3 className="text-[0.88rem] font-semibold text-white/80">Commission History</h3>
          </div>
          <span className="rounded-lg px-2.5 py-1 text-[0.7rem] font-bold text-white/30" style={{ background: "rgba(255,255,255,0.04)" }}>
            {myCommissions.length}
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {myCommissions.length > 0 ? myCommissions.map((c, i) => {
            const isPaid = c.status === "paid";
            return (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.015]"
              >
                {/* Icon */}
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: isPaid ? "rgba(107,143,113,0.12)" : "rgba(180,155,120,0.12)",
                    border: `1px solid ${isPaid ? "rgba(107,143,113,0.2)" : "rgba(180,155,120,0.2)"}`,
                  }}
                >
                  {isPaid ? <CheckCircle2 className="h-5 w-5" style={{ color: "#6B8F71" }} /> : <Banknote className="h-5 w-5" style={{ color: "#B49B78" }} />}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.9rem] font-bold text-white/90">
                      ${c.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide"
                      style={{
                        background: isPaid ? "rgba(107,143,113,0.15)" : "rgba(180,155,120,0.15)",
                        color: isPaid ? "#6B8F71" : "#B49B78",
                        border: `1px solid ${isPaid ? "rgba(107,143,113,0.2)" : "rgba(180,155,120,0.2)"}`,
                      }}
                    >
                      {isPaid ? "Paid" : "Pending"}
                    </span>
                    {isAdmin && (
                      <span className="rounded px-1.5 py-0.5 text-[0.58rem] font-semibold text-white/25" style={{ background: "rgba(255,255,255,0.04)" }}>
                        @{c.username}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-[0.72rem] text-white/25">
                    {c.description && <span>{c.description}</span>}
                    <span>{new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    {isPaid && c.paidAt && (
                      <span className="flex items-center gap-1 text-[#6B8F71]">
                        <ArrowUpRight className="h-3 w-3" /> Paid {new Date(c.paidAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                    <span className="text-white/15">by @{c.createdBy}</span>
                  </div>
                </div>

                {/* Admin actions */}
                {isAdmin && (
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isPaid && (
                      <button
                        onClick={() => markPaid({ id: c._id as any })}
                        className="rounded-lg px-3 py-1.5 text-[0.7rem] font-semibold transition-all hover:brightness-125"
                        style={{ background: "rgba(107,143,113,0.15)", color: "#6B8F71", border: "1px solid rgba(107,143,113,0.2)" }}
                      >
                        Mark Paid
                      </button>
                    )}
                    <button
                      onClick={() => { if (confirm("Delete this commission?")) removeCommission({ id: c._id as any }); }}
                      className="rounded-lg p-1.5 text-white/10 transition-all hover:bg-white/[0.04] hover:text-red-400/70"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          }) : (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "rgba(93,139,104,0.08)", border: "1px solid rgba(93,139,104,0.12)" }}>
                <Wallet className="h-7 w-7 text-white/15" />
              </div>
              <p className="text-[0.88rem] font-semibold text-white/30">No commissions yet</p>
              <p className="mt-1 text-[0.75rem] text-white/15">
                {isAdmin ? "Submit a commission for a team member above" : "Your commissions will appear here when assigned"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
