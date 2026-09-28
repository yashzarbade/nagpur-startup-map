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
  RefreshCw,
  AlertTriangle,
  Loader2,
  MapPin,
  Check,
  ChevronDown,
  UserCheck,
  UserX,
  ShieldAlert,
  Trash2,
  Edit2,
  Plus,
  Star,
  Eye,
} from "lucide-react";
import {
  approveSubmissionAction,
  rejectSubmissionAction,
  requestChangesSubmissionAction,
  approveClaimAction,
  rejectClaimAction,
  updateUserRoleAction,
  toggleUserStatusAction,
  moderateJobAction,
  moderateEventAction,
  triggerJobSyncAction,
  expireWalkinsAction,
  createCompanyAction,
  updateCompanyAction,
  toggleCompanyStatusAction,
  toggleCompanyFeaturedAction,
  deleteCompanyAction,
  createJobAction,
  updateJobAction,
  createEventAction,
  updateEventAction,
} from "@/app/admin/actions";
import { CompanyModal, JobModal, EventModal } from "@/app/admin/modals";
import { SITE } from "@/lib/constants";

interface AdminClientProps {
  currentUser: any;
  currentProfile: any;
  stats: {
    totalUsers: number;
    pendingSubmissions: number;
    totalCompanies: number;
    activeJobs: number;
    activeWalkins?: number;
    upcomingEvents: number;
    pendingClaims: number;
  };
  submissions: any[];
  claims: any[];
  users: any[];
  companies: any[];
  jobs: any[];
  events: any[];
  syncRuns: any[];
  cities: any[];
  sourceHealth?: any[];
}

