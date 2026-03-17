"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useSession } from "../layout";
import { User, Lock, Check, AlertCircle, Globe, Trash2, Plus, Megaphone } from "lucide-react";

export default function SettingsPage() {
  const { user, token } = useSession();

  const [name, setName] = useState(user?.name ?? "");
  const [nameMsg, setNameMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [nameSaving, setNameSaving] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  const updateNameMut = useMutation(api.profile.updateName);
  const changePasswordMut = useMutation(api.profile.changePassword);

  const websites = useQuery(
    api.websites.listWebsites,
    token ? { sessionToken: token } : "skip"
  );

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setNameSaving(true);
    setNameMsg(null);
    const result = await updateNameMut({ sessionToken: token, name });
    if (result.success) {
      setNameMsg({ type: "success", text: "Display name updated!" });
    } else {
      setNameMsg({ type: "error", text: result.error || "Failed" });
    }
    setNameSaving(false);
    setTimeout(() => setNameMsg(null), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPw !== confirmPw) {
      setPwMsg({ type: "error", text: "Passwords don't match" });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    const result = await changePasswordMut({
      sessionToken: token,
      currentPassword: currentPw,
      newPassword: newPw,
    });
    if (result.success) {
      setPwMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } else {
      setPwMsg({ type: "error", text: result.error || "Failed" });
    }
    setPwSaving(false);
    setTimeout(() => setPwMsg(null), 4000);
  };

  const inputClass =
    "w-full rounded-xl border border-[#E2E5DD] bg-[#F8F9F6] px-4 py-3 text-[0.85rem] font-medium text-[#2A2A2A] outline-none transition-all placeholder:text-[#BBB] focus:border-[#7B8C6F] focus:bg-white focus:shadow-[0_0_0_3px_rgba(123,140,111,0.08)]";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[clamp(1.4rem,3vw,1.8rem)] font-semibold tracking-[-0.03em] text-[#2A2A2A]">
          Account Settings
        </h1>
        <p className="mt-1.5 text-[0.85rem] text-[#999]">
          Manage your profile and preferences.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Profile */}
        <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
          <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
              <User className="h-4 w-4 text-[#7B8C6F]" />
            </div>
            <div>
              <h2 className="text-[0.88rem] font-semibold text-[#2A2A2A]">Profile</h2>
              <p className="text-[0.7rem] text-[#BBB]">Update your display name</p>
            </div>
          </div>
          <div className="p-5">
            {nameMsg && (
              <div
                className="mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-[0.8rem] font-semibold"
                style={{
                  backgroundColor: nameMsg.type === "success" ? "rgba(123,140,111,0.08)" : "rgba(220,50,50,0.06)",
                  color: nameMsg.type === "success" ? "#5A6D50" : "#c33",
                }}
              >
                {nameMsg.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {nameMsg.text}
              </div>
            )}
            <form onSubmit={handleUpdateName} className="space-y-3.5">
              <div>
                <label className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#BBB]">Username</label>
                <input className={inputClass} value={user?.username ?? ""} disabled style={{ opacity: 0.4 }} />
              </div>
              <div>
                <label className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#BBB]">Display Name</label>
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <button
                type="submit"
                disabled={nameSaving}
                className="w-full rounded-xl py-3 text-[0.82rem] font-semibold text-white transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: "#7B8C6F" }}
              >
                {nameSaving ? "Saving..." : "Update Name"}
              </button>
            </form>
          </div>
        </div>

        {/* Password */}
        <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
          <div className="flex items-center gap-3 border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
              <Lock className="h-4 w-4 text-[#7B8C6F]" />
            </div>
            <div>
              <h2 className="text-[0.88rem] font-semibold text-[#2A2A2A]">Security</h2>
              <p className="text-[0.7rem] text-[#BBB]">Change your password</p>
            </div>
          </div>
          <div className="p-5">
            {pwMsg && (
              <div
                className="mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-[0.8rem] font-semibold"
                style={{
                  backgroundColor: pwMsg.type === "success" ? "rgba(123,140,111,0.08)" : "rgba(220,50,50,0.06)",
                  color: pwMsg.type === "success" ? "#5A6D50" : "#c33",
                }}
              >
                {pwMsg.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {pwMsg.text}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#BBB]">Current Password</label>
                <input className={inputClass} type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} required placeholder="Enter current password" />
              </div>
              <div>
                <label className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#BBB]">New Password</label>
                <input className={inputClass} type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} required placeholder="Enter new password" />
              </div>
              <div>
                <label className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#BBB]">Confirm New Password</label>
                <input className={inputClass} type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required placeholder="Confirm new password" />
              </div>
              <button
                type="submit"
                disabled={pwSaving}
                className="w-full rounded-xl py-3 text-[0.82rem] font-semibold text-white transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: "#7B8C6F" }}
              >
                {pwSaving ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ad Accounts */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
            <Megaphone className="h-4 w-4 text-[#7B8C6F]" />
          </div>
          <div>
            <h2 className="text-[0.88rem] font-semibold text-[#2A2A2A]">Ad Accounts</h2>
            <p className="text-[0.7rem] text-[#BBB]">Connected ad platforms for each website</p>
          </div>
        </div>

        {websites && websites.length > 0 ? (
          <div className="space-y-4">
            {websites.map((site) => (
              <AdAccountsCard key={site._id} websiteId={site._id} websiteName={site.name} token={token} isAdmin={user?.isAdmin ?? false} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-8 py-12 text-center" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
            <Globe className="mx-auto h-8 w-8 text-[#DDD]" />
            <p className="mt-3 text-[0.85rem] text-[#999]">No websites to configure yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdAccountsCard({
  websiteId,
  websiteName,
  token,
  isAdmin,
}: {
  websiteId: string;
  websiteName: string;
  token: string | null;
  isAdmin: boolean;
}) {
  const adAccounts = useQuery(api.adAccounts.listAdAccounts, { websiteId: websiteId as any });
  const addMut = useMutation(api.adAccounts.addAdAccount);
  const deleteMut = useMutation(api.adAccounts.deleteAdAccount);
  const toggleMut = useMutation(api.adAccounts.toggleAdAccount);

  const [showAdd, setShowAdd] = useState(false);
  const [platform, setPlatform] = useState("meta");
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setAdding(true);
    await addMut({ sessionToken: token, websiteId: websiteId as any, platform, accountName, accountId });
    setAccountName("");
    setAccountId("");
    setShowAdd(false);
    setAdding(false);
  };

  const inputClass =
    "w-full rounded-xl border border-[#E2E5DD] bg-[#F8F9F6] px-4 py-3 text-[0.82rem] font-medium text-[#2A2A2A] outline-none transition-all placeholder:text-[#BBB] focus:border-[#7B8C6F] focus:bg-white";

  return (
    <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid rgba(123,140,111,0.1)" }}>
      <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "rgba(123,140,111,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(123,140,111,0.08)" }}>
            <Globe className="h-3.5 w-3.5 text-[#7B8C6F]" />
          </div>
          <h3 className="text-[0.85rem] font-semibold text-[#2A2A2A]">{websiteName}</h3>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.72rem] font-semibold transition-all"
            style={{
              backgroundColor: showAdd ? "rgba(220,50,50,0.06)" : "rgba(123,140,111,0.08)",
              color: showAdd ? "#c33" : "#5A6D50",
            }}
          >
            <Plus className="h-3.5 w-3.5" style={{ transform: showAdd ? "rotate(45deg)" : "none", transition: "transform 0.2s" }} />
            {showAdd ? "Cancel" : "Add Account"}
          </button>
        )}
      </div>

      <div className="p-5">
        {showAdd && (
          <form onSubmit={handleAdd} className="mb-5 space-y-3 rounded-xl border border-dashed p-4" style={{ borderColor: "rgba(123,140,111,0.15)", backgroundColor: "#FAFBF8" }}>
            <select className={inputClass} value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="meta">Meta (Facebook/Instagram)</option>
              <option value="google">Google Ads</option>
              <option value="tiktok">TikTok Ads</option>
              <option value="other">Other</option>
            </select>
            <input className={inputClass} placeholder="Account Name (e.g. Main Business)" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
            <input className={inputClass} placeholder="Account / Pixel ID" value={accountId} onChange={(e) => setAccountId(e.target.value)} required />
            <button type="submit" disabled={adding} className="w-full rounded-xl py-2.5 text-[0.82rem] font-semibold text-white transition-all hover:brightness-105 disabled:opacity-50" style={{ backgroundColor: "#7B8C6F" }}>
              {adding ? "Adding..." : "Connect Account"}
            </button>
          </form>
        )}

        {adAccounts && adAccounts.length > 0 ? (
          <div className="space-y-1.5">
            {adAccounts.map((acc) => (
              <div key={acc._id} className="flex items-center justify-between rounded-xl px-3.5 py-3 transition-colors hover:bg-[#F8F9F6]">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[0.6rem] font-bold uppercase"
                    style={{
                      backgroundColor: acc.platform === "meta" ? "rgba(24,119,242,0.08)" : acc.platform === "google" ? "rgba(234,67,53,0.08)" : "rgba(123,140,111,0.06)",
                      color: acc.platform === "meta" ? "#1877F2" : acc.platform === "google" ? "#EA4335" : "#888",
                    }}
                  >
                    {acc.platform === "meta" ? "M" : acc.platform === "google" ? "G" : acc.platform === "tiktok" ? "T" : "?"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.82rem] font-semibold text-[#2A2A2A]">{acc.accountName}</span>
                      <span className="rounded px-1.5 py-0.5 text-[0.58rem] font-bold uppercase" style={{ backgroundColor: acc.isActive ? "rgba(123,140,111,0.08)" : "rgba(0,0,0,0.03)", color: acc.isActive ? "#5A6D50" : "#BBB" }}>
                        {acc.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                    <span className="text-[0.7rem] text-[#BBB]">{acc.platform.charAt(0).toUpperCase() + acc.platform.slice(1)} &middot; ID: {acc.accountId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={async () => { if (token) await toggleMut({ sessionToken: token, adAccountId: acc._id as any }); }}
                    className="rounded-lg px-2.5 py-1.5 text-[0.68rem] font-semibold transition-all hover:bg-[#F0F2ED]"
                    style={{ color: acc.isActive ? "#c33" : "#5A6D50" }}
                  >
                    {acc.isActive ? "Pause" : "Resume"}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={async () => { if (token && confirm("Delete this ad account?")) await deleteMut({ sessionToken: token, adAccountId: acc._id as any }); }}
                      className="rounded-lg p-1.5 text-[#DDD] transition-all hover:bg-red-50 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-[0.82rem] text-[#BBB]">No ad accounts connected yet.</p>
        )}
      </div>
    </div>
  );
}
