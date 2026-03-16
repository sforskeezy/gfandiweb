"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useAdminSession } from "./layout";
import { UserPlus, Globe, Trash2, Eye } from "lucide-react";

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
    "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[0.85rem] text-[#111] outline-none transition-colors placeholder:text-[#CCC] focus:border-[#111]";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#111]">
          Admin Panel
        </h1>
        <p className="mt-1 text-[0.88rem] text-[#999]">
          Manage users and websites.
        </p>
      </div>

      {/* Forms */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white">
          <div className="border-b border-[#F0F0F0] px-6 py-4">
            <h2 className="text-[0.88rem] font-semibold text-[#111]">Create User</h2>
            <p className="text-[0.72rem] text-[#999]">Add a new client account</p>
          </div>
          <div className="p-6">
            {userMsg && (
              <div className="mb-4 rounded-xl border border-green-100 bg-green-50 px-4 py-2.5 text-[0.8rem] font-medium text-green-700">
                {userMsg}
              </div>
            )}
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input className={inputClass} placeholder="Display Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
              <input className={inputClass} placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required />
              <input className={inputClass} type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
              <button type="submit" className="w-full rounded-xl bg-[#111] py-3 text-[0.85rem] font-medium text-white transition-opacity hover:opacity-90">
                Create User
              </button>
            </form>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-white">
          <div className="border-b border-[#F0F0F0] px-6 py-4">
            <h2 className="text-[0.88rem] font-semibold text-[#111]">Add Website</h2>
            <p className="text-[0.72rem] text-[#999]">Assign a website to a client</p>
          </div>
          <div className="p-6">
            {siteMsg && (
              <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-[0.8rem] font-medium text-blue-700">
                {siteMsg}
              </div>
            )}
            <form onSubmit={handleAddWebsite} className="space-y-3">
              <select className={inputClass} value={newSite.userId} onChange={(e) => setNewSite({ ...newSite, userId: e.target.value })} required>
                <option value="">Select a user</option>
                {users?.filter((u) => !u.isAdmin).map((u) => (
                  <option key={u._id} value={u._id}>{u.name} (@{u.username})</option>
                ))}
              </select>
              <input className={inputClass} placeholder="Website Name" value={newSite.name} onChange={(e) => setNewSite({ ...newSite, name: e.target.value })} required />
              <input className={inputClass} placeholder="Website URL (https://...)" value={newSite.url} onChange={(e) => setNewSite({ ...newSite, url: e.target.value })} required />
              <button type="submit" className="w-full rounded-xl bg-[#111] py-3 text-[0.85rem] font-medium text-white transition-opacity hover:opacity-90">
                Add Website
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Users */}
      <div className="mt-6 rounded-2xl border border-[#E5E5E5] bg-white">
        <div className="flex items-center justify-between border-b border-[#F0F0F0] px-6 py-4">
          <h2 className="text-[0.88rem] font-semibold text-[#111]">All Users</h2>
          <span className="text-[0.75rem] text-[#999]">{users?.length ?? 0}</span>
        </div>
        <div className="divide-y divide-[#F5F5F5]">
          {users && users.length > 0 ? (
            users.map((u) => (
              <div key={u._id} className="flex items-center justify-between px-6 py-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.85rem] font-medium text-[#111]">{u.name}</span>
                    <span className="text-[0.78rem] text-[#999]">@{u.username}</span>
                    {u.isAdmin && (
                      <span className="rounded bg-[#F0F0F0] px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase text-[#666]">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                {!u.isAdmin && (
                  <button
                    onClick={() => handleDeleteUser(u._id as Id<"users">)}
                    className="p-1.5 text-[#CCC] transition-colors hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="px-6 py-8 text-center text-[0.82rem] text-[#CCC]">No users yet</p>
          )}
        </div>
      </div>

      {/* Websites */}
      <div className="mt-4 rounded-2xl border border-[#E5E5E5] bg-white">
        <div className="flex items-center justify-between border-b border-[#F0F0F0] px-6 py-4">
          <h2 className="text-[0.88rem] font-semibold text-[#111]">All Websites</h2>
          <span className="text-[0.75rem] text-[#999]">{allWebsites?.length ?? 0}</span>
        </div>
        <div className="divide-y divide-[#F5F5F5]">
          {allWebsites && allWebsites.length > 0 ? (
            allWebsites.map((w) => (
              <div key={w._id} className="flex items-center justify-between px-6 py-3.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.85rem] font-medium text-[#111]">{w.name}</span>
                    <span className="text-[0.72rem] text-[#999]">{w.ownerName}</span>
                  </div>
                  <p className="truncate text-[0.75rem] text-[#999]">{w.url}</p>
                  <p className="font-mono text-[0.65rem] text-[#CCC]">{w.trackingId}</p>
                </div>
                <div className="ml-4 flex shrink-0 items-center gap-1">
                  <a href={`/dashboard/site/${w._id}`} className="p-1.5 text-[#CCC] transition-colors hover:text-[#666]">
                    <Eye className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteWebsite(w._id as Id<"websites">)}
                    className="p-1.5 text-[#CCC] transition-colors hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="px-6 py-8 text-center text-[0.82rem] text-[#CCC]">No websites yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
