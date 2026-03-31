"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useAdminSession } from "./layout";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, Globe, Trash2, Eye, Users, Inbox, CalendarDays,
  Check, Clock, Send, ChevronDown, Mail, Copy, ExternalLink,
  Sparkles, TrendingUp, Search, X, ArrowRight, Zap, Activity,
  Phone, Calendar, Plus, Building2, MessageSquare, Target,
  PhoneCall, PhoneOff, PhoneMissed, MoreHorizontal, Edit3
} from "lucide-react";

/* ─── Animated Counter ─── */
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 800;
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

/* ─── Tab Config ─── */
const TABS = [
  { id: "overview", label: "Overview", icon: Sparkles },
  { id: "users", label: "Users", icon: Users },
  { id: "websites", label: "Websites", icon: Globe },
  { id: "inbox", label: "Inbox", icon: Inbox },
] as const;
type TabId = (typeof TABS)[number]["id"];

/* ─── Main ─── */
export default function AdminPage() {
  const { token, user } = useAdminSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Staff users cannot access the admin page — redirect them
  const userRole = user?.role || (user?.isAdmin ? "admin" : "client");
  if (userRole === "staff") {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-6" style={{ background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.15)" }}>
          <Users className="h-7 w-7" style={{ color: "#C94040" }} />
        </div>
        <h2 className="text-[1.3rem] font-bold text-white/80 mb-2">Not Authorized</h2>
        <p className="text-[0.85rem] text-white/30 mb-6 max-w-md">
          Staff accounts do not have access to the admin management panel. Use the Dashboard to view client websites or the CRM for call tracking.
        </p>
        <div className="flex gap-3">
          <a href="/dashboard" className="rounded-xl px-5 py-2.5 text-[0.82rem] font-semibold text-white/80 transition-all hover:brightness-110" style={{ background: "rgba(107,143,113,0.2)", border: "1px solid rgba(107,143,113,0.25)" }}>
            Go to Dashboard
          </a>
          <a href="/admin/crm" className="rounded-xl px-5 py-2.5 text-[0.82rem] font-semibold text-white/80 transition-all hover:brightness-110" style={{ background: "rgba(120,155,180,0.2)", border: "1px solid rgba(120,155,180,0.25)" }}>
            Go to CRM
          </a>
        </div>
      </div>
    );
  }

  const users = useQuery(api.users.listUsers, token ? { sessionToken: token } : "skip");
  const allWebsites = useQuery(api.websites.listAllWebsites, token ? { sessionToken: token } : "skip");
  const applications = useQuery(api.applications.list, token ? { sessionToken: token } : "skip");

  const createUserMut = useMutation(api.users.createUser);
  const addWebsiteMut = useMutation(api.websites.addWebsite);
  const deleteUserMut = useMutation(api.users.deleteUser);
  const deleteWebsiteMut = useMutation(api.websites.deleteWebsite);
  const updateStatusMut = useMutation(api.applications.updateStatus);
  const removeAppMut = useMutation(api.applications.remove);
  const updateUserRoleMut = useMutation(api.users.updateUserRole);

  const [newUser, setNewUser] = useState({ name: "", username: "", password: "" });
  const [newUserRole, setNewUserRole] = useState<string>("client");
  const [newUserPerms, setNewUserPerms] = useState<string[]>(["dashboard"]);
  const [newSite, setNewSite] = useState({ userId: "", name: "", url: "" });
  const [userMsg, setUserMsg] = useState("");
  const [siteMsg, setSiteMsg] = useState("");

  const ALL_PERMS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "crm", label: "CRM" },
    { id: "websites", label: "Websites" },
    { id: "inbox", label: "Inbox" },
    { id: "users", label: "Users" },
  ];

  const togglePerm = (perms: string[], perm: string) =>
    perms.includes(perm) ? perms.filter((p) => p !== perm) : [...perms, perm];

  const handleRoleChange = (role: string) => {
    setNewUserRole(role);
    if (role === "admin") setNewUserPerms(["dashboard","crm","websites","inbox","users"]);
    else if (role === "staff") setNewUserPerms(["dashboard","crm"]);
    else setNewUserPerms(["dashboard"]);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const result = await createUserMut({
      sessionToken: token, name: newUser.name,
      username: newUser.username, password: newUser.password,
      role: newUserRole, permissions: newUserPerms,
    });
    if (result.success) {
      setNewUser({ name: "", username: "", password: "" });
      setNewUserRole("client");
      setNewUserPerms(["dashboard"]);
      setUserMsg("User created!");
      setTimeout(() => setUserMsg(""), 3000);
    } else { setUserMsg(result.error || "Failed"); }
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newSite.userId) return;
    const result = await addWebsiteMut({
      sessionToken: token, userId: newSite.userId as Id<"users">,
      name: newSite.name, url: newSite.url,
    });
    if (result.success) {
      setNewSite({ userId: "", name: "", url: "" });
      setSiteMsg(`Website added! Tracking ID: ${result.trackingId}`);
      setTimeout(() => setSiteMsg(""), 5000);
    } else { setSiteMsg(result.error || "Failed"); }
  };

  const handleDeleteUser = async (userId: Id<"users">) => {
    if (!token || !confirm("Delete this user and all their data?")) return;
    await deleteUserMut({ sessionToken: token, userId });
  };

  const handleDeleteWebsite = async (websiteId: Id<"websites">) => {
    if (!token || !confirm("Delete this website and all its analytics?")) return;
    await deleteWebsiteMut({ sessionToken: token, websiteId });
  };

  const newCount = applications?.filter((a) => a.status === "new").length ?? 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="mb-8">
        <h1 className="text-[1.5rem] font-bold tracking-[-0.02em] text-white/90">Admin</h1>
        <p className="mt-1 text-[0.82rem] text-white/35">Manage users, websites, and inbox</p>
      </div>

      {/* ─── Stat Cards ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mb-8 grid gap-3 sm:grid-cols-3"
      >
        <StatCard icon={Users} label="Total Users" value={users?.length ?? 0} color="#6B8F71" />
        <StatCard icon={Globe} label="Websites" value={allWebsites?.length ?? 0} color="#789BB4" />
        <StatCard icon={Inbox} label="New Inquiries" value={newCount} color="#B49B78"
          badge={newCount > 0 ? `${newCount} new` : undefined} />
      </motion.div>

      <div className="mb-6">
        <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
          {TABS.filter((tab) => {
            if (tab.id === "users" && !user?.permissions?.includes("users")) return false;
            if (tab.id === "websites" && !user?.permissions?.includes("websites")) return false;
            if (tab.id === "inbox" && !user?.permissions?.includes("inbox")) return false;
            return true;
          }).map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-[0.78rem] font-semibold transition-all duration-200"
                style={{
                  color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                  background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.id === "inbox" && newCount > 0 && (
                  <span className="rounded-full px-1.5 py-0.5 text-[0.58rem] font-bold text-white/70" style={{ background: "rgba(180,155,120,0.2)" }}>
                    {newCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            <OverviewTab users={users} websites={allWebsites} applications={applications}
              newUser={newUser} setNewUser={setNewUser} newSite={newSite} setNewSite={setNewSite}
              userMsg={userMsg} siteMsg={siteMsg} handleCreateUser={handleCreateUser} handleAddWebsite={handleAddWebsite}
              newUserRole={newUserRole} newUserPerms={newUserPerms} setNewUserPerms={setNewUserPerms}
              handleRoleChange={handleRoleChange} togglePerm={togglePerm} ALL_PERMS={ALL_PERMS}
              currentUser={user} />
          </motion.div>
        )}
        {activeTab === "users" && user?.permissions?.includes("users") && (
          <motion.div key="users" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            <UsersTab users={users} handleDeleteUser={handleDeleteUser} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              token={token} updateUserRoleMut={updateUserRoleMut} ALL_PERMS={ALL_PERMS} togglePerm={togglePerm} currentUser={user} />
          </motion.div>
        )}
        {activeTab === "websites" && user?.permissions?.includes("websites") && (
          <motion.div key="websites" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            <WebsitesTab websites={allWebsites} handleDeleteWebsite={handleDeleteWebsite} />
          </motion.div>
        )}

        {activeTab === "inbox" && user?.permissions?.includes("inbox") && (
          <motion.div key="inbox" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
            <InboxTab applications={applications} token={token} updateStatusMut={updateStatusMut} removeAppMut={removeAppMut} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════ STAT CARD ═══════════════════════ */

function StatCard({ icon: Icon, label, value, color, badge }: {
  icon: any; label: string; value: number; color: string; badge?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200 hover:bg-white/[0.02]" style={{ background: "rgba(18,18,20,0.9)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${color}15`, border: `1px solid ${color}20` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-white/30">{label}</p>
        <p className="text-[1.15rem] font-bold tracking-tight text-white/80 leading-tight">
          <AnimatedNumber value={value} />
        </p>
      </div>
      {badge && <span className="rounded-lg px-2 py-0.5 text-[0.6rem] font-semibold" style={{ background: `${color}15`, color }}>{badge}</span>}
    </div>
  );
}

/* ═══════════════════════ PANEL ═══════════════════════ */

function GlassPanel({ children, className = "" }: { children: React.ReactNode; className?: string; accentColor?: string }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ background: "rgba(18,18,20,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}>
      {children}
    </div>
  );
}

function PanelHeader({ icon: Icon, title, subtitle, count, action }: {
  icon: any; title: string; subtitle?: string; accent?: string; count?: number; action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-white/30" />
        <div>
          <h2 className="text-[0.88rem] font-semibold text-white/80">{title}</h2>
          {subtitle && <p className="text-[0.7rem] text-white/30">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {count !== undefined && <span className="rounded-lg px-2.5 py-1 text-[0.7rem] font-bold text-white/30" style={{ background: "rgba(255,255,255,0.04)" }}>{count}</span>}
        {action}
      </div>
    </div>
  );
}

/* ═══════════════════════ INPUT ═══════════════════════ */

const inputClass =
  "w-full rounded-xl bg-white/[0.04] px-4 py-3 text-[0.85rem] font-medium text-white/90 outline-none transition-all duration-200 placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-1 focus:ring-white/10 border";
const inputBorder = "border-white/[0.06] focus:border-white/[0.12]";

/* ═══════════════════════ OVERVIEW TAB ═══════════════════════ */

function OverviewTab({ users, websites, applications, newUser, setNewUser, newSite, setNewSite, userMsg, siteMsg, handleCreateUser, handleAddWebsite, newUserRole, newUserPerms, setNewUserPerms, handleRoleChange, togglePerm, ALL_PERMS, currentUser }: any) {
  return (
    <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }} initial="hidden" animate="show">

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create User */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <GlassPanel>
            <PanelHeader icon={UserPlus} title="Create User" subtitle="Add a new account" />
            <div className="p-5">
              {userMsg && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-[0.8rem] font-semibold"
                  style={{ background: "rgba(107,143,113,0.1)", border: "1px solid rgba(107,143,113,0.15)", color: "#6B8F71" }}>
                  <Check className="h-4 w-4" /> {userMsg}
                </motion.div>
              )}
              <form onSubmit={handleCreateUser} className="space-y-3">
                <input className={`${inputClass} ${inputBorder}`} placeholder="Display Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                <input className={`${inputClass} ${inputBorder}`} placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
                <input className={`${inputClass} ${inputBorder}`} type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />

                {/* Role selector */}
                <div>
                  <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-white/30">Role</label>
                  <div className="flex gap-1.5">
                    {(["client", "staff", "admin"] as const).map((r) => {
                      const active = newUserRole === r;
                      const disabled = r === "admin" && currentUser?.username !== "admin";
                      return (
                        <button key={r} type="button" disabled={disabled}
                          onClick={() => handleRoleChange(r)}
                          className="flex-1 rounded-lg py-2 text-[0.75rem] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{
                            background: active ? "rgba(107,143,113,0.15)" : "rgba(255,255,255,0.03)",
                            color: active ? "#6B8F71" : "rgba(255,255,255,0.3)",
                            border: `1px solid ${active ? "rgba(107,143,113,0.25)" : "rgba(255,255,255,0.05)"}`,
                          }}>
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-white/30">Permissions</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_PERMS.map((p: any) => {
                      const active = newUserPerms.includes(p.id);
                      return (
                        <button key={p.id} type="button"
                          onClick={() => setNewUserPerms(togglePerm(newUserPerms, p.id))}
                          className="rounded-lg px-3 py-1.5 text-[0.72rem] font-medium transition-all"
                          style={{
                            background: active ? "rgba(120,155,180,0.12)" : "rgba(255,255,255,0.03)",
                            color: active ? "#789BB4" : "rgba(255,255,255,0.25)",
                            border: `1px solid ${active ? "rgba(120,155,180,0.2)" : "rgba(255,255,255,0.05)"}`,
                          }}>
                          {active ? "✓ " : ""}{p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[0.82rem] font-semibold text-white/90 transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ background: "rgba(107,143,113,0.2)", border: "1px solid rgba(107,143,113,0.25)" }}>
                  <UserPlus className="h-4 w-4" /> Create User
                </button>
              </form>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Add Website */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <GlassPanel>
            <PanelHeader icon={Globe} title="Add Website" subtitle="Assign a website to a client" />
            <div className="p-5">
              {siteMsg && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-[0.8rem] font-semibold"
                  style={{ background: "rgba(120,155,180,0.1)", border: "1px solid rgba(120,155,180,0.15)", color: "#789BB4" }}>
                  <Check className="h-4 w-4" /> {siteMsg}
                </motion.div>
              )}
              <form onSubmit={handleAddWebsite} className="space-y-3">
                <div className="relative">
                  <select className={`${inputClass} ${inputBorder} appearance-none pr-10`}
                    value={newSite.userId} onChange={(e) => setNewSite({ ...newSite, userId: e.target.value })} required>
                    <option value="">Select a user</option>
                    {users?.filter((u: any) => !u.isAdmin).map((u: any) => (
                      <option key={u._id} value={u._id}>{u.name} (@{u.username})</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                </div>
                <input className={`${inputClass} ${inputBorder}`} placeholder="Website Name" value={newSite.name} onChange={(e) => setNewSite({ ...newSite, name: e.target.value })} required />
                <input className={`${inputClass} ${inputBorder}`} placeholder="Website URL (https://...)" value={newSite.url} onChange={(e) => setNewSite({ ...newSite, url: e.target.value })} required />
                <button type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[0.82rem] font-semibold text-white/90 transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ background: "rgba(120,155,180,0.2)", border: "1px solid rgba(120,155,180,0.25)" }}>
                  <Globe className="h-4 w-4" /> Add Website
                </button>
              </form>
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mt-8">
        <GlassPanel>
          <PanelHeader icon={Zap} title="Recent Activity" subtitle="Latest inbox submissions" count={applications?.length ?? 0} />
          <div className="divide-y divide-white/[0.04]">
            {applications && applications.length > 0 ? (
              applications.slice(0, 5).map((app: any) => (
                <div key={app._id} className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-white/[0.015]">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[0.6rem] font-bold text-white/70"
                    style={{
                      background: app.status === "new" ? "rgba(180,155,120,0.15)" : app.status === "contacted" ? "rgba(120,155,180,0.15)" : "rgba(140,140,140,0.1)",
                      border: `1px solid ${app.status === "new" ? "rgba(180,155,120,0.2)" : app.status === "contacted" ? "rgba(120,155,180,0.2)" : "rgba(140,140,140,0.12)"}`,
                    }}>
                    {app.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.82rem] font-semibold text-white/85">{app.firstName} {app.lastName}</span>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="mt-0.5 truncate text-[0.72rem] text-white/25">
                      {app.email} {app.businessName && `· ${app.businessName}`}
                    </p>
                  </div>
                  <p className="shrink-0 text-[0.65rem] font-medium text-white/20">
                    {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState text="No submissions yet" />
            )}
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════ USERS TAB ═══════════════════════ */

function UsersTab({ users, handleDeleteUser, searchQuery, setSearchQuery, token, updateUserRoleMut, ALL_PERMS, togglePerm, currentUser }: any) {
  const filtered = users?.filter((u: any) => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase()));
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");
  const [editPerms, setEditPerms] = useState<string[]>([]);
  const [editMsg, setEditMsg] = useState("");

  const startEdit = (u: any) => {
    setEditingUser(u._id);
    setEditRole(u.role || (u.isAdmin ? "admin" : "client"));
    setEditPerms(u.permissions || (u.isAdmin ? ["dashboard","crm","websites","inbox","users"] : ["dashboard"]));
    setEditMsg("");
  };

  const saveEdit = async (userId: string) => {
    if (!token) return;
    const result = await updateUserRoleMut({ sessionToken: token, userId, role: editRole, permissions: editPerms });
    if (result.success) {
      setEditMsg("Saved!");
      setTimeout(() => { setEditMsg(""); setEditingUser(null); }, 1500);
    } else {
      setEditMsg(result.error || "Failed");
    }
  };

  const roleColors: Record<string, { bg: string; color: string }> = {
    admin: { bg: "rgba(107,143,113,0.12)", color: "#6B8F71" },
    staff: { bg: "rgba(120,155,180,0.12)", color: "#789BB4" },
    client: { bg: "rgba(180,155,120,0.12)", color: "#B49B78" },
  };

  return (
    <GlassPanel>
      <PanelHeader icon={Users} title="All Users" subtitle="Manage accounts & permissions" count={users?.length ?? 0} />
      <div className="px-6 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/20" />
          <input className={`${inputClass} ${inputBorder} pl-9 !py-2 text-[0.78rem]`} placeholder="Search users..." value={searchQuery} onChange={(e: any) => setSearchQuery(e.target.value)} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {filtered && filtered.length > 0 ? (
          filtered.map((u: any) => {
            const role = u.role || (u.isAdmin ? "admin" : "client");
            const perms: string[] = u.permissions || (u.isAdmin ? ["dashboard","crm","websites","inbox","users"] : ["dashboard"]);
            const rc = roleColors[role] || roleColors.client;
            const isEditing = editingUser === u._id;
            const isPrimary = u.username === "admin";

            return (
              <div key={u._id} className="px-6 py-4 transition-colors hover:bg-white/[0.015]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-[0.65rem] font-bold text-white/60"
                      style={{ background: rc.bg, border: `1px solid ${rc.color}30` }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[0.85rem] font-semibold text-white/85">{u.name}</span>
                        <span className="rounded px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase" style={{ background: rc.bg, color: rc.color }}>
                          {role}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-[0.72rem] text-white/25">@{u.username}</span>
                        <span className="text-[0.6rem] text-white/15">
                          {perms.join(" · ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!isPrimary && (
                      <button onClick={() => isEditing ? setEditingUser(null) : startEdit(u)}
                        className="rounded-lg p-2 text-white/20 transition-all hover:bg-white/[0.04] hover:text-white/50"
                        title="Edit permissions">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {!isPrimary && !u.isAdmin && (
                      <button onClick={() => handleDeleteUser(u._id as Id<"users">)}
                        className="rounded-lg p-2 text-white/10 transition-all hover:bg-white/[0.04] hover:text-red-400/70">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline edit panel */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      <div className="mt-3 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        {editMsg && (
                          <div className="mb-3 rounded-lg px-3 py-2 text-[0.75rem] font-semibold" style={{ background: "rgba(107,143,113,0.1)", color: "#6B8F71" }}>
                            {editMsg}
                          </div>
                        )}
                        {/* Role */}
                        <div className="mb-3">
                          <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-white/25">Role</label>
                          <div className="flex gap-1.5">
                            {(["client", "staff", "admin"] as const).map((r) => {
                              const active = editRole === r;
                              const disabled = r === "admin" && currentUser?.username !== "admin";
                              return (
                                <button key={r} disabled={disabled}
                                  onClick={() => setEditRole(r)}
                                  className="flex-1 rounded-lg py-1.5 text-[0.72rem] font-semibold transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                                  style={{
                                    background: active ? "rgba(107,143,113,0.15)" : "rgba(255,255,255,0.03)",
                                    color: active ? "#6B8F71" : "rgba(255,255,255,0.3)",
                                    border: `1px solid ${active ? "rgba(107,143,113,0.25)" : "rgba(255,255,255,0.05)"}`,
                                  }}>
                                  {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        {/* Permissions */}
                        <div className="mb-3">
                          <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-white/25">Permissions</label>
                          <div className="flex flex-wrap gap-1.5">
                            {ALL_PERMS.map((p: any) => {
                              const active = editPerms.includes(p.id);
                              return (
                                <button key={p.id}
                                  onClick={() => setEditPerms(togglePerm(editPerms, p.id))}
                                  className="rounded-lg px-2.5 py-1 text-[0.68rem] font-medium transition-all"
                                  style={{
                                    background: active ? "rgba(120,155,180,0.12)" : "rgba(255,255,255,0.03)",
                                    color: active ? "#789BB4" : "rgba(255,255,255,0.2)",
                                    border: `1px solid ${active ? "rgba(120,155,180,0.2)" : "rgba(255,255,255,0.04)"}`,
                                  }}>
                                  {active ? "✓ " : ""}{p.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(u._id)}
                            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[0.75rem] font-semibold text-white/90 transition-all hover:brightness-110"
                            style={{ background: "rgba(107,143,113,0.2)", border: "1px solid rgba(107,143,113,0.25)" }}>
                            <Check className="h-3 w-3" /> Save
                          </button>
                          <button onClick={() => setEditingUser(null)}
                            className="rounded-lg px-4 py-2 text-[0.75rem] font-medium text-white/30 transition-all hover:text-white/50">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <EmptyState text={searchQuery ? "No matching users" : "No users yet"} />
        )}
      </div>
    </GlassPanel>
  );
}

/* ═══════════════════════ WEBSITES TAB ═══════════════════════ */

function WebsitesTab({ websites, handleDeleteWebsite }: { websites: any; handleDeleteWebsite: (id: Id<"websites">) => void; }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTrackingId = (trackingId: string) => { navigator.clipboard.writeText(trackingId); setCopiedId(trackingId); setTimeout(() => setCopiedId(null), 2000); };

  return (
    <GlassPanel>
      <PanelHeader icon={Globe} title="All Websites" subtitle="Manage tracked websites" count={websites?.length ?? 0} />
      <div className="divide-y divide-white/[0.04]">
        {websites && websites.length > 0 ? (
          websites.map((w: any) => (
            <div key={w._id} className="group flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-white/[0.015]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(120,155,180,0.12)", border: "1px solid rgba(120,155,180,0.18)" }}>
                  <Globe className="h-4 w-4" style={{ color: "#789BB4" }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.85rem] font-semibold text-white/85">{w.name}</span>
                    <span className="rounded px-1.5 py-0.5 text-[0.58rem] font-semibold" style={{ background: "rgba(107,143,113,0.1)", color: "#6B8F71" }}>{w.ownerName}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[0.72rem] text-white/25">{w.url}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <code className="text-[0.6rem] font-mono text-white/15">{w.trackingId}</code>
                    <button onClick={() => copyTrackingId(w.trackingId)} className="rounded p-0.5 text-white/15 transition-colors hover:text-white/40" title="Copy tracking ID">
                      {copiedId === w.trackingId ? <Check className="h-2.5 w-2.5 text-[#6B8F71]" /> : <Copy className="h-2.5 w-2.5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <a href={`/dashboard/site/${w._id}`} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[0.7rem] font-medium text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/60" title="View analytics">
                  <Eye className="h-3.5 w-3.5" /> <span className="hidden lg:inline">View</span>
                </a>
                <a href={w.url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/50" title="Visit website">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button onClick={() => handleDeleteWebsite(w._id as Id<"websites">)} className="rounded-lg p-1.5 text-white/10 transition-all hover:bg-white/[0.04] hover:text-red-400/70" title="Delete website">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState text="No websites yet" />
        )}
      </div>
    </GlassPanel>
  );
}

/* ═══════════════════════ INBOX TAB ═══════════════════════ */

function InboxTab({ applications, token, updateStatusMut, removeAppMut }: { applications: any; token: string | null; updateStatusMut: any; removeAppMut: any; }) {
  const [filter, setFilter] = useState<string>("all");
  const filtered = applications?.filter((a: any) => filter === "all" || a.status === filter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {["all", "new", "contacted", "closed"].map((f) => {
          const active = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className="rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold transition-all"
              style={{ background: active ? "rgba(255,255,255,0.08)" : "transparent", color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", border: `1px solid ${active ? "rgba(255,255,255,0.1)" : "transparent"}` }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "new" && applications && (
                <span className="ml-1 text-[0.6rem] opacity-60">({applications.filter((a: any) => a.status === "new").length})</span>
              )}
            </button>
          );
        })}
      </div>

      <GlassPanel>
        <PanelHeader icon={Inbox} title="Inbox" subtitle="Client submissions & bookings" count={filtered?.length ?? 0} />
        <div className="divide-y divide-white/[0.04]">
          {filtered && filtered.length > 0 ? (
            filtered.map((app: any) => (
              <InboxItem key={app._id} app={app} token={token} updateStatusMut={updateStatusMut} removeAppMut={removeAppMut} />
            ))
          ) : (
            <EmptyState text="No submissions match this filter" />
          )}
        </div>
      </GlassPanel>
    </div>
  );
}

/* ═══════════════════════ STATUS BADGE ═══════════════════════ */

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; color: string; icon: any; border: string }> = {
    new: { bg: "rgba(180,155,120,0.12)", color: "#B49B78", icon: Clock, border: "rgba(180,155,120,0.2)" },
    contacted: { bg: "rgba(120,155,180,0.12)", color: "#789BB4", icon: Check, border: "rgba(120,155,180,0.2)" },
    closed: { bg: "rgba(140,140,140,0.08)", color: "#6A6A6A", icon: Check, border: "rgba(140,140,140,0.12)" },
    converted: { bg: "rgba(107,143,113,0.12)", color: "#6B8F71", icon: Sparkles, border: "rgba(107,143,113,0.2)" },
  };
  const c = config[status] || config.new;
  const Icon = c.icon;
  return (
    <span className="flex items-center gap-1 rounded px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.03em]"
      style={{ backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      <Icon className="h-2.5 w-2.5" /> {status}
    </span>
  );
}

/* ═══════════════════════ INBOX ITEM ═══════════════════════ */

const PRESET_EMAILS = [
  { label: "Thanks for reaching out", subject: "Thanks for reaching out — 6POINT Solutions", body: "Thanks for your interest in working with us! We've received your submission and our team is reviewing it now.\n\nWe'll follow up shortly with next steps. In the meantime, feel free to reply to this email if you have any questions." },
  { label: "Let's schedule a call", subject: "Let's set up a call — 6POINT Solutions", body: "We'd love to learn more about your business and goals. Are you available this week for a quick 15–30 minute call?\n\nJust reply with a couple of times that work for you and we'll get it on the calendar." },
  { label: "Send a quote / proposal", subject: "Your custom proposal — 6POINT Solutions", body: "Thanks for sharing more about your project. Based on what you've told us, we've put together a plan that we think will be a great fit.\n\nWe'd love to walk you through it on a quick call. When works best for you?" },
  { label: "Follow up", subject: "Just checking in — 6POINT Solutions", body: "Hey! Just wanted to follow up on our last conversation. We're still excited about the opportunity to work together.\n\nLet us know if you have any questions or if you're ready to get started. We're here whenever you're ready." },
  { label: "Welcome aboard", subject: "Welcome to 6POINT! 🎉", body: "We're thrilled to officially welcome you as a 6POINT client! Our team is already getting things set up and we'll have your onboarding details ready soon.\n\nExpect to hear from us within the next 24–48 hours with your project timeline and next steps." },
];

function InboxItem({ app, token, updateStatusMut, removeAppMut }: { app: any; token: string | null; updateStatusMut: any; removeAppMut: any; }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const loadPreset = (preset: (typeof PRESET_EMAILS)[0]) => { setSubject(preset.subject); setBody(preset.body); setPresetOpen(false); };

  const handleSend = async () => {
    if (!subject || !body) return;
    setSending(true);
    try {
      const res = await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: app.email, subject, body, firstName: app.firstName }) });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        if (token && app.status === "new") await updateStatusMut({ sessionToken: token, applicationId: app._id, status: "contacted" });
        setTimeout(() => { setSent(false); setReplyOpen(false); setSubject(""); setBody(""); }, 2000);
      }
    } catch { alert("Failed to send email"); }
    setSending(false);
  };

  return (
    <div className="group px-6 py-4 transition-colors hover:bg-white/[0.015]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[0.6rem] font-bold text-white/60"
            style={{
              background: app.status === "new" ? "rgba(180,155,120,0.15)" : app.status === "contacted" ? "rgba(120,155,180,0.15)" : "rgba(140,140,140,0.1)",
              border: `1px solid ${app.status === "new" ? "rgba(180,155,120,0.2)" : app.status === "contacted" ? "rgba(120,155,180,0.2)" : "rgba(140,140,140,0.12)"}`,
            }}>
            {app.firstName?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[0.85rem] font-semibold text-white/85">{app.firstName} {app.lastName}</span>
              <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase"
                style={{
                  backgroundColor: app.type === "booking" ? "rgba(155,130,175,0.12)" : "rgba(107,143,113,0.12)",
                  color: app.type === "booking" ? "#9B82AF" : "#6B8F71",
                  border: `1px solid ${app.type === "booking" ? "rgba(155,130,175,0.2)" : "rgba(107,143,113,0.2)"}`,
                }}>
                {app.type === "booking" ? <><CalendarDays className="h-2.5 w-2.5" /> Booking</> : <><Inbox className="h-2.5 w-2.5" /> Application</>}
              </span>
              <StatusBadge status={app.status} />
            </div>
            <p className="mt-0.5 text-[0.75rem] text-white/30">{app.email}{app.phone && <> · {app.phone}</>}{app.businessName && <> · {app.businessName}</>}</p>
            {app.packageTier && app.packageTier !== "none" && (
              <p className="mt-1 flex items-center gap-1 text-[0.72rem] font-semibold" style={{ color: "#6B8F71" }}>
                <ArrowRight className="h-3 w-3" /> {app.packageTier.charAt(0).toUpperCase() + app.packageTier.slice(1)} Package
              </p>
            )}
            {app.services && app.services.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {app.services.map((s: string) => (
                  <span key={s} className="rounded px-2 py-0.5 text-[0.65rem] font-medium text-white/40" style={{ background: "rgba(255,255,255,0.04)" }}>{s}</span>
                ))}
              </div>
            )}
            {app.details && (
              <p className="mt-2 rounded-lg px-3 py-2 text-[0.75rem] leading-relaxed text-white/35 italic" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                &ldquo;{app.details}&rdquo;
              </p>
            )}
            <p className="mt-1.5 text-[0.65rem] font-medium text-white/18">
              {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button onClick={() => setReplyOpen(!replyOpen)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.7rem] font-semibold transition-all"
            style={{ color: replyOpen ? "#B47878" : "rgba(255,255,255,0.4)", backgroundColor: replyOpen ? "rgba(180,120,120,0.1)" : "transparent" }}>
            <Mail className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{replyOpen ? "Close" : "Reply"}</span>
          </button>
          {app.status === "new" && (
            <button onClick={async () => { if (token) await updateStatusMut({ sessionToken: token, applicationId: app._id as any, status: "contacted" }); }}
              className="rounded-lg p-1.5 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/60" title="Mark contacted">
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
          {app.status === "contacted" && (
            <button onClick={async () => { if (token) await updateStatusMut({ sessionToken: token, applicationId: app._id as any, status: "closed" }); }}
              className="rounded-lg p-1.5 text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/60" title="Mark closed">
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={async () => { if (token && confirm("Delete this submission?")) await removeAppMut({ sessionToken: token, applicationId: app._id as any }); }}
            className="rounded-lg p-1.5 text-white/10 opacity-0 transition-all hover:bg-white/[0.04] hover:text-red-400/70 group-hover:opacity-100" title="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {replyOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="mt-3 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {sent ? (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center gap-2 py-4 justify-center text-[0.82rem] font-semibold text-[#6B8F71]">
                  <Check className="h-4 w-4" /> Email sent to {app.email}!
                </motion.div>
              ) : (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[0.72rem] text-white/30">Replying to <span className="text-white/60">{app.email}</span></p>
                    <div className="relative">
                      <button onClick={() => setPresetOpen(!presetOpen)}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold transition-all"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        Templates <ChevronDown className="h-3 w-3" style={{ transform: presetOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      </button>
                      <AnimatePresence>
                        {presetOpen && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                            className="absolute right-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-lg py-1"
                            style={{ background: "#1A1A1E", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                            {PRESET_EMAILS.map((preset, i) => (
                              <button key={i} onClick={() => loadPreset(preset)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[0.75rem] font-medium text-white/40 transition-all hover:bg-white/[0.04] hover:text-white/70">
                                <Mail className="h-3 w-3 shrink-0 text-white/20" /> {preset.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <input className={`${inputClass} ${inputBorder}`} placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                    <textarea className={`${inputClass} ${inputBorder} resize-none`} rows={4} placeholder="Write your message..." value={body} onChange={(e) => setBody(e.target.value)} />
                    <button onClick={handleSend} disabled={sending || !subject || !body}
                      className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.8rem] font-semibold text-white/90 transition-all hover:brightness-110 disabled:opacity-30"
                      style={{ background: "rgba(107,143,113,0.2)", border: "1px solid rgba(107,143,113,0.25)" }}>
                      {sending ? (<><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" /> Sending...</>) : (<><Send className="h-3.5 w-3.5" /> Send Email</>)}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════ EMPTY STATE ═══════════════════════ */

function EmptyState({ text }: { text: string; accent?: string }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <Inbox className="mb-2 h-7 w-7 text-white/10" />
      <p className="text-[0.82rem] text-white/25">{text}</p>
    </div>
  );
}
