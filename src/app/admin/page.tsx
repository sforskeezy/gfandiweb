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

  const cardStyle = {
    borderColor: "rgba(0,0,0,0.06)",
    backgroundColor: "#FFFFFF",
  };

  const inputClass =
    "w-full rounded-xl border border-[#E8E6E3] bg-[#FAFAF9] px-4 py-3 text-[0.85rem] text-[#1A1A1A] outline-none transition-all placeholder:text-[#D0D0D0] focus:border-[#7B8C6F] focus:bg-white focus:ring-2 focus:ring-[#7B8C6F]/10";

  return (
    <div>
      <h1 className="mb-8 text-[1.8rem] font-semibold tracking-[-0.02em] text-[#1A1A1A]">
        Admin Panel
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Create User */}
        <div className="rounded-2xl border p-6" style={cardStyle}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
              <UserPlus className="h-4.5 w-4.5 text-[#7B8C6F]" />
            </div>
            <h2 className="text-[1rem] font-semibold text-[#1A1A1A]">Create User</h2>
          </div>

          {userMsg && (
            <div className="mb-4 rounded-xl px-4 py-2.5 text-[0.8rem] font-medium" style={{ backgroundColor: "rgba(123,140,111,0.08)", color: "#5a6d50" }}>
              {userMsg}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-3">
            <input
              className={inputClass}
              placeholder="Display Name (e.g. Amaya)"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
            <input
              className={inputClass}
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
            />
            <input
              className={inputClass}
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            <button
              type="submit"
              className="w-full rounded-xl py-3 text-[0.85rem] font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#1A1A1A" }}
            >
              Create User
            </button>
          </form>
        </div>

        {/* Add Website */}
        <div className="rounded-2xl border p-6" style={cardStyle}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(92,122,138,0.08)" }}>
              <Globe className="h-4.5 w-4.5 text-[#5C7A8A]" />
            </div>
            <h2 className="text-[1rem] font-semibold text-[#1A1A1A]">Add Website</h2>
          </div>

          {siteMsg && (
            <div className="mb-4 rounded-xl px-4 py-2.5 text-[0.8rem] font-medium" style={{ backgroundColor: "rgba(92,122,138,0.08)", color: "#4a6a7a" }}>
              {siteMsg}
            </div>
          )}

          <form onSubmit={handleAddWebsite} className="space-y-3">
            <select
              className={inputClass}
              value={newSite.userId}
              onChange={(e) => setNewSite({ ...newSite, userId: e.target.value })}
              required
            >
              <option value="">Select a user</option>
              {users?.filter((u) => !u.isAdmin).map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} (@{u.username})
                </option>
              ))}
            </select>
            <input
              className={inputClass}
              placeholder="Website Name"
              value={newSite.name}
              onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
              required
            />
            <input
              className={inputClass}
              placeholder="Website URL (e.g. https://example.com)"
              value={newSite.url}
              onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
              required
            />
            <button
              type="submit"
              className="w-full rounded-xl py-3 text-[0.85rem] font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#1A1A1A" }}
            >
              Add Website
            </button>
          </form>
        </div>
      </div>

      {/* Users list */}
      <div className="mt-8 rounded-2xl border p-6" style={cardStyle}>
        <h2 className="mb-4 text-[1rem] font-semibold text-[#1A1A1A]">All Users</h2>
        {users && users.length > 0 ? (
          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ backgroundColor: "#FAFAF9" }}
              >
                <div>
                  <span className="text-[0.88rem] font-medium text-[#1A1A1A]">{u.name}</span>
                  <span className="ml-2 text-[0.78rem] text-[#AAA]">@{u.username}</span>
                  {u.isAdmin && (
                    <span className="ml-2 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase" style={{ backgroundColor: "rgba(123,140,111,0.1)", color: "#7B8C6F" }}>
                      Admin
                    </span>
                  )}
                </div>
                {!u.isAdmin && (
                  <button
                    onClick={() => handleDeleteUser(u._id as Id<"users">)}
                    className="rounded-lg p-2 text-[#CCC] transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-[0.85rem] text-[#CCC]">No users yet</p>
        )}
      </div>

      {/* Websites list */}
      <div className="mt-6 rounded-2xl border p-6" style={cardStyle}>
        <h2 className="mb-4 text-[1rem] font-semibold text-[#1A1A1A]">All Websites</h2>
        {allWebsites && allWebsites.length > 0 ? (
          <div className="space-y-2">
            {allWebsites.map((w) => (
              <div
                key={w._id}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ backgroundColor: "#FAFAF9" }}
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[0.88rem] font-medium text-[#1A1A1A]">{w.name}</span>
                  <span className="ml-2 text-[0.78rem] text-[#AAA]">({w.ownerName})</span>
                  <p className="truncate text-[0.75rem] text-[#BBB]">{w.url}</p>
                  <p className="font-mono text-[0.68rem] text-[#CCC]">ID: {w.trackingId}</p>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <a
                    href={`/dashboard/site/${w._id}`}
                    className="rounded-lg p-2 text-[#AAA] transition-colors hover:bg-black/[0.03] hover:text-[#1A1A1A]"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteWebsite(w._id as Id<"websites">)}
                    className="rounded-lg p-2 text-[#CCC] transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-[0.85rem] text-[#CCC]">No websites yet</p>
        )}
      </div>
    </div>
  );
}
