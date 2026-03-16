"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useAdminSession } from "./layout";
import { UserPlus, Globe, Trash2, Eye, Users, Settings, ExternalLink } from "lucide-react";

export default function AdminPage() {
  const { token } = useAdminSession();

  const users = useQuery(api.users.listUsers, token ? { sessionToken: token } : "skip");
  const allWebsites = useQuery(api.websites.listAllWebsites, token ? { sessionToken: token } : "skip");

  const createUserMut = useMutation(api.users.createUser);
  const addWebsiteMut = useMutation(api.websites.addWebsite);
  const deleteUserMut = useMutation(api.users.deleteUser);
  const deleteWebsiteMut = useMutation(api.websites.deleteWebsite);

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
    "w-full rounded-2xl border-2 border-[#EEECEA] bg-[#FAF9F7] px-5 py-3.5 text-[0.85rem] font-medium text-[#1A1A1A] outline-none transition-all placeholder:font-normal placeholder:text-[#D0D0D0] focus:border-[#7B8C6F] focus:bg-white focus:shadow-[0_0_0_4px_rgba(123,140,111,0.06)]";

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#7B8C6F]" />
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#B0ADA8]">
            Administration
          </p>
        </div>
        <h1 className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold tracking-[-0.04em] text-[#1A1A1A]">
          Admin Panel
        </h1>
        <p className="mt-2 text-[0.88rem] text-[#A5A29D]">
          Manage users and websites from one place.
        </p>
      </div>

      {/* Quick stats */}
      <div className="mb-8 flex gap-4">
        <div
          className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5"
          style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
            <Users className="h-4 w-4 text-[#7B8C6F]" />
          </div>
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#C5C2BC]">Users</p>
            <p className="text-[1.1rem] font-bold text-[#1A1A1A]">{users?.length ?? 0}</p>
          </div>
        </div>
        <div
          className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3.5"
          style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(92,122,138,0.08)" }}>
            <Globe className="h-4 w-4 text-[#5C7A8A]" />
          </div>
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#C5C2BC]">Websites</p>
            <p className="text-[1.1rem] font-bold text-[#1A1A1A]">{allWebsites?.length ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Forms */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create User */}
        <div
          className="overflow-hidden rounded-[24px] bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px]" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
              <UserPlus className="h-[18px] w-[18px] text-[#7B8C6F]" />
            </div>
            <div>
              <h2 className="text-[0.95rem] font-bold text-[#1A1A1A]">Create User</h2>
              <p className="text-[0.7rem] text-[#B0ADA8]">Add a new client account</p>
            </div>
          </div>

          <div className="p-6">
            {userMsg && (
              <div className="mb-5 rounded-2xl px-4 py-3 text-[0.8rem] font-semibold" style={{ backgroundColor: "rgba(123,140,111,0.06)", color: "#5a6d50" }}>
                {userMsg}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <input className={inputClass} placeholder="Display Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
              <input className={inputClass} placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
              <input className={inputClass} type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
              <button
                type="submit"
                className="w-full rounded-2xl py-3.5 text-[0.85rem] font-semibold text-white transition-all hover:brightness-105 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #7B8C6F, #6A7A5F)", boxShadow: "0 4px 14px rgba(123,140,111,0.25)" }}
              >
                Create User
              </button>
            </form>
          </div>
        </div>

        {/* Add Website */}
        <div
          className="overflow-hidden rounded-[24px] bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px]" style={{ backgroundColor: "rgba(92,122,138,0.08)" }}>
              <Globe className="h-[18px] w-[18px] text-[#5C7A8A]" />
            </div>
            <div>
              <h2 className="text-[0.95rem] font-bold text-[#1A1A1A]">Add Website</h2>
              <p className="text-[0.7rem] text-[#B0ADA8]">Assign a website to a client</p>
            </div>
          </div>

          <div className="p-6">
            {siteMsg && (
              <div className="mb-5 rounded-2xl px-4 py-3 text-[0.8rem] font-semibold" style={{ backgroundColor: "rgba(92,122,138,0.06)", color: "#4a6a7a" }}>
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
                className="w-full rounded-2xl py-3.5 text-[0.85rem] font-semibold text-white transition-all hover:brightness-105 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #5C7A8A, #4a6878)", boxShadow: "0 4px 14px rgba(92,122,138,0.25)" }}
              >
                Add Website
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Users list */}
      <div
        className="mt-8 overflow-hidden rounded-[24px] bg-white"
        style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
            <Users className="h-4 w-4 text-[#7B8C6F]" />
          </div>
          <h2 className="text-[0.9rem] font-bold text-[#1A1A1A]">All Users</h2>
          <span className="ml-auto rounded-lg px-2.5 py-1 text-[0.68rem] font-bold text-[#B0ADA8]" style={{ backgroundColor: "#F4F1EC" }}>
            {users?.length ?? 0}
          </span>
        </div>
        <div className="p-3">
          {users && users.length > 0 ? (
            <div className="space-y-1">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between rounded-2xl px-5 py-4 transition-colors hover:bg-[#FAF9F7]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[0.65rem] font-bold text-white"
                      style={{ background: u.isAdmin ? "linear-gradient(135deg, #9AAF8C, #7B8C6F)" : "linear-gradient(135deg, #B0ADA8, #999)" }}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[0.88rem] font-semibold text-[#1A1A1A]">{u.name}</span>
                        {u.isAdmin && (
                          <span className="rounded-md px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.04em]" style={{ backgroundColor: "rgba(123,140,111,0.08)", color: "#7B8C6F" }}>
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[0.75rem] text-[#B0ADA8]">@{u.username}</span>
                    </div>
                  </div>
                  {!u.isAdmin && (
                    <button
                      onClick={() => handleDeleteUser(u._id as Id<"users">)}
                      className="rounded-xl p-2.5 text-[#D0D0D0] transition-all hover:bg-red-50 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-[0.85rem] text-[#C5C2BC]">No users yet</p>
          )}
        </div>
      </div>

      {/* Websites list */}
      <div
        className="mt-6 overflow-hidden rounded-[24px] bg-white"
        style={{ border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center gap-3 border-b px-7 py-5" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(92,122,138,0.08)" }}>
            <Globe className="h-4 w-4 text-[#5C7A8A]" />
          </div>
          <h2 className="text-[0.9rem] font-bold text-[#1A1A1A]">All Websites</h2>
          <span className="ml-auto rounded-lg px-2.5 py-1 text-[0.68rem] font-bold text-[#B0ADA8]" style={{ backgroundColor: "#F4F1EC" }}>
            {allWebsites?.length ?? 0}
          </span>
        </div>
        <div className="p-3">
          {allWebsites && allWebsites.length > 0 ? (
            <div className="space-y-1">
              {allWebsites.map((w) => (
                <div
                  key={w._id}
                  className="flex items-center justify-between rounded-2xl px-5 py-4 transition-colors hover:bg-[#FAF9F7]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]"
                      style={{ backgroundColor: "rgba(92,122,138,0.08)" }}
                    >
                      <Globe className="h-[18px] w-[18px] text-[#5C7A8A]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.88rem] font-semibold text-[#1A1A1A]">{w.name}</span>
                        <span className="rounded-md px-2 py-0.5 text-[0.62rem] font-semibold text-[#B0ADA8]" style={{ backgroundColor: "#F4F1EC" }}>
                          {w.ownerName}
                        </span>
                      </div>
                      <p className="truncate text-[0.75rem] text-[#B0ADA8]">{w.url}</p>
                      <p className="font-mono text-[0.65rem] text-[#D0D0D0]">{w.trackingId}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 items-center gap-1">
                    <a
                      href={`/dashboard/site/${w._id}`}
                      className="rounded-xl p-2.5 text-[#C5C2BC] transition-all hover:bg-[#F4F1EC] hover:text-[#7B8C6F]"
                      title="View analytics"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleDeleteWebsite(w._id as Id<"websites">)}
                      className="rounded-xl p-2.5 text-[#D0D0D0] transition-all hover:bg-red-50 hover:text-red-400"
                      title="Delete website"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-[0.85rem] text-[#C5C2BC]">No websites yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
