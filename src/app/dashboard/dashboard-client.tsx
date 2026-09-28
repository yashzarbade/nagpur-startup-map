"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  FileText,
  Bookmark,
  Bell,
  Building2,
  Briefcase,
  Calendar,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  Plus,
  ShieldCheck,
  MapPin,
  Trash2,
} from "lucide-react";
import {
  updateProfileAction,
  toggleSaveJobAction,
  toggleSaveCompanyAction,
  markNotificationReadAction,
} from "@/app/auth/actions";
import type { UserProfile, Submission, Notification } from "@/types";

interface DashboardClientProps {
  profile: UserProfile;
  submissions: any[];
  claims: any[];
  savedJobs: any[];
  savedCompanies: any[];
  notifications: Notification[];
  initialTab?: string;
}

export function DashboardClient({
  profile,
  submissions: initialSubmissions,
  claims: initialClaims,
  savedJobs: initialSavedJobs,
  savedCompanies: initialSavedCompanies,
  notifications: initialNotifications,
  initialTab = "overview",
}: DashboardClientProps) {
  const [tab, setTab] = React.useState<string>(initialTab);
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [profileMessage, setProfileMessage] = React.useState<string | null>(null);
  const [profileError, setProfileError] = React.useState<string | null>(null);

  const [savedJobs, setSavedJobs] = React.useState(initialSavedJobs);
  const [savedCompanies, setSavedCompanies] = React.useState(initialSavedCompanies);
  const [notifications, setNotifications] = React.useState(initialNotifications);

  // Profile Form state
  const [fullName, setFullName] = React.useState(profile.fullName || "");
  const [username, setUsername] = React.useState(profile.username || "");
  const [bio, setBio] = React.useState(profile.bio || "");
  const [location, setLocation] = React.useState(profile.location || "");
  const [city, setCity] = React.useState(profile.city || "");
  const [skills, setSkills] = React.useState(profile.skills || "");
  const [linkedinUrl, setLinkedinUrl] = React.useState(profile.linkedinUrl || "");
  const [githubUrl, setGithubUrl] = React.useState(profile.githubUrl || "");
  const [portfolioUrl, setPortfolioUrl] = React.useState(profile.portfolioUrl || "");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    setProfileError(null);

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("city", city);
    formData.append("skills", skills);
    formData.append("linkedinUrl", linkedinUrl);
    formData.append("githubUrl", githubUrl);
    formData.append("portfolioUrl", portfolioUrl);

    try {
      const res = await updateProfileAction(formData);
      if (res.error) {
        setProfileError(res.error);
      } else {
        setProfileMessage("Profile updated successfully!");
      }
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRemoveSavedJob = async (jobId: number) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
    await toggleSaveJobAction(jobId);
  };

  const handleRemoveSavedCompany = async (companyId: number) => {
    setSavedCompanies((prev) => prev.filter((c) => c.id !== companyId));
    await toggleSaveCompanyAction(companyId);
  };

  const handleMarkNotification = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markNotificationReadAction(id);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container-page py-8 sm:py-12">
      {/* Header Banner */}
      <div className="rounded-3xl border bg-card p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl font-bold border border-primary/20 shadow-2xs">
              {profile.fullName?.charAt(0) || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {profile.fullName || "User Dashboard"}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                    profile.role === "ADMIN"
                      ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                      : profile.role === "COMPANY"
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {profile.role}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                @{profile.username || "user"} • {profile.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {profile.username && (
              <Link
                href={`/profile/${profile.username}`}
                className="inline-flex items-center gap-1.5 rounded-xl border bg-muted/60 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                <span>View Public Profile</span>
              </Link>
            )}
            <Link
              href="/submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Submit Content</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setTab("overview")}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold text-left transition-all ${
              tab === "overview"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4" />
              <span>Overview</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTab("submissions")}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold text-left transition-all ${
              tab === "submissions"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-4 w-4" />
              <span>My Submissions</span>
            </div>
            <span className="text-[11px] opacity-80">
              {initialSubmissions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("saved")}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold text-left transition-all ${
              tab === "saved"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="h-4 w-4" />
              <span>Saved Items</span>
            </div>
            <span className="text-[11px] opacity-80">
              {savedJobs.length + savedCompanies.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab("notifications")}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold text-left transition-all ${
              tab === "notifications"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setTab("profile")}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold text-left transition-all ${
              tab === "profile"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4" />
              <span>Edit Profile</span>
            </div>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border bg-card p-5 shadow-2xs">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Submissions Made
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {initialSubmissions.length}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {initialSubmissions.filter((s) => s.status === "APPROVED").length} published
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-2xs">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Bookmarked Jobs
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {savedJobs.length}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Active roles saved
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-5 shadow-2xs">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Saved Companies
                  </div>
                  <div className="text-2xl font-bold text-blue-500">
                    {savedCompanies.length}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Tracked startups & companies
                  </div>
                </div>
              </div>

              {/* Recent Submissions Snippet */}
              <div className="rounded-2xl border bg-card p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-foreground">
                    Recent Submissions
                  </h2>
                  <button
                    onClick={() => setTab("submissions")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View all ({initialSubmissions.length})
                  </button>
                </div>

                {initialSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-xs">No submissions yet.</p>
                    <Link
                      href="/submit"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" /> Submit a Startup or Job
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y">
                    {initialSubmissions.slice(0, 3).map((sub) => (
                      <div key={sub.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold text-foreground">
                            {sub.data?.name || sub.data?.title || `${sub.type} Submission`}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {sub.type} • Submitted {new Date(sub.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        </div>
                        <div>
                          <StatusBadge status={sub.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY SUBMISSIONS */}
          {tab === "submissions" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">My Submissions</h2>
                  <p className="text-xs text-muted-foreground">
                    Track moderation progress of your submitted startups, jobs, events, and founders.
                  </p>
                </div>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary/90"
                >
                  <Plus className="h-3.5 w-3.5" /> New Submission
                </Link>
              </div>

              {initialSubmissions.length === 0 ? (
                <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <h3 className="text-sm font-semibold text-foreground">
                    No submissions found
                  </h3>
                  <p className="text-xs mt-1 max-w-sm mx-auto">
                    You haven&apos;t submitted any content yet. Add a startup, post a job, or submit a local tech event.
                  </p>
                  <Link
                    href="/submit"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {initialSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="rounded-2xl border bg-card p-5 shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-foreground">
                              {sub.data?.name || sub.data?.title || `${sub.type} Submission`}
                            </span>
                            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                              {sub.type}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {sub.data?.descriptionShort || sub.data?.description || "No description provided"}
                          </p>
                        </div>
                        <StatusBadge status={sub.status} />
                      </div>

                      {/* Moderation notes / Rejection reason if any */}
                      {sub.rejectionReason && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                          <div>
                            <strong>Moderator feedback:</strong> {sub.rejectionReason}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t pt-3">
                        <div>
                          Submitted on {new Date(sub.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        {sub.reviewedAt && (
                          <div>
                            Reviewed on {new Date(sub.reviewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED ITEMS (JOBS & COMPANIES) */}
          {tab === "saved" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div>
                <h2 className="text-lg font-bold">Saved Jobs &amp; Companies</h2>
                <p className="text-xs text-muted-foreground">
                  Quick access to opportunities and organizations you have bookmarked.
                </p>
              </div>

              {/* Saved Jobs Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Saved Jobs ({savedJobs.length})
                </h3>
                {savedJobs.length === 0 ? (
                  <div className="rounded-2xl border bg-card p-6 text-center text-xs text-muted-foreground">
                    No jobs bookmarked yet. Browse active listings on the{" "}
                    <Link href="/jobs" className="text-primary font-semibold hover:underline">
                      Jobs Board
                    </Link>.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {savedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="rounded-2xl border bg-card p-4 flex items-center justify-between gap-4 shadow-2xs"
                      >
                        <div>
                          <Link
                            href={`/job/${job.slug}`}
                            className="text-xs font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                          >
                            <span>{job.title}</span>
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </Link>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {job.companyName} • {job.location || "Nagpur"} • {job.remoteType}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveSavedJob(job.id)}
                          className="text-muted-foreground hover:text-red-500 p-1.5 rounded-lg hover:bg-muted transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved Companies Section */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Saved Companies ({savedCompanies.length})
                </h3>
                {savedCompanies.length === 0 ? (
                  <div className="rounded-2xl border bg-card p-6 text-center text-xs text-muted-foreground">
                    No companies saved yet. Discover startups on the{" "}
                    <Link href="/startups" className="text-primary font-semibold hover:underline">
                      Directory
                    </Link>.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {savedCompanies.map((comp) => (
                      <div
                        key={comp.id}
                        className="rounded-2xl border bg-card p-4 flex items-center justify-between gap-4 shadow-2xs"
                      >
                        <div>
                          <Link
                            href={`/company/${comp.slug}`}
                            className="text-xs font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                          >
                            <span>{comp.name}</span>
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </Link>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {comp.sector} • {comp.locationName || "Nagpur"}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveSavedCompany(comp.id)}
                          className="text-muted-foreground hover:text-red-500 p-1.5 rounded-lg hover:bg-muted transition-colors"
                          title="Remove bookmark"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {tab === "notifications" && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <h2 className="text-lg font-bold">Notifications</h2>
              {notifications.length === 0 ? (
                <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground text-xs">
                  No notifications yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.isRead && handleMarkNotification(notif.id)}
                      className={`rounded-2xl border p-4 transition-colors ${
                        notif.isRead
                          ? "bg-card/60 text-muted-foreground"
                          : "bg-card border-primary/30 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs font-bold text-foreground">
                            {notif.title}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {notif.message}
                          </p>
                          <div className="text-[10px] text-muted-foreground mt-2">
                            {new Date(notif.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        {!notif.isRead && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EDIT PROFILE */}
          {tab === "profile" && (
            <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-2xs animate-in fade-in-50 duration-200">
              <h2 className="text-lg font-bold mb-1">Edit Profile</h2>
              <p className="text-xs text-muted-foreground mb-6">
                Update your public ecosystem persona, location, and social profiles.
              </p>

              {profileError && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                  {profileError}
                </div>
              )}

              {profileMessage && (
                <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
                  {profileMessage}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Username (Unique identifier)
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Bio / Headline
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the Central India tech community about what you are building..."
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      City / Hub
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Nagpur or Indore"
                      className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Location / Area
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. MIHAN, IT Park, Vijay Nagar"
                      className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Skills / Expertise (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. TypeScript, Next.js, AI/ML, Product Management"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      Portfolio / Website
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {savingProfile ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="h-3 w-3" />
        Approved &amp; Published
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400 border border-red-500/20">
        <XCircle className="h-3 w-3" />
        Rejected
      </span>
    );
  }
  if (status === "CHANGES_REQUESTED") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <AlertCircle className="h-3 w-3" />
        Changes Requested
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
      <Clock className="h-3 w-3" />
      Pending Review
    </span>
  );
}
