"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Shield,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { COMPANIES_DATA, JOBS_DATA, EVENTS_DATA } from "@/lib/data";

interface PendingSubmission {
  id: string;
  type: "STARTUP" | "JOB" | "EVENT" | "CLAIM";
  title: string;
  subtitle: string;
  submittedBy: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const INITIAL_QUEUE: PendingSubmission[] = [
  {
    id: "sub-1",
    type: "STARTUP",
    title: "NeuroVidarbha AI",
    subtitle: "AI healthcare diagnostics startup founded by VNIT alumni in Dharampeth",
    submittedBy: "dr.kulkarni@neurovidarbha.com",
    submittedAt: "2 hours ago",
    status: "PENDING",
  },
  {
    id: "sub-2",
    type: "JOB",
    title: "Senior Prompt Engineer @ Immverse AI",
    subtitle: "Full-time hybrid role in Civil Lines, ₹14-20 LPA",
    submittedBy: "careers@immverseai.com",
    submittedAt: "5 hours ago",
    status: "PENDING",
  },
  {
    id: "sub-3",
    type: "CLAIM",
    title: "Claim Request: Flappic Technologies",
    subtitle: "Verification claim requested by founder with domain match (flappic.com)",
    submittedBy: "priya@flappic.com",
    submittedAt: "Yesterday",
    status: "PENDING",
  },
  {
    id: "sub-4",
    type: "EVENT",
    title: "Central India SaaS Founders Roundtable",
    subtitle: "Networking dinner at Radisson Blu for B2B founders, Oct 28",
    submittedBy: "community@saasnagpur.org",
    submittedAt: "2 days ago",
    status: "PENDING",
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<"QUEUE" | "COMPANIES" | "JOBS">("QUEUE");
  const [queue, setQueue] = React.useState(INITIAL_QUEUE);
  const [search, setSearch] = React.useState("");

  const handleAction = (id: string, action: "APPROVED" | "REJECTED") => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
  };

  const pendingCount = queue.filter((i) => i.status === "PENDING").length;

  return (
    <div className="container-page py-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-1">
            <Shield className="h-3 w-3" /> Ecosystem Admin
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin & Moderation Console</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review submissions, moderate company profiles, approve jobs, and verify local claims.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border hover:bg-accent transition-colors"
          >
            Public Site
          </Link>
          <Link
            href="/submit"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            + New Entity
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground">Pending Queue</p>
          <p className="text-2xl font-bold mt-1 text-primary">{pendingCount}</p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            Requires review
          </span>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground">Active Companies</p>
          <p className="text-2xl font-bold mt-1">{COMPANIES_DATA.length}</p>
          <span className="text-[10px] text-emerald-600 font-medium">All verified</span>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground">Active Jobs</p>
          <p className="text-2xl font-bold mt-1">{JOBS_DATA.length}</p>
          <span className="text-[10px] text-muted-foreground">Across Nagpur</span>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <p className="text-xs text-muted-foreground">Upcoming Events</p>
          <p className="text-2xl font-bold mt-1">{EVENTS_DATA.length}</p>
          <span className="text-[10px] text-muted-foreground">Next 30 days</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b pb-3 mb-6">
        <button
          onClick={() => setActiveTab("QUEUE")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "QUEUE"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Moderation Queue
          {pendingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-background text-foreground text-[10px] flex items-center justify-center font-bold">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("COMPANIES")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === "COMPANIES"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          All Companies ({COMPANIES_DATA.length})
        </button>

        <button
          onClick={() => setActiveTab("JOBS")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === "JOBS"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          Active Jobs ({JOBS_DATA.length})
        </button>
      </div>

      {/* Tab 1: Moderation Queue */}
      {activeTab === "QUEUE" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Review Submissions</h2>
            <span className="text-xs text-muted-foreground">
              Review company info, verify domain match, check for duplicate listings
            </span>
          </div>

          <div className="space-y-3">
            {queue.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  item.status === "APPROVED"
                    ? "opacity-60 border-emerald-500/40"
                    : item.status === "REJECTED"
                    ? "opacity-40 border-rose-500/40"
                    : ""
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground uppercase">
                      {item.type}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base">{item.title}</h3>
                    {item.status === "APPROVED" && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                      </span>
                    )}
                    {item.status === "REJECTED" && (
                      <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> Rejected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                  <p className="text-[11px] text-muted-foreground/80 mt-1 flex items-center gap-2">
                    <span>From: <strong>{item.submittedBy}</strong></span>
                    <span>•</span>
                    <span>{item.submittedAt}</span>
                  </p>
                </div>

                {item.status === "PENDING" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(item.id, "APPROVED")}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "REJECTED")}
                      className="px-3.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Companies */}
      {activeTab === "COMPANIES" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              placeholder="Search companies by name, sector or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm px-3.5 py-2 text-xs rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-3">Company</th>
                    <th className="p-3">Sector</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Hiring</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {COMPANIES_DATA.filter((c) =>
                    c.name.toLowerCase().includes(search.toLowerCase()) ||
                    c.sector.toLowerCase().includes(search.toLowerCase()) ||
                    c.locationName.toLowerCase().includes(search.toLowerCase())
                  ).map((c) => (
                    <tr key={c.slug} className="hover:bg-muted/20">
                      <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                        {c.name}
                        {c.featured && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 font-bold">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="p-3">{c.sector}</td>
                      <td className="p-3">{c.locationName}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      </td>
                      <td className="p-3">
                        {c.hiring ? (
                          <span className="text-emerald-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/company/${c.slug}`}
                          target="_blank"
                          className="text-primary hover:underline font-semibold"
                        >
                          View Profile →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Active Jobs */}
      {activeTab === "JOBS" && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Policy</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Posted</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {JOBS_DATA.map((job) => (
                  <tr key={job.slug} className="hover:bg-muted/20">
                    <td className="p-3 font-semibold text-foreground">{job.title}</td>
                    <td className="p-3">{job.companyName}</td>
                    <td className="p-3">{job.remoteType.replace("_", " ")}</td>
                    <td className="p-3">{job.department}</td>
                    <td className="p-3 text-muted-foreground">{job.postedAt}</td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/job/${job.slug}`}
                        target="_blank"
                        className="text-primary hover:underline font-semibold"
                      >
                        View Job →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