export function AdminDashboardClient({
  currentUser,
  currentProfile,
  stats: initialStats,
  submissions: initialSubmissions,
  claims: initialClaims,
  users: initialUsers,
  companies: initialCompanies,
  jobs: initialJobs,
  events: initialEvents,
  syncRuns: initialSyncRuns,
  cities: initialCities,
  sourceHealth: initialSourceHealth = [],
}: AdminClientProps) {
  const [activeTab, setActiveTab] = React.useState<
    "OVERVIEW" | "SUBMISSIONS" | "CLAIMS" | "USERS" | "COMPANIES" | "JOBS" | "EVENTS" | "SYNC" | "CITIES"
  >("OVERVIEW");

  const [submissions, setSubmissions] = React.useState(initialSubmissions);
  const [claims, setClaims] = React.useState(initialClaims);
  const [users, setUsers] = React.useState(initialUsers);
  const [jobs, setJobs] = React.useState(initialJobs);
  const [events, setEvents] = React.useState(initialEvents);
  const [citiesList, setCitiesList] = React.useState(initialCities);
  const [sourceHealth, setSourceHealth] = React.useState(initialSourceHealth);

  // Submissions filter state
  const [subCityFilter, setSubCityFilter] = React.useState<string>("ALL");
  const [subTypeFilter, setSubTypeFilter] = React.useState<string>("ALL");
  const [subStatusFilter, setSubStatusFilter] = React.useState<string>("PENDING");
  const [subSearch, setSubSearch] = React.useState("");

  // Action loading states
  const [actionLoading, setActionLoading] = React.useState<Record<string, boolean>>({});
  const [rejectModal, setRejectModal] = React.useState<{
    open: boolean;
    submissionId?: number;
    claimId?: number;
    type: "SUBMISSION" | "CLAIM" | "CHANGES";
  }>({ open: false, type: "SUBMISSION" });
  const [rejectReason, setRejectReason] = React.useState("");

  // Sync state
  const [syncLoading, setSyncLoading] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState<any>(null);

  // ─── Phase 6: Companies CMS State ───────────────────────────────────────
  const [companiesList, setCompaniesList] = React.useState(initialCompanies);
  const [compCityFilter, setCompCityFilter] = React.useState<string>("ALL");
  const [compStatusFilter, setCompStatusFilter] = React.useState<string>("ALL");
  const [compSearch, setCompSearch] = React.useState("");
  const [companyModalOpen, setCompanyModalOpen] = React.useState(false);
  const [editingCompany, setEditingCompany] = React.useState<any>(null);

  // ─── Phase 6: Jobs CMS State ───────────────────────────────────────────
  const [jobsList, setJobsList] = React.useState(initialJobs);
  const [jobCityFilter, setJobCityFilter] = React.useState<string>("ALL");
  const [jobStatusFilter, setJobStatusFilter] = React.useState<string>("ALL");
  const [jobTypeFilter, setJobTypeFilter] = React.useState<string>("ALL");
  const [jobSearch, setJobSearch] = React.useState("");
  const [jobModalOpen, setJobModalOpen] = React.useState(false);
  const [editingJob, setEditingJob] = React.useState<any>(null);

  // ─── Phase 6: Events CMS State ─────────────────────────────────────────
  const [eventsList, setEventsList] = React.useState(initialEvents);
  const [eventCityFilter, setEventCityFilter] = React.useState<string>("ALL");
  const [eventStatusFilter, setEventStatusFilter] = React.useState<string>("ALL");
  const [eventSearch, setEventSearch] = React.useState("");
  const [eventModalOpen, setEventModalOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<any>(null);

  // ─── Company Handlers ──────────────────────────────────────────────────
  const handleSaveCompany = async (data: any) => {
    if (editingCompany) {
      const res = await updateCompanyAction(editingCompany.id, data);
      if (res.error) throw new Error(res.error);
      setCompaniesList((prev) =>
        prev.map((c) => (c.id === editingCompany.id ? { ...c, ...res.company } : c))
      );
    } else {
      const res = await createCompanyAction(data);
      if (res.error) throw new Error(res.error);
      setCompaniesList((prev) => [res.company, ...prev]);
    }
  };

  const handleToggleCompanyStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "VERIFIED" ? "PENDING" : "VERIFIED";
    setActionLoading((prev) => ({ ...prev, [`comp_status_${id}`]: true }));
    try {
      await toggleCompanyStatusAction(id, nextStatus as any);
      setCompaniesList((prev) =>
        prev.map((c) => (c.id === id ? { ...c, verificationStatus: nextStatus } : c))
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [`comp_status_${id}`]: false }));
    }
  };

  const handleToggleCompanyFeatured = async (id: number, currentFeatured: boolean) => {
    setActionLoading((prev) => ({ ...prev, [`comp_feat_${id}`]: true }));
    try {
      await toggleCompanyFeaturedAction(id, !currentFeatured);
      setCompaniesList((prev) =>
        prev.map((c) => (c.id === id ? { ...c, featured: !currentFeatured } : c))
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [`comp_feat_${id}`]: false }));
    }
  };

  const handleDeleteCompany = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete / archive "${name}"?`)) return;
    setActionLoading((prev) => ({ ...prev, [`comp_del_${id}`]: true }));
    try {
      await deleteCompanyAction(id);
      setCompaniesList((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setActionLoading((prev) => ({ ...prev, [`comp_del_${id}`]: false }));
    }
  };

  // ─── Job Handlers ──────────────────────────────────────────────────────
  const handleSaveJob = async (data: any) => {
    if (editingJob) {
      const res = await updateJobAction(editingJob.id, data);
      if (res.error) throw new Error(res.error);
      setJobsList((prev) =>
        prev.map((j) => (j.id === editingJob.id ? { ...j, ...res.job } : j))
      );
    } else {
      const res = await createJobAction(data);
      if (res.error) throw new Error(res.error);
      setJobsList((prev) => [res.job, ...prev]);
    }
  };

  // ─── Event Handlers ────────────────────────────────────────────────────
  const handleSaveEvent = async (data: any) => {
    if (editingEvent) {
      const res = await updateEventAction(editingEvent.id, data);
      if (res.error) throw new Error(res.error);
      setEventsList((prev) =>
        prev.map((e) => (e.id === editingEvent.id ? { ...e, ...res.event } : e))
      );
    } else {
      const res = await createEventAction(data);
      if (res.error) throw new Error(res.error);
      setEventsList((prev) => [res.event, ...prev]);
    }
  };

  // ─── Filtered Lists ────────────────────────────────────────────────────
  const filteredCompaniesList = React.useMemo(() => {
    return companiesList.filter((c) => {
      if (compCityFilter === "nagpur" && c.cityId !== 1) return false;
      if (compCityFilter === "indore" && c.cityId !== 3) return false;
      if (compCityFilter === "bhopal" && c.cityId !== 6) return false;
      if (compStatusFilter !== "ALL" && (c.verificationStatus || "VERIFIED") !== compStatusFilter) return false;
      if (compSearch) {
        const q = compSearch.toLowerCase();
        const matchName = c.name?.toLowerCase().includes(q);
        const matchSector = c.sector?.toLowerCase().includes(q);
        const matchLoc = c.locationName?.toLowerCase().includes(q);
        if (!matchName && !matchSector && !matchLoc) return false;
      }
      return true;
    });
  }, [companiesList, compCityFilter, compStatusFilter, compSearch]);

  const filteredJobsList = React.useMemo(() => {
    return jobsList.filter((j) => {
      if (jobCityFilter === "nagpur" && j.cityId !== 1) return false;
      if (jobCityFilter === "indore" && j.cityId !== 3) return false;
      if (jobCityFilter === "bhopal" && j.cityId !== 6) return false;
      if (jobStatusFilter !== "ALL" && j.status !== jobStatusFilter) return false;
      if (jobTypeFilter === "WALKIN" && !j.isWalkin) return false;
      if (jobTypeFilter === "REGULAR" && j.isWalkin) return false;
      if (jobSearch) {
        const q = jobSearch.toLowerCase();
        const matchTitle = j.title?.toLowerCase().includes(q);
        const matchLoc = j.location?.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc) return false;
      }
      return true;
    });
  }, [jobsList, jobCityFilter, jobStatusFilter, jobTypeFilter, jobSearch]);

  const filteredEventsList = React.useMemo(() => {
    return eventsList.filter((e) => {
      if (eventCityFilter === "nagpur" && e.cityId !== 1) return false;
      if (eventCityFilter === "indore" && e.cityId !== 3) return false;
      if (eventCityFilter === "bhopal" && e.cityId !== 6) return false;
      if (eventStatusFilter !== "ALL" && e.status !== eventStatusFilter) return false;
      if (eventSearch) {
        const q = eventSearch.toLowerCase();
        const matchTitle = e.title?.toLowerCase().includes(q);
        const matchOrg = e.organizer?.toLowerCase().includes(q);
        if (!matchTitle && !matchOrg) return false;
      }
      return true;
    });
  }, [eventsList, eventCityFilter, eventStatusFilter, eventSearch]);

  // ─── Submissions Filter Logic ──────────────────────────────────────────
  const filteredSubmissions = React.useMemo(() => {
    return submissions.filter((sub) => {
      if (subCityFilter === "nagpur" && sub.cityId !== 1) return false;
      if (subCityFilter === "indore" && sub.cityId !== 3) return false;
      if (subTypeFilter !== "ALL" && sub.type !== subTypeFilter) return false;
      if (subStatusFilter !== "ALL" && sub.status !== subStatusFilter) return false;
      if (subSearch) {
        const title = (sub.data?.name || sub.data?.title || "").toLowerCase();
        const email = (sub.submitterEmail || "").toLowerCase();
        if (!title.includes(subSearch.toLowerCase()) && !email.includes(subSearch.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [submissions, subCityFilter, subTypeFilter, subStatusFilter, subSearch]);

  // ─── Handler: Approve Submission ───────────────────────────────────────
  const handleApproveSubmission = async (id: number) => {
    setActionLoading((prev) => ({ ...prev, [`sub_${id}`]: true }));
    try {
      const res = await approveSubmissionAction(id);
      if (res.success) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "APPROVED" } : s))
        );
      } else {
        alert(res.error || "Failed to approve");
      }
    } catch (err: any) {
      alert(err.message || "Approval failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, [`sub_${id}`]: false }));
    }
  };

  // ─── Handler: Reject / Request Changes Submission ──────────────────────
  const handleConfirmReject = async () => {
    const reason = rejectReason.trim();
    if (!reason) return;
    const { submissionId, claimId, type } = rejectModal;

    if (type === "SUBMISSION" && submissionId) {
      setActionLoading((prev) => ({ ...prev, [`sub_${submissionId}`]: true }));
      await rejectSubmissionAction(submissionId, reason);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, status: "REJECTED", rejectionReason: reason } : s))
      );
    } else if (type === "CHANGES" && submissionId) {
      setActionLoading((prev) => ({ ...prev, [`sub_${submissionId}`]: true }));
      await requestChangesSubmissionAction(submissionId, reason);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, status: "CHANGES_REQUESTED", rejectionReason: reason } : s))
      );
    } else if (type === "CLAIM" && claimId) {
      setActionLoading((prev) => ({ ...prev, [`claim_${claimId}`]: true }));
      await rejectClaimAction(claimId, reason);
      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status: "REJECTED", rejectionReason: reason } : c))
      );
    }

    setRejectModal({ open: false, type: "SUBMISSION" });
    setRejectReason("");
    setActionLoading({});
  };

  // ─── Handler: Approve Claim ───────────────────────────────────────────
  const handleApproveClaim = async (id: number) => {
    setActionLoading((prev) => ({ ...prev, [`claim_${id}`]: true }));
    try {
      const res = await approveClaimAction(id);
      if (res.success) {
        setClaims((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "APPROVED" } : c))
        );
      } else {
        alert(res.error || "Failed to approve claim");
      }
    } catch (err: any) {
      alert(err.message || "Claim approval failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, [`claim_${id}`]: false }));
    }
  };

  // ─── Handler: Update User Role ─────────────────────────────────────────
  const handleRoleChange = async (userId: string, newRole: "USER" | "COMPANY" | "ADMIN") => {
    setActionLoading((prev) => ({ ...prev, [`user_${userId}`]: true }));
    try {
      await updateUserRoleAction(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, role: newRole } : u))
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [`user_${userId}`]: false }));
    }
  };

  // ─── Handler: Toggle User Status ───────────────────────────────────────
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
    setActionLoading((prev) => ({ ...prev, [`user_status_${userId}`]: true }));
    try {
      await toggleUserStatusAction(userId, nextStatus as any);
      setUsers((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, status: nextStatus } : u))
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [`user_status_${userId}`]: false }));
    }
  };

  // ─── Handler: Moderate Job ─────────────────────────────────────────────
  const handleModerateJob = async (id: number, action: "EXPIRE" | "ACTIVATE" | "DELETE") => {
    if (action === "DELETE" && !confirm("Are you sure you want to delete this job?")) return;
    await moderateJobAction(id, action);
    if (action === "DELETE") {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } else {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id ? { ...j, status: action === "EXPIRE" ? "EXPIRED" : "ACTIVE" } : j
        )
      );
    }
  };

  // ─── Handler: Moderate Event ───────────────────────────────────────────
  const handleModerateEvent = async (id: number, action: "CANCEL" | "ACTIVATE" | "DELETE") => {
    if (action === "DELETE" && !confirm("Are you sure you want to delete this event?")) return;
    await moderateEventAction(id, action);
    if (action === "DELETE") {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } else {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: action === "CANCEL" ? "CANCELLED" : "UPCOMING" } : e
        )
      );
    }
  };

  // ─── Handler: Trigger Sync ─────────────────────────────────────────────
  const handleTriggerSync = async () => {
    setSyncLoading(true);
    setSyncResult(null);
    try {
      const res = await triggerJobSyncAction();
      if (res.success) {
        setSyncResult(res.result);
      } else {
        alert(res.error || "Sync failed");
      }
    } catch (err: any) {
      alert(err.message || "Sync execution error");
    } finally {
      setSyncLoading(false);
    }
  };

  // ─── Handler: Expire Past Walk-ins ──────────────────────────────────────
  const [expireLoading, setExpireLoading] = React.useState(false);
  const [expireResult, setExpireResult] = React.useState<number | null>(null);

  const handleExpireWalkins = async () => {
    setExpireLoading(true);
    setExpireResult(null);
    try {
      const res = await expireWalkinsAction();
      if (res.success) {
        setExpireResult(res.expiredCount ?? 0);
        // refresh jobs locally
        setJobs((prev) =>
          prev.map((j) =>
            j.isWalkin && j.walkinDate && new Date(j.walkinDate) < new Date()
              ? { ...j, status: "EXPIRED" }
              : j
          )
        );
      } else {
        alert(res.error || "Failed to expire walk-ins");
      }
    } catch (err: any) {
      alert(err.message || "Execution error");
    } finally {
      setExpireLoading(false);
    }
  };

  return (
    <div className="container-page py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Admin Console &amp; Moderation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {SITE.name} Control Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Logged in as {currentProfile.fullName || currentProfile.email} (Role: {currentProfile.role})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerSync}
            disabled={syncLoading}
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xs hover:bg-accent transition-colors disabled:opacity-60"
          >
            {syncLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 text-primary" />
            )}
            <span>Sync Jobs Now</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Public Site</span>
          </Link>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-1 border-b pb-2 text-xs font-semibold">
        {[
          { id: "OVERVIEW", label: "Overview", icon: Sparkles },
          {
            id: "SUBMISSIONS",
            label: "Submissions Queue",
            icon: Clock,
            badge: submissions.filter((s) => s.status === "PENDING").length,
          },
          {
            id: "CLAIMS",
            label: "Company Claims",
            icon: Building2,
            badge: claims.filter((c) => c.status === "PENDING").length,
          },
          { id: "USERS", label: "Users & Roles", icon: Users, count: users.length },
          { id: "COMPANIES", label: "Companies", icon: Building2, count: initialCompanies.length },
          { id: "JOBS", label: "Jobs Moderation", icon: Briefcase, count: jobs.length },
          { id: "EVENTS", label: "Events", icon: Calendar, count: events.length },
          { id: "SYNC", label: "Job Sync Runs", icon: RefreshCw },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? "bg-white text-primary" : "bg-red-500 text-white"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-2xl border bg-card p-4 shadow-2xs">
              <div className="text-[11px] text-muted-foreground">Pending Submissions</div>
              <div className="text-2xl font-bold text-amber-500">
                {submissions.filter((s) => s.status === "PENDING").length}
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-2xs">
              <div className="text-[11px] text-muted-foreground">Pending Claims</div>
              <div className="text-2xl font-bold text-blue-500">
                {claims.filter((c) => c.status === "PENDING").length}
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-2xs">
              <div className="text-[11px] text-muted-foreground">Registered Users</div>
              <div className="text-2xl font-bold text-foreground">{users.length}</div>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-2xs">
              <div className="text-[11px] text-muted-foreground">Total Companies</div>
              <div className="text-2xl font-bold text-foreground">{initialCompanies.length}</div>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-2xs">
              <div className="text-[11px] text-muted-foreground">Active Jobs</div>
              <div className="text-2xl font-bold text-emerald-500">{jobs.length}</div>
            </div>
            <div className="rounded-2xl border bg-card p-4 shadow-2xs">
              <div className="text-[11px] text-muted-foreground">Upcoming Events</div>
              <div className="text-2xl font-bold text-purple-500">{events.length}</div>
            </div>
          </div>

          {/* Quick Submissions Review Table */}
          <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">
                Submissions Awaiting Review
              </h2>
              <button
                onClick={() => setActiveTab("SUBMISSIONS")}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Go to Queue ({submissions.filter((s) => s.status === "PENDING").length})
              </button>
            </div>

            {submissions.filter((s) => s.status === "PENDING").length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                🎉 Moderation queue is clear! No pending submissions.
              </div>
            ) : (
              <div className="divide-y">
                {submissions
                  .filter((s) => s.status === "PENDING")
                  .slice(0, 5)
                  .map((sub) => (
                    <div key={sub.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {sub.data?.name || sub.data?.title || `${sub.type} Submission`}
                          </span>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold">
                            {sub.type}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            ({sub.cityId === 3 ? "Indore" : "Nagpur"})
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          By {sub.submitterEmail || "User"} •{" "}
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveSubmission(sub.id)}
                          disabled={actionLoading[`sub_${sub.id}`]}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700 shadow-2xs transition-colors disabled:opacity-60"
                        >
                          Approve &amp; Publish
                        </button>
                        <button
                          onClick={() =>
                            setRejectModal({
                              open: true,
                              submissionId: sub.id,
                              type: "SUBMISSION",
                            })
                          }
                          className="rounded-lg border border-red-500/30 text-red-600 px-3 py-1.5 text-[11px] font-semibold hover:bg-red-500/10 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SUBMISSIONS QUEUE */}
      {activeTab === "SUBMISSIONS" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border bg-card shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={subCityFilter}
                onChange={(e) => setSubCityFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <option value="ALL">All Cities</option>
                <option value="nagpur">Nagpur</option>
                <option value="indore">Indore</option>
              </select>

              <select
                value={subTypeFilter}
                onChange={(e) => setSubTypeFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <option value="ALL">All Types</option>
                <option value="COMPANY">Startups / Companies</option>
                <option value="JOB">Jobs</option>
                <option value="EVENT">Events</option>
                <option value="FOUNDER">Founders</option>
              </select>

              <select
                value={subStatusFilter}
                onChange={(e) => setSubStatusFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Review</option>
                <option value="APPROVED">Approved &amp; Published</option>
                <option value="REJECTED">Rejected</option>
                <option value="CHANGES_REQUESTED">Changes Requested</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                placeholder="Search submissions..."
                className="rounded-xl border bg-background py-1.5 pl-8 pr-3 text-xs w-48 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Submissions List */}
          {filteredSubmissions.length === 0 ? (
            <div className="rounded-2xl border bg-card p-12 text-center text-xs text-muted-foreground">
              No submissions matching the current filter criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-2xl border bg-card p-5 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-foreground">
                          {sub.data?.name || sub.data?.title || `${sub.type} #${sub.id}`}
                        </span>
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          {sub.type}
                        </span>
                        <span className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold">
                          {sub.cityId === 3 ? "Indore" : "Nagpur"}
                        </span>
                        <SubmissionStatusBadge status={sub.status} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Submitted by: {sub.submitterEmail || sub.userId || "Anonymous"} •{" "}
                        {new Date(sub.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {sub.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApproveSubmission(sub.id)}
                            disabled={actionLoading[`sub_${sub.id}`]}
                            className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-2xs transition-colors disabled:opacity-60 flex items-center gap-1.5"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Approve &amp; Publish</span>
                          </button>

                          <button
                            onClick={() =>
                              setRejectModal({
                                open: true,
                                submissionId: sub.id,
                                type: "CHANGES",
                              })
                            }
                            className="rounded-xl border bg-muted px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors"
                          >
                            Request Changes
                          </button>

                          <button
                            onClick={() =>
                              setRejectModal({
                                open: true,
                                submissionId: sub.id,
                                type: "SUBMISSION",
                              })
                            }
                            className="rounded-xl border border-red-500/30 text-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-500/10 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Submission payload preview */}
                  <div className="rounded-xl bg-muted/30 p-3 text-xs font-mono space-y-1 text-muted-foreground overflow-x-auto">
                    {sub.data &&
                      Object.entries(sub.data)
                        .filter(([k]) => !["descriptionLong"].includes(k))
                        .map(([k, v]) => (
                          <div key={k}>
                            <strong className="text-foreground">{k}:</strong>{" "}
                            {typeof v === "object" ? JSON.stringify(v) : String(v)}
                          </div>
                        ))}
                    {sub.data?.descriptionLong && (
                      <div>
                        <strong className="text-foreground">descriptionLong:</strong>{" "}
                        {String(sub.data.descriptionLong)}
                      </div>
                    )}
                  </div>

                  {sub.rejectionReason && (
                    <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-xl">
                      <strong>Moderation Note:</strong> {sub.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMPANY CLAIMS */}
      {activeTab === "CLAIMS" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Company Ownership Claims</h2>
            <span className="text-xs text-muted-foreground">
              {claims.filter((c) => c.status === "PENDING").length} pending claims
            </span>
          </div>

          {claims.length === 0 ? (
            <div className="rounded-2xl border bg-card p-12 text-center text-xs text-muted-foreground">
              No company claim requests submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="rounded-2xl border bg-card p-5 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">
                          Claim for Company #{claim.companyId}
                        </span>
                        <SubmissionStatusBadge status={claim.status} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Claimed by: <strong>{claim.name}</strong> ({claim.role || "Owner"}) •{" "}
                        {claim.email} • {new Date(claim.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {claim.status === "PENDING" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveClaim(claim.id)}
                          disabled={actionLoading[`claim_${claim.id}`]}
                          className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-2xs transition-colors disabled:opacity-60 flex items-center gap-1.5"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Approve Claim</span>
                        </button>
                        <button
                          onClick={() =>
                            setRejectModal({
                              open: true,
                              claimId: claim.id,
                              type: "CLAIM",
                            })
                          }
                          className="rounded-xl border border-red-500/30 text-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-500/10 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {claim.evidence && (
                    <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                      <strong>Verification Evidence:</strong> {claim.evidence}
                    </div>
                  )}

                  {claim.linkedinUrl && (
                    <div className="text-xs text-muted-foreground">
                      LinkedIn:{" "}
                      <a
                        href={claim.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        {claim.linkedinUrl}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: USERS & ROLES */}
      {activeTab === "USERS" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Registered Users ({users.length})</h2>
            <p className="text-xs text-muted-foreground">
              Manage permissions, company account upgrades, and user access.
            </p>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b text-[11px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/20">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">
                          {u.fullName || "User"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          @{u.username || "anon"} • {u.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                            u.role === "ADMIN"
                              ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                              : u.role === "COMPANY"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            u.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {u.city || "—"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.userId, e.target.value as any)}
                            disabled={actionLoading[`user_${u.userId}`]}
                            className="rounded-lg border bg-background py-1 px-2 text-[11px]"
                          >
                            <option value="USER">USER</option>
                            <option value="COMPANY">COMPANY</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>

                          <button
                            onClick={() => handleToggleUserStatus(u.userId, u.status)}
                            disabled={actionLoading[`user_status_${u.userId}`]}
                            className={`p-1.5 rounded-lg border text-[10px] font-semibold ${
                              u.status === "ACTIVE"
                                ? "text-red-600 border-red-500/20 hover:bg-red-500/10"
                                : "text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10"
                            }`}
                            title={u.status === "ACTIVE" ? "Disable User" : "Enable User"}
                          >
                            {u.status === "ACTIVE" ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMPANIES CMS */}
      {activeTab === "COMPANIES" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Central India Company Directory ({filteredCompaniesList.length} / {companiesList.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Live database records across Nagpur, Indore, and Bhopal. Direct production management.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingCompany(null);
                setCompanyModalOpen(true);
              }}
              className="rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-colors w-fit"
            >
              <Plus className="h-4 w-4" />
              <span>Add Company / Startup</span>
            </button>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border bg-card shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={compCityFilter}
                onChange={(e) => setCompCityFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <option value="ALL">All Cities</option>
                <option value="nagpur">Nagpur (73+)</option>
                <option value="indore">Indore (150+)</option>
                <option value="bhopal">Bhopal (10+)</option>
              </select>

              <select
                value={compStatusFilter}
                onChange={(e) => setCompStatusFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="VERIFIED">VERIFIED (Live)</option>
                <option value="PENDING">PENDING</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={compSearch}
                onChange={(e) => setCompSearch(e.target.value)}
                placeholder="Search companies, sector, location..."
                className="rounded-xl border bg-background py-1.5 pl-8 pr-3 text-xs w-60 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Companies Table */}
          <div className="rounded-2xl border bg-card overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b text-[11px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Sector &amp; Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCompaniesList.slice(0, 100).map((c) => (
                    <tr key={c.id} className="hover:bg-muted/20">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{c.name}</span>
                          {c.websiteUrl && (
                            <a
                              href={c.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground hover:text-primary"
                              title="Official Website"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-normal line-clamp-1">
                          {c.locationName || c.address || "Central India"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground">
                          {c.cityId === 3 ? "Indore" : c.cityId === 6 ? "Bhopal" : "Nagpur"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <div>{c.sector || "Software"}</div>
                        <div className="text-[10px] text-muted-foreground/80">{c.companyType || "Startup"}</div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleCompanyStatus(c.id, c.verificationStatus || "VERIFIED")}
                          disabled={actionLoading[`comp_status_${c.id}`]}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-transform active:scale-95 cursor-pointer ${
                            c.verificationStatus === "VERIFIED"
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              : c.verificationStatus === "PENDING"
                              ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                              : "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                          }`}
                          title="Click to toggle status"
                        >
                          {c.verificationStatus || "VERIFIED"}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleCompanyFeatured(c.id, !!c.featured)}
                          disabled={actionLoading[`comp_feat_${c.id}`]}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            c.featured
                              ? "text-amber-500 hover:text-amber-600"
                              : "text-muted-foreground/40 hover:text-muted-foreground"
                          }`}
                          title={c.featured ? "Featured (Click to unfeature)" : "Not featured (Click to feature)"}
                        >
                          <Star className={`h-4 w-4 ${c.featured ? "fill-amber-500" : ""}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingCompany(c);
                              setCompanyModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border text-muted-foreground hover:text-primary hover:bg-muted"
                            title="Edit Company Details"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <Link
                            href={`/company/${c.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border text-muted-foreground hover:text-primary hover:bg-muted"
                            title="View Public Profile"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteCompany(c.id, c.name)}
                            disabled={actionLoading[`comp_del_${c.id}`]}
                            className="p-1.5 rounded-lg border text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                            title="Delete / Archive Company"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredCompaniesList.length > 100 && (
              <div className="p-3 bg-muted/30 border-t text-center text-xs text-muted-foreground">
                Showing top 100 of {filteredCompaniesList.length} companies. Use search to find specific records.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: JOBS CMS */}
      {activeTab === "JOBS" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Jobs &amp; Walk-In Management ({filteredJobsList.length} / {jobsList.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage automated listings, direct employer postings, and upcoming walk-in drives.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingJob(null);
                setJobModalOpen(true);
              }}
              className="rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-colors w-fit"
            >
              <Plus className="h-4 w-4" />
              <span>Create Job / Walk-In</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border bg-card shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={jobCityFilter}
                onChange={(e) => setJobCityFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <option value="ALL">All Cities</option>
                <option value="nagpur">Nagpur</option>
                <option value="indore">Indore</option>
                <option value="bhopal">Bhopal</option>
              </select>

              <select
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <option value="ALL">All Listing Types</option>
                <option value="WALKIN">Walk-In Drives Only</option>
                <option value="REGULAR">Regular Jobs</option>
              </select>

              <select
                value={jobStatusFilter}
                onChange={(e) => setJobStatusFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Search job title or location..."
                className="rounded-xl border bg-background py-1.5 pl-8 pr-3 text-xs w-56 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b text-[11px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Type &amp; Remote</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Posted</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredJobsList.slice(0, 100).map((job) => (
                    <tr key={job.id} className="hover:bg-muted/20">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        <div className="flex items-center gap-1.5">
                          <span>{job.title}</span>
                          {job.isWalkin && (
                            <span className="rounded-md bg-purple-500/10 text-purple-600 px-1.5 py-0.5 text-[9px] font-bold">
                              Walk-In
                            </span>
                          )}
                        </div>
                        {job.isWalkin && job.walkinDate && (
                          <div className="text-[10px] text-purple-600/80 font-normal mt-0.5">
                            📅 {new Date(job.walkinDate).toLocaleDateString()} • {job.walkinStartTime || "10 AM"}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {job.cityId === 3 ? "Indore" : job.cityId === 6 ? "Bhopal" : "Nagpur"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {job.employmentType} • {job.remoteType}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            job.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(job.postedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingJob(job);
                              setJobModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border text-muted-foreground hover:text-primary hover:bg-muted"
                            title="Edit Job"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          {job.status === "ACTIVE" ? (
                            <button
                              onClick={() => handleModerateJob(job.id, "EXPIRE")}
                              className="px-2 py-1 rounded-md border text-amber-600 hover:bg-amber-500/10 text-[11px] font-semibold"
                            >
                              Expire
                            </button>
                          ) : (
                            <button
                              onClick={() => handleModerateJob(job.id, "ACTIVATE")}
                              className="px-2 py-1 rounded-md border text-emerald-600 hover:bg-emerald-500/10 text-[11px] font-semibold"
                            >
                              Activate
                            </button>
                          )}
                          <Link
                            href={`/job/${job.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border text-muted-foreground hover:text-primary hover:bg-muted"
                            title="View Job"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleModerateJob(job.id, "DELETE")}
                            className="p-1.5 rounded-lg border text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: EVENTS CMS */}
      {activeTab === "EVENTS" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Community Events &amp; Meetups ({filteredEventsList.length} / {eventsList.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage tech meetups, hackathons, and demo days across Central India.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingEvent(null);
                setEventModalOpen(true);
              }}
              className="rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-colors w-fit"
            >
              <Plus className="h-4 w-4" />
              <span>Create Event</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border bg-card shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={eventCityFilter}
                onChange={(e) => setEventCityFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <option value="ALL">All Cities</option>
                <option value="nagpur">Nagpur</option>
                <option value="indore">Indore</option>
                <option value="bhopal">Bhopal</option>
              </select>

              <select
                value={eventStatusFilter}
                onChange={(e) => setEventStatusFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-1.5 text-xs font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="UPCOMING">UPCOMING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                placeholder="Search event title or organizer..."
                className="rounded-xl border bg-background py-1.5 pl-8 pr-3 text-xs w-56 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b text-[11px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredEventsList.map((ev) => (
                    <tr key={ev.id} className="hover:bg-muted/20">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {ev.title}
                        <div className="text-[11px] text-muted-foreground font-normal">
                          {ev.organizer} • {ev.venue || ev.location}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {ev.cityId === 3 ? "Indore" : ev.cityId === 6 ? "Bhopal" : "Nagpur"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(ev.date).toLocaleDateString()} {ev.startTime ? `• ${ev.startTime}` : ""}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            ev.status === "UPCOMING"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingEvent(ev);
                              setEventModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border text-muted-foreground hover:text-primary hover:bg-muted"
                            title="Edit Event"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          {ev.status === "UPCOMING" ? (
                            <button
                              onClick={() => handleModerateEvent(ev.id, "CANCEL")}
                              className="px-2 py-1 rounded-md border text-amber-600 hover:bg-amber-500/10 text-[11px] font-semibold"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              onClick={() => handleModerateEvent(ev.id, "ACTIVATE")}
                              className="px-2 py-1 rounded-md border text-emerald-600 hover:bg-emerald-500/10 text-[11px] font-semibold"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => handleModerateEvent(ev.id, "DELETE")}
                            className="p-1.5 rounded-lg border text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: SYNC RUNS & JOB AUTOMATION */}
      {activeTab === "SYNC" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Central India Job Automation & Walk-In Monitor</h2>
              <p className="text-xs text-muted-foreground">
                Multi-source automation across JobSpy (Indeed, LinkedIn, Naukri), ATS integrations (Greenhouse, Lever, Ashby, Workable), and Telegram public channels.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExpireWalkins}
                disabled={expireLoading}
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 shadow-2xs hover:bg-amber-500/20 disabled:opacity-60 transition-colors"
              >
                {expireLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Clock className="h-3.5 w-3.5" />
                )}
                <span>Clean Expired Walk-Ins</span>
              </button>

              <button
                onClick={handleTriggerSync}
                disabled={syncLoading}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground flex items-center gap-1.5 shadow-2xs hover:bg-primary/90 disabled:opacity-60 transition-colors"
              >
                {syncLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                <span>Trigger ATS Sync</span>
              </button>
            </div>
          </div>

          {/* Action Results */}
          {syncResult && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs space-y-1">
              <div className="font-bold text-emerald-700 dark:text-emerald-300">
                ✅ Job Sync Run Completed Successfully:
              </div>
              <div className="text-emerald-800 dark:text-emerald-200">
                Companies Checked: {syncResult.companiesChecked} • Jobs Found: {syncResult.jobsFound} • Created: {syncResult.jobsCreated} • Updated: {syncResult.jobsUpdated} • Expired: {syncResult.jobsExpired}
              </div>
            </div>
          )}

          {expireResult !== null && (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs space-y-1">
              <div className="font-bold text-blue-700 dark:text-blue-300">
                ℹ️ Walk-in Expiration Sweep Completed:
              </div>
              <div className="text-blue-800 dark:text-blue-200">
                {expireResult} past walk-in listing(s) expired and removed from active discovery.
              </div>
            </div>
          )}

          {/* Source Architecture Status Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">Configured Ingestion Sources</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Indeed", type: "JobSpy Python", status: "ACTIVE", badge: "Live Ingestion", desc: "Nagpur, Indore, Bhopal" },
                { name: "LinkedIn", type: "JobSpy Python", status: "ISOLATED", badge: "Rate Protected", desc: "Auth-safe fallback" },
                { name: "Naukri", type: "JobSpy Python", status: "ISOLATED", badge: "Access Protected", desc: "Non-blocking errors" },
                { name: "Greenhouse", type: "Public ATS API", status: "ACTIVE", badge: "Auto-Polling", desc: "Direct ATS feed" },
                { name: "Lever", type: "Public ATS API", status: "ACTIVE", badge: "Auto-Polling", desc: "Direct ATS feed" },
                { name: "Ashby", type: "Public ATS API", status: "ACTIVE", badge: "Auto-Polling", desc: "Direct ATS feed" },
                { name: "Workable", type: "Public ATS API", status: "ACTIVE", badge: "Auto-Polling", desc: "Direct ATS feed" },
                { name: "Telegram", type: "Telethon Client", status: "CONFIGURABLE", badge: "Safe Read-Only", desc: "Configurable channels" },
              ].map((s) => (
                <div key={s.name} className="rounded-2xl border bg-card p-3.5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{s.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                        s.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : s.status === "CONFIGURABLE"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {s.badge}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">{s.type}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* City Coverage Metrics */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">City Ecosystem Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { city: "Nagpur, Maharashtra", slug: "nagpur", id: 1 },
                { city: "Indore, Madhya Pradesh", slug: "indore", id: 3 },
                { city: "Bhopal, Madhya Pradesh", slug: "bhopal", id: 6 },
              ].map((c) => {
                const cityJobs = jobs.filter((j) => j.cityId === c.id);
                const activeCount = cityJobs.filter((j) => j.status === "ACTIVE").length;
                const walkinCount = cityJobs.filter((j) => j.status === "ACTIVE" && j.isWalkin).length;
                return (
                  <div key={c.slug} className="rounded-2xl border bg-card p-4 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>{c.city}</span>
                      </div>
                      <Link
                        href={`/walkins/${c.slug}`}
                        className="text-[11px] text-primary hover:underline font-semibold"
                      >
                        View Walk-Ins →
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t text-center">
                      <div>
                        <div className="text-lg font-bold text-foreground">{activeCount}</div>
                        <div className="text-[10px] text-muted-foreground">Active Jobs</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{walkinCount}</div>
                        <div className="text-[10px] text-muted-foreground">Active Walk-Ins</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-Time Source Health Logs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">Source Health Log &amp; Metrics</h3>
            {sourceHealth && sourceHealth.length > 0 ? (
              <div className="rounded-2xl border bg-card overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b text-[11px] font-bold text-muted-foreground uppercase">
                      <tr>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4">City</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Discovered</th>
                        <th className="py-3 px-4">Inserted</th>
                        <th className="py-3 px-4">Updated</th>
                        <th className="py-3 px-4">Notes</th>
                        <th className="py-3 px-4">Last Sync</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {sourceHealth.map((log: any) => (
                        <tr key={log.id} className="hover:bg-muted/20">
                          <td className="py-3 px-4 font-semibold text-foreground">
                            {log.sourceName || log.sourceType}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground uppercase font-mono text-[11px]">
                            {log.citySlug || "Global"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                log.status === "SUCCESS" || log.status === "ACTIVE"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : log.status === "ERROR"
                                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-foreground">{log.jobsDiscovered}</td>
                          <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                            {log.jobsInserted}
                          </td>
                          <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-bold">
                            {log.jobsUpdated}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground max-w-xs truncate text-[11px]">
                            {log.errorSummary || "OK"}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-[11px]">
                            {log.updatedAt ? new Date(log.updatedAt).toLocaleString() : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border bg-card p-6 text-center text-xs text-muted-foreground">
                No automation health runs logged yet. Execute Job Automation to populate metrics.
              </div>
            )}
          </div>

          {/* Historical ATS Sync Runs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground">ATS Sync Run History</h3>
            <div className="rounded-2xl border bg-card overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b text-[11px] font-bold text-muted-foreground uppercase">
                    <tr>
                      <th className="py-3 px-4">Run ID</th>
                      <th className="py-3 px-4">Started</th>
                      <th className="py-3 px-4">Trigger</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Checked</th>
                      <th className="py-3 px-4">Created</th>
                      <th className="py-3 px-4">Updated</th>
                      <th className="py-3 px-4">Expired</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {initialSyncRuns.map((run) => (
                      <tr key={run.id} className="hover:bg-muted/20">
                        <td className="py-3 px-4 font-mono font-semibold">#{run.id}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(run.startedAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {run.triggeredBy}
                        </td>
                        <td className="py-3 px-4">
                          <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                            {run.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{run.companiesChecked}</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">{run.jobsCreated}</td>
                        <td className="py-3 px-4 text-blue-600">{run.jobsUpdated}</td>
                        <td className="py-3 px-4 text-amber-600">{run.jobsExpired}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT / CHANGES MODAL */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-foreground">
              {rejectModal.type === "CHANGES"
                ? "Request Changes from Submitter"
                : "Reject Submission"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {rejectModal.type === "CHANGES"
                ? "Specify what changes or corrections the submitter needs to make."
                : "Provide a reason for rejection (this will be sent to the user)."}
            </p>

            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Please provide a working careers page URL or official verification link..."
              className="w-full rounded-xl border bg-background py-2 px-3 text-xs focus:ring-2 focus:ring-primary focus:outline-hidden"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModal({ open: false, type: "SUBMISSION" })}
                className="rounded-xl border bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CMS Modals */}
      <CompanyModal
        isOpen={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onSave={handleSaveCompany}
        initialData={editingCompany}
      />

      <JobModal
        isOpen={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
        onSave={handleSaveJob}
        companies={companiesList}
        initialData={editingJob}
      />

      <EventModal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        onSave={handleSaveEvent}
        initialData={editingEvent}
      />
    </div>
  );
}

function SubmissionStatusBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/20">
        Approved
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="rounded-full bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 text-[10px] font-bold border border-red-500/20">
        Rejected
      </span>
    );
  }
  if (status === "CHANGES_REQUESTED") {
    return (
      <span className="rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[10px] font-bold border border-amber-500/20">
        Changes Requested
      </span>
    );
  }
  return (
    <span className="rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-[10px] font-bold border border-blue-500/20">
      Pending
    </span>
  );
}
