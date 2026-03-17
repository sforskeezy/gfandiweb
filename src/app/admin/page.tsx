"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useAdminSession } from "./layout";
import { UserPlus, Globe, Trash2, Eye, Users, Inbox, CalendarDays, Check, Clock, Send, ChevronDown, Mail } from "lucide-react";

export default function AdminPage() {
  const { token } = useAdminSession();

  const users = useQuery(api.users.listUsers, token ? { sessionToken: token } : "skip");
  const allWebsites = useQuery(api.websites.listAllWebsites, token ? { sessionToken: token } : "skip");
  const applications = useQuery(api.applications.list, token ? { sessionToken: token } : "skip");

  const createUserMut = useMutation(api.users.createUser);
  const addWebsiteMut = useMutation(api.websites.addWebsite);
  const deleteUserMut = useMutation(api.users.deleteUser);
  const deleteWebsiteMut = useMutation(api.websites.deleteWebsite);
  const updateStatusMut = useMutation(api.applications.updateStatus);
  const removeAppMut = useMutation(api.applications.remove);

  const [newUser, setNewUser] = useState({ name: "", username: "", password: "" });
  const [newSite, setNewSite] = useState({ userId: "", name: "", url: "" });
  const [userMsg, setUserMsg] = useState("");
  const [siteMsg, setSiteMsg] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const result = await createUserMut({
      sessionToken: token,
      name: newUser.name,
      username: newUser.username,
      password: newUser.password,
    });
    if (result.success) {
      setNewUser({ name: "", username: "", password: "" });
      setUserMsg("User created!");
      setTimeout(() => setUserMsg(""), 3000);
    } else {
      setUserMsg(result.error || "Failed");
    }
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newSite.userId) return;
    const result = await addWebsiteMut({
      sessionToken: token,
      userId: newSite.userId as Id<"users">,
      name: newSite.name,
      url: newSite.url,
    });
    if (result.success) {
      setNewSite({ userId: "", name: "", url: "" });
      setSiteMsg(`Website added! Tracking ID: ${result.trackingId}`);
      setTimeout(() => setSiteMsg(""), 5000);
    } else {
      setSiteMsg(result.error || "Failed");
    }
  };

  const handleDeleteUser = async (userId: Id<"users">) => {
    if (!token || !confirm("Delete this user and all their data?")) return;
    await deleteUserMut({ sessionToken: token, userId });
  };

  const handleDeleteWebsite = async (websiteId: Id<"websites">) => {
    if (!token || !confirm("Delete this website and all its analytics?")) return;
    await deleteWebsiteMut({ sessionToken: token, websiteId });
  };

  const inputClass =
    "w-full rounded-2xl border-2 border-[#222] bg-[#111] px-5 py-3.5 text-[0.85rem] font-medium text-[#E0E0E0] outline-none transition-all placeholder:font-normal placeholder:text-[#444] focus:border-[#7B8C6F] focus:bg-[#141414] focus:shadow-[0_0_0_4px_rgba(123,140,111,0.08)]";

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#7B8C6F]" />
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#555]">
            Administration
          </p>
        </div>
        <h1 className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold tracking-[-0.04em] text-[#F0F0F0]">
          Admin Panel
        </h1>
        <p className="mt-2 text-[0.88rem] text-[#555]">
          Manage users and websites from one place.
        </p>
      </div>

      {/* Quick stats */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-3.5"
          style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(123,140,111,0.12)" }}>
            <Users className="h-4 w-4 text-[#9AAF8C]" />
          </div>
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#444]">Users</p>
            <p className="text-[1.1rem] font-bold text-[#F0F0F0]">{users?.length ?? 0}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-3.5"
          style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(92,122,138,0.12)" }}>
            <Globe className="h-4 w-4 text-[#7BA0B4]" />
          </div>
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#444]">Websites</p>
            <p className="text-[1.1rem] font-bold text-[#F0F0F0]">{allWebsites?.length ?? 0}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-3.5"
          style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(232,167,130,0.12)" }}>
            <Inbox className="h-4 w-4 text-[#E8A782]" />
          </div>
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#444]">Inbox</p>
            <p className="text-[1.1rem] font-bold text-[#F0F0F0]">
              {applications?.filter((a) => a.status === "new").length ?? 0}
              <span className="ml-1 text-[0.65rem] font-medium text-[#555]">new</span>
            </p>
          </div>
        </div>
      </div>

      {/* Forms */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create User */}
        <div
          className="overflow-hidden rounded-[24px]"
          style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px]" style={{ backgroundColor: "rgba(123,140,111,0.12)" }}>
              <UserPlus className="h-[18px] w-[18px] text-[#9AAF8C]" />
            </div>
            <div>
              <h2 className="text-[0.95rem] font-bold text-[#E0E0E0]">Create User</h2>
              <p className="text-[0.7rem] text-[#444]">Add a new client account</p>
            </div>
          </div>

          <div className="p-6">
            {userMsg && (
              <div className="mb-5 rounded-2xl px-4 py-3 text-[0.8rem] font-semibold" style={{ backgroundColor: "rgba(123,140,111,0.1)", color: "#9AAF8C" }}>
                {userMsg}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <input className={inputClass} placeholder="Display Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
              <input className={inputClass} placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
              <input className={inputClass} type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
              <button
                type="submit"
                className="w-full rounded-2xl py-3.5 text-[0.85rem] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #7B8C6F, #6A7A5F)", boxShadow: "0 4px 20px rgba(123,140,111,0.3)" }}
              >
                Create User
              </button>
            </form>
          </div>
        </div>

        {/* Add Website */}
        <div
          className="overflow-hidden rounded-[24px]"
          style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px]" style={{ backgroundColor: "rgba(92,122,138,0.12)" }}>
              <Globe className="h-[18px] w-[18px] text-[#7BA0B4]" />
            </div>
            <div>
              <h2 className="text-[0.95rem] font-bold text-[#E0E0E0]">Add Website</h2>
              <p className="text-[0.7rem] text-[#444]">Assign a website to a client</p>
            </div>
          </div>

          <div className="p-6">
            {siteMsg && (
              <div className="mb-5 rounded-2xl px-4 py-3 text-[0.8rem] font-semibold" style={{ backgroundColor: "rgba(92,122,138,0.1)", color: "#7BA0B4" }}>
                {siteMsg}
              </div>
            )}

            <form onSubmit={handleAddWebsite} className="space-y-4">
              <select className={inputClass} value={newSite.userId} onChange={(e) => setNewSite({ ...newSite, userId: e.target.value })} required>
                <option value="">Select a user</option>
                {users?.filter((u) => !u.isAdmin).map((u) => (
                  <option key={u._id} value={u._id}>{u.name} (@{u.username})</option>
                ))}
              </select>
              <input className={inputClass} placeholder="Website Name" value={newSite.name} onChange={(e) => setNewSite({ ...newSite, name: e.target.value })} required />
              <input className={inputClass} placeholder="Website URL (https://...)" value={newSite.url} onChange={(e) => setNewSite({ ...newSite, url: e.target.value })} required />
              <button
                type="submit"
                className="w-full rounded-2xl py-3.5 text-[0.85rem] font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #5C7A8A, #4a6878)", boxShadow: "0 4px 20px rgba(92,122,138,0.3)" }}
              >
                Add Website
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Users list */}
      <div
        className="mt-8 overflow-hidden rounded-[24px]"
        style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(123,140,111,0.12)" }}>
            <Users className="h-4 w-4 text-[#9AAF8C]" />
          </div>
          <h2 className="text-[0.9rem] font-bold text-[#E0E0E0]">All Users</h2>
          <span className="ml-auto rounded-lg px-2.5 py-1 text-[0.68rem] font-bold text-[#555]" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            {users?.length ?? 0}
          </span>
        </div>
        <div className="p-3">
          {users && users.length > 0 ? (
            <div className="space-y-1">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between rounded-2xl px-5 py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[0.65rem] font-bold text-white"
                      style={{ background: u.isAdmin ? "linear-gradient(135deg, #9AAF8C, #7B8C6F)" : "linear-gradient(135deg, #555, #444)" }}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[0.88rem] font-semibold text-[#E0E0E0]">{u.name}</span>
                        {u.isAdmin && (
                          <span className="rounded-md px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.04em]" style={{ backgroundColor: "rgba(123,140,111,0.12)", color: "#9AAF8C" }}>
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[0.75rem] text-[#555]">@{u.username}</span>
                    </div>
                  </div>
                  {!u.isAdmin && (
                    <button
                      onClick={() => handleDeleteUser(u._id as Id<"users">)}
                      className="rounded-xl p-2.5 text-[#444] transition-all hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-[0.85rem] text-[#444]">No users yet</p>
          )}
        </div>
      </div>

      {/* Websites list */}
      <div
        className="mt-6 overflow-hidden rounded-[24px]"
        style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(92,122,138,0.12)" }}>
            <Globe className="h-4 w-4 text-[#7BA0B4]" />
          </div>
          <h2 className="text-[0.9rem] font-bold text-[#E0E0E0]">All Websites</h2>
          <span className="ml-auto rounded-lg px-2.5 py-1 text-[0.68rem] font-bold text-[#555]" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            {allWebsites?.length ?? 0}
          </span>
        </div>
        <div className="p-3">
          {allWebsites && allWebsites.length > 0 ? (
            <div className="space-y-1">
              {allWebsites.map((w) => (
                <div
                  key={w._id}
                  className="flex items-center justify-between rounded-2xl px-5 py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]"
                      style={{ backgroundColor: "rgba(92,122,138,0.12)" }}
                    >
                      <Globe className="h-[18px] w-[18px] text-[#7BA0B4]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.88rem] font-semibold text-[#E0E0E0]">{w.name}</span>
                        <span className="rounded-md px-2 py-0.5 text-[0.62rem] font-semibold text-[#555]" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                          {w.ownerName}
                        </span>
                      </div>
                      <p className="truncate text-[0.75rem] text-[#555]">{w.url}</p>
                      <p className="font-mono text-[0.65rem] text-[#333]">{w.trackingId}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-1">
                    <a
                      href={`/dashboard/site/${w._id}`}
                      className="rounded-xl p-2.5 text-[#555] transition-all hover:bg-white/[0.04] hover:text-[#9AAF8C]"
                      title="View analytics"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteWebsite(w._id as Id<"websites">)}
                      className="rounded-xl p-2.5 text-[#444] transition-all hover:bg-red-500/10 hover:text-red-400"
                      title="Delete website"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-[0.85rem] text-[#444]">No websites yet</p>
          )}
        </div>
      </div>

      {/* Applications & Bookings Inbox */}
      <div
        className="mt-8 overflow-hidden rounded-[24px]"
        style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(232,167,130,0.12)" }}>
            <Inbox className="h-4 w-4 text-[#E8A782]" />
          </div>
          <h2 className="text-[0.9rem] font-bold text-[#E0E0E0]">Inbox</h2>
          <span className="ml-auto rounded-lg px-2.5 py-1 text-[0.68rem] font-bold text-[#555]" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
            {applications?.length ?? 0}
          </span>
        </div>
        <div className="p-3">
          {applications && applications.length > 0 ? (
            <div className="space-y-1">
              {applications.map((app) => (
                <InboxItem
                  key={app._id}
                  app={app}
                  token={token}
                  updateStatusMut={updateStatusMut}
                  removeAppMut={removeAppMut}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-[0.85rem] text-[#444]">No submissions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

const PRESET_EMAILS = [
  {
    label: "Thanks for reaching out",
    subject: "Thanks for reaching out — 6POINT Solutions",
    body: "Thanks for your interest in working with us! We've received your submission and our team is reviewing it now.\n\nWe'll follow up shortly with next steps. In the meantime, feel free to reply to this email if you have any questions.",
  },
  {
    label: "Let's schedule a call",
    subject: "Let's set up a call — 6POINT Solutions",
    body: "We'd love to learn more about your business and goals. Are you available this week for a quick 15–30 minute call?\n\nJust reply with a couple of times that work for you and we'll get it on the calendar.",
  },
  {
    label: "Send a quote / proposal",
    subject: "Your custom proposal — 6POINT Solutions",
    body: "Thanks for sharing more about your project. Based on what you've told us, we've put together a plan that we think will be a great fit.\n\nWe'd love to walk you through it on a quick call. When works best for you?",
  },
  {
    label: "Follow up",
    subject: "Just checking in — 6POINT Solutions",
    body: "Hey! Just wanted to follow up on our last conversation. We're still excited about the opportunity to work together.\n\nLet us know if you have any questions or if you're ready to get started. We're here whenever you're ready.",
  },
  {
    label: "Welcome aboard",
    subject: "Welcome to 6POINT! 🎉",
    body: "We're thrilled to officially welcome you as a 6POINT client! Our team is already getting things set up and we'll have your onboarding details ready soon.\n\nExpect to hear from us within the next 24–48 hours with your project timeline and next steps.",
  },
];

function InboxItem({
  app,
  token,
  updateStatusMut,
  removeAppMut,
}: {
  app: any;
  token: string | null;
  updateStatusMut: any;
  removeAppMut: any;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const loadPreset = (preset: typeof PRESET_EMAILS[0]) => {
    setSubject(preset.subject);
    setBody(preset.body);
    setPresetOpen(false);
  };

  const handleSend = async () => {
    if (!subject || !body) return;
    setSending(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: app.email,
          subject,
          body,
          firstName: app.firstName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        if (token && app.status === "new") {
          await updateStatusMut({ sessionToken: token, applicationId: app._id, status: "contacted" });
        }
        setTimeout(() => {
          setSent(false);
          setReplyOpen(false);
          setSubject("");
          setBody("");
        }, 2000);
      }
    } catch {
      alert("Failed to send email");
    }
    setSending(false);
  };

  const inputClass =
    "w-full rounded-xl border-2 border-[#222] bg-[#111] px-4 py-3 text-[0.82rem] font-medium text-[#E0E0E0] outline-none transition-all placeholder:font-normal placeholder:text-[#444] focus:border-[#7B8C6F] focus:bg-[#141414]";

  return (
    <div className="rounded-2xl px-5 py-4 transition-colors hover:bg-white/[0.02]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.88rem] font-semibold text-[#E0E0E0]">
              {app.firstName} {app.lastName}
            </span>
            <span
              className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.04em]"
              style={{
                backgroundColor: app.type === "booking" ? "rgba(92,122,138,0.12)" : "rgba(123,140,111,0.12)",
                color: app.type === "booking" ? "#7BA0B4" : "#9AAF8C",
              }}
            >
              {app.type === "booking" ? <><CalendarDays className="h-3 w-3" /> Booking</> : <><Inbox className="h-3 w-3" /> Application</>}
            </span>
            <span
              className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.04em]"
              style={{
                backgroundColor:
                  app.status === "new" ? "rgba(232,167,130,0.12)" :
                  app.status === "contacted" ? "rgba(92,122,138,0.12)" :
                  app.status === "closed" ? "rgba(255,255,255,0.04)" : "rgba(123,140,111,0.12)",
                color:
                  app.status === "new" ? "#E8A782" :
                  app.status === "contacted" ? "#7BA0B4" :
                  app.status === "closed" ? "#555" : "#9AAF8C",
              }}
            >
              {app.status === "new" && <Clock className="h-3 w-3" />}
              {app.status === "contacted" && <Check className="h-3 w-3" />}
              {app.status}
            </span>
          </div>

          <p className="mt-1 text-[0.78rem] text-[#555]">
            {app.email}
            {app.phone && <> &middot; {app.phone}</>}
            {app.businessName && <> &middot; {app.businessName}</>}
          </p>

          {app.packageTier && app.packageTier !== "none" && (
            <p className="mt-1 text-[0.72rem] font-semibold text-[#9AAF8C]">
              {app.packageTier.charAt(0).toUpperCase() + app.packageTier.slice(1)} Package
            </p>
          )}

          {app.services && app.services.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {app.services.map((s: string) => (
                <span key={s} className="rounded-full px-2.5 py-1 text-[0.65rem] font-medium text-[#666]" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  {s}
                </span>
              ))}
            </div>
          )}

          {app.details && (
            <p className="mt-2 text-[0.78rem] leading-relaxed text-[#666]">
              &ldquo;{app.details}&rdquo;
            </p>
          )}

          <p className="mt-2 text-[0.65rem] text-[#333]">
            {new Date(app.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => setReplyOpen(!replyOpen)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[0.68rem] font-semibold transition-all hover:bg-white/[0.04]"
            style={{ color: replyOpen ? "#e55" : "#7BA0B4" }}
            title="Reply via email"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">{replyOpen ? "Close" : "Reply"}</span>
          </button>
          {app.status === "new" && (
            <button
              onClick={async () => {
                if (token) await updateStatusMut({ sessionToken: token, applicationId: app._id as any, status: "contacted" });
              }}
              className="rounded-xl px-3 py-2 text-[0.68rem] font-semibold text-[#7BA0B4] transition-all hover:bg-white/[0.04]"
              title="Mark as contacted"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          {app.status === "contacted" && (
            <button
              onClick={async () => {
                if (token) await updateStatusMut({ sessionToken: token, applicationId: app._id as any, status: "closed" });
              }}
              className="rounded-xl px-3 py-2 text-[0.68rem] font-semibold text-[#9AAF8C] transition-all hover:bg-white/[0.04]"
              title="Mark as closed"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={async () => {
              if (token && confirm("Delete this submission?")) {
                await removeAppMut({ sessionToken: token, applicationId: app._id as any });
              }
            }}
            className="rounded-xl p-2.5 text-[#444] transition-all hover:bg-red-500/10 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Reply panel */}
      {replyOpen && (
        <div className="mt-4 rounded-2xl border border-dashed p-4" style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}>
          {sent ? (
            <div className="flex items-center gap-2 py-4 text-center text-[0.85rem] font-semibold text-[#9AAF8C]">
              <Check className="h-5 w-5" />
              Email sent to {app.email}!
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[0.72rem] font-bold text-[#555]">
                  Replying to <span className="text-[#E0E0E0]">{app.email}</span>
                </p>
                <div className="relative">
                  <button
                    onClick={() => setPresetOpen(!presetOpen)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold transition-all hover:bg-white/[0.04]"
                    style={{ backgroundColor: "rgba(123,140,111,0.1)", color: "#9AAF8C" }}
                  >
                    Templates
                    <ChevronDown className="h-3 w-3" style={{ transform: presetOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                  {presetOpen && (
                    <div
                      className="absolute right-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-xl py-1"
                      style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
                    >
                      {PRESET_EMAILS.map((preset, i) => (
                        <button
                          key={i}
                          onClick={() => loadPreset(preset)}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[0.78rem] font-medium text-[#888] transition-colors hover:bg-white/[0.04] hover:text-[#E0E0E0]"
                        >
                          <Mail className="h-3.5 w-3.5 shrink-0 text-[#444]" />
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <input
                  className={inputClass}
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <textarea
                  className={inputClass + " resize-none"}
                  rows={5}
                  placeholder="Write your message..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !subject || !body}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[0.82rem] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #7B8C6F, #6A7A5F)", boxShadow: "0 4px 16px rgba(123,140,111,0.25)" }}
                >
                  {sending ? (
                    <><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" /> Sending...</>
                  ) : (
                    <><Send className="h-3.5 w-3.5" /> Send Email</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
