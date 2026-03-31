"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSession } from "./layout";
import { Globe, ArrowRight, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, token } = useSession();

  const role = user?.role || (user?.isAdmin ? "admin" : "client");
  const isStaff = role === "staff";

  const websites = useQuery(
    api.websites.listWebsites,
    token ? { sessionToken: token } : "skip"
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[clamp(1.4rem,3vw,1.8rem)] font-semibold tracking-[-0.03em] text-[#2A2A2A]">
          Welcome back, {user?.name}
        </h1>
      </div>

      {/* Staff info banner */}
      {isStaff && (
        <div
          className="mb-6 flex items-start gap-3 rounded-xl px-5 py-4"
          style={{ backgroundColor: "rgba(220,60,60,0.06)", border: "1px solid rgba(220,60,60,0.15)" }}
        >
          <Eye className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "#C94040" }} />
          <p className="text-[0.82rem] font-semibold leading-relaxed" style={{ color: "#C94040" }}>
            SINCE YOU ARE A STAFF ACCOUNT YOU CAN SEE ALL ACTIVE CLIENT WEBSITES AND VIEW THEIR ANALYTICS BY CLICKING THE <span className="inline-flex items-center gap-0.5"><Eye className="inline h-3.5 w-3.5" /></span>
          </p>
        </div>
      )}

      {websites === undefined ? (
        <div className="flex items-center gap-3 py-20 text-[0.85rem] text-[#BBB]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E5E8E0] border-t-[#7B8C6F]" />
          Loading...
        </div>
      ) : websites.length === 0 ? (
        <div
          className="rounded-2xl bg-white px-8 py-20 text-center"
          style={{ border: "1px solid rgba(123,140,111,0.12)" }}
        >
          <Globe className="mx-auto h-8 w-8 text-[#CCC]" />
          <p className="mt-4 text-[0.95rem] font-medium text-[#666]">No websites yet</p>
          <p className="mt-1.5 text-[0.82rem] text-[#AAA]">
            {isStaff ? "No client websites have been set up yet." : "Your admin will add your websites here."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {websites.map((site) => (
            <Link
              key={site._id}
              href={`/dashboard/site/${site._id}`}
              className="group flex items-center gap-5 rounded-2xl bg-white px-6 py-5 transition-all duration-200 hover:shadow-md hover:shadow-[rgba(123,140,111,0.08)]"
              style={{ border: "1px solid rgba(123,140,111,0.1)" }}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(123,140,111,0.08)" }}
              >
                <Globe className="h-5 w-5 text-[#7B8C6F]" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[0.92rem] font-semibold text-[#2A2A2A] transition-colors group-hover:text-[#5A6D50]">
                  {site.name}
                </h3>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <ExternalLink className="h-3 w-3 text-[#CCC]" />
                  <p className="truncate text-[0.76rem] text-[#AAA]">{site.url}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 text-[0.76rem] font-medium text-[#CCC] transition-colors group-hover:text-[#7B8C6F]">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">View Analytics</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
