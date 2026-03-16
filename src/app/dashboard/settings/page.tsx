"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useSession } from "../layout";
import { Check, AlertCircle, Globe, Trash2, Plus } from "lucide-react";

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
    "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[0.85rem] text-[#111] outline-none transition-colors placeholder:text-[#CCC] focus:border-[#111]";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#111]">
          Settings
        </h1>
        <p className="mt-1 text-[0.88rem] text-[#999]">
          Manage your profile and preferences.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Profile */}
        <div className="rounded-2xl border border-[#E5E5E5] bg-white">
          <div className="border-b border-[#F0F0F0] px-6 py-4">
            <h2 className="text-[0.88rem] font-semibold text-[#111]">Profile</h2>
            <p className="text-[0.72rem] text-[#999]">Update your display name</p>
          </div>
          <div className="p-6">
            {nameMsg && (
              <div
                className="mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-[0.8rem] font-medium"
                style={{
                  backgroundColor: nameMsg.type === "success" ? "#f0fdf4" : "#fef2f2",
                  borderColor: nameMsg.type === "success" ? "#dcfce7" : "#fee2e2",
                  color: nameMsg.type === "success" ? "#15803d" : "#dc2626",
                }}
              >
                {nameMsg.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {nameMsg.text}
              </div>
            )}
            <form onSubmit={handleUpdateName} className="space-y-3">
              <div>
                <label className="mb-1.5 block text-[0.8rem] font-medium text-[#111]">Username</label>
                <input className={inputClass} value={user?.username ?? ""} disabled style={{ opacity: 0.5 }} />
              </div>
              <div>
                <label className="mb-1.5 block text-[0.8rem] font-medium text-[#111]">Display Name</label>
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <button
                type="submit"
                disabled={nameSaving}
                className="w-full rounded-xl bg-[#111] py-3 text-[0.85rem] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {nameSaving ? "Saving..." : "Update Name"}
              </button>
            </form>
          </div>
        </div>

        {/* Password */}
        <div className="rounded-2xl border border-[#E5E5E5] bg-white">
          <div className="border-b border-[#F0F0F0] px-6 py-4">
            <h2 className="text-[0.88rem] font-semibold text-[#111]">Security</h2>
            <p className="text-[0.72rem] text-[#999]">Change your password</p>
          </div>
          <div className="p-6">
            {pwMsg && (
              <div
                className="mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-[0.8rem] font-medium"
                style={{
                  backgroundColor: pwMsg.type === "success" ? "#f0fdf4" : "#fef2f2",
                  borderColor: pwMsg.type === "success" ? "#dcfce7" : "#fee2e2",
                  color: pwMsg.type === "success" ? "#15803d" : "#dc2626",
                }}
              >
                {pwMsg.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {pwMsg.text}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="mb-1.5 block text-[0.8rem] font-medium text-[#111]">Current Password</label>
                <input className={inputClass} type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} required placeholder="Enter current password" />
              </div>
              <div>
                <label className="mb-1.5 block text-[0.8rem] font-medium text-[#111]">New Password</label>
                <input className={inputClass} type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} required placeholder="Enter new password" />
              </div>
              <div>
                <label className="mb-1.5 block text-[0.8rem] font-medium text-[#111]">Confirm Password</label>
                <input className={inputClass} type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required placeholder="Confirm new password" />
              </div>
              <button
                type="submit"
                disabled={pwSaving}
                className="w-full rounded-xl bg-[#111] py-3 text-[0.85rem] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {pwSaving ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ad Accounts */}
      <div className="mt-6">
        <h2 className="mb-4 text-[0.95rem] font-semibold text-[#111]">Ad Accounts</h2>
        {websites && websites.length > 0 ? (
          <div className="space-y-4">
            {websites.map((site) => (
              <AdAccountsCard key={site._id} websiteId={site._id} websiteName={site.name} token={token} isAdmin={user?.isAdmin ?? false} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E5E5E5] bg-white px-8 py-12 text-center">
            <Globe className="mx-auto h-8 w-8 text-[#CCC]" />
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
  const adAccounts = useQuery(api.adAccounts.listAdAccounts, {
    websiteId: websiteId as any,
  });
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
    await addMut({
      sessionToken: token,
      websiteId: websiteId as any,
      platform,
      accountName,
      accountId,
    });
    setAccountName("");
    setAccountId("");
    setShowAdd(false);
    setAdding(false);
  };

  const inputClass =
    "w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[0.82rem] text-[#111] outline-none transition-colors placeholder:text-[#CCC] focus:border-[#111]";

  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-white">
      <div className="flex items-center justify-between border-b border-[#F0F0F0] px-6 py-4">
        <h3 className="text-[0.88rem] font-semibold text-[#111]">{websiteName}</h3>
        {isAdmin && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1.5 text-[0.75rem] font-medium transition-colors"
            style={{ color: showAdd ? "#dc2626" : "#7B8C6F" }}
          >
            <Plus className="h-3.5 w-3.5" style={{ transform: showAdd ? "rotate(45deg)" : "none", transition: "transform 0.2s" }} />
            {showAdd ? "Cancel" : "Add"}
          </button>
        )}
      </div>

      <div className="p-5">
        {showAdd && (
          <form onSubmit={handleAdd} className="mb-5 space-y-3 rounded-xl border border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-4">
            <select className={inputClass} value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="meta">Meta (Facebook/Instagram)</option>
              <option value="google">Google Ads</option>
              <option value="tiktok">TikTok Ads</option>
              <option value="other">Other</option>
            </select>
            <input className={inputClass} placeholder="Account Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
            <input className={inputClass} placeholder="Account / Pixel ID" value={accountId} onChange={(e) => setAccountId(e.target.value)} required />
            <button
              type="submit"
              disabled={adding}
              className="w-full rounded-xl bg-[#111] py-3 text-[0.82rem] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {adding ? "Adding..." : "Connect Account"}
            </button>
          </form>
        )}

        {adAccounts && adAccounts.length > 0 ? (
          <div className="divide-y divide-[#F5F5F5]">
            {adAccounts.map((acc) => (
              <div key={acc._id} className="flex items-center justify-between py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.82rem] font-medium text-[#111]">{acc.accountName}</span>
                    <span
                      className="rounded bg-[#F0F0F0] px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase"
                      style={{ color: acc.isActive ? "#15803d" : "#999" }}
                    >
                      {acc.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <span className="text-[0.72rem] text-[#999]">
                    {acc.platform.charAt(0).toUpperCase() + acc.platform.slice(1)} &middot; {acc.accountId}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={async () => { if (token) await toggleMut({ sessionToken: token, adAccountId: acc._id as any }); }}
                    className="px-2 py-1 text-[0.7rem] font-medium transition-colors hover:text-[#111]"
                    style={{ color: acc.isActive ? "#dc2626" : "#15803d" }}
                  >
                    {acc.isActive ? "Pause" : "Resume"}
                  </button>
                  {isAdmin && (
                    <button
                      onClick={async () => { if (token && confirm("Delete this ad account?")) await deleteMut({ sessionToken: token, adAccountId: acc._id as any }); }}
                      className="p-1 text-[#CCC] transition-colors hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-[0.82rem] text-[#CCC]">No ad accounts connected.</p>
        )}
      </div>
    </div>
  );
}
