"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSession } from "./layout";
import { Globe, ArrowRight, BarChart3 } from "lucide-react";
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
        <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#111]">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-1 text-[0.88rem] text-[#999]">
          Here are your websites and their performance.
        </p>
      </div>

      {websites === undefined ? (
        <div className="flex items-center gap-3 py-16 text-[0.85rem] text-[#999]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E5E5E5] border-t-[#111]" />
          Loading...
        </div>
      ) : websites.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E5E5] bg-white px-8 py-16 text-center">
          <Globe className="mx-auto h-8 w-8 text-[#CCC]" />
          <h3 className="mt-4 text-[1rem] font-semibold text-[#111]">No websites yet</h3>
          <p className="mt-1.5 text-[0.85rem] text-[#999]">
            Your admin will add your websites here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {websites.map((site) => (
            <Link
              key={site._id}
              href={`/dashboard/site/${site._id}`}
              className="group rounded-2xl border border-[#E5E5E5] bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F5F5]">
                  <Globe className="h-5 w-5 text-[#666]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[0.95rem] font-semibold text-[#111]">{site.name}</h3>
                  <p className="truncate text-[0.78rem] text-[#999]">{site.url}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#F0F0F0] pt-4">
                <span className="flex items-center gap-1.5 text-[0.78rem] font-medium text-[#7B8C6F]">
                  <BarChart3 className="h-3.5 w-3.5" />
                  View Analytics
                </span>
                <ArrowRight className="h-4 w-4 text-[#CCC] transition-all group-hover:translate-x-0.5 group-hover:text-[#999]" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
