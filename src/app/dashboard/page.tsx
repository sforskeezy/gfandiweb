"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSession } from "./layout";
import { Globe, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, token } = useSession();

  const websites = useQuery(
    api.websites.listWebsites,
    token ? { sessionToken: token } : "skip"
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[clamp(1.4rem,3vw,1.8rem)] font-semibold tracking-[-0.03em] text-[#E8E8E8]">
          Welcome back, {user?.name}
        </h1>
      </div>

      {websites === undefined ? (
        <div className="flex items-center gap-3 py-20 text-[0.85rem] text-[#3A3A3A]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1a1f18] border-t-[#7B8C6F]" />
          Loading...
        </div>
      ) : websites.length === 0 ? (
        <div
          className="rounded-2xl px-8 py-20 text-center"
          style={{ backgroundColor: "rgba(123,140,111,0.04)", border: "1px solid rgba(123,140,111,0.08)" }}
        >
          <Globe className="mx-auto h-8 w-8 text-[#3A3A3A]" />
          <p className="mt-4 text-[0.95rem] font-medium text-[#666]">No websites yet</p>
          <p className="mt-1.5 text-[0.82rem] text-[#444]">
            Your admin will add your websites here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {websites.map((site) => (
            <Link
              key={site._id}
              href={`/dashboard/site/${site._id}`}
              className="group flex items-center gap-5 rounded-2xl px-6 py-5 transition-all duration-200 hover:bg-[rgba(123,140,111,0.06)]"
              style={{ border: "1px solid rgba(123,140,111,0.06)" }}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200"
                style={{ backgroundColor: "rgba(123,140,111,0.08)" }}
              >
                <Globe className="h-5 w-5 text-[#7B8C6F]" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[0.92rem] font-semibold text-[#D0D0D0] transition-colors group-hover:text-[#E8E8E8]">
                  {site.name}
                </h3>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <ExternalLink className="h-3 w-3 text-[#3A3A3A]" />
                  <p className="truncate text-[0.76rem] text-[#4A4A4A]">{site.url}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 text-[0.76rem] font-medium text-[#4A4A4A] transition-colors group-hover:text-[#7B8C6F]">
                <span className="hidden sm:inline">Analytics</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
