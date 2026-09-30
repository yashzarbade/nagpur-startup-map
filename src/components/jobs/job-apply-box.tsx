"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Send,
  Bookmark,
  Share2,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  X,
  FileText,
  Globe,
} from "lucide-react";
import { toggleSaveJobAction } from "@/app/auth/actions";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.85 6.28a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface JobApplyBoxProps {
  jobId: number;
  jobTitle: string;
  companyName: string;
  applicationUrl?: string | null;
  isExpired?: boolean;
  initialSaved?: boolean;
}

type ApplicationStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "REJECTED"
  | "HIRED"
  | "WITHDRAWN";

const STATUS_STEPS: { key: ApplicationStatus; label: string }[] = [
  { key: "APPLIED", label: "Applied" },
  { key: "UNDER_REVIEW", label: "Review" },
  { key: "SHORTLISTED", label: "Shortlisted" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "HIRED", label: "Hired" },
];

export function JobApplyBox({
  jobId,
  jobTitle,
  companyName,
  applicationUrl,
  isExpired = false,
  initialSaved = false,
}: JobApplyBoxProps) {
  const router = useRouter();
  const [saved, setSaved] = React.useState(initialSaved);
  const [saveLoading, setSaveLoading] = React.useState(false);

  // Application state
  const [isApplied, setIsApplied] = React.useState(false);
  const [appStatus, setAppStatus] = React.useState<ApplicationStatus | null>(null);
  const [appId, setAppId] = React.useState<number | null>(null);
  const [checkingApp, setCheckingApp] = React.useState(true);

  // Modals
  const [showApplyModal, setShowApplyModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Apply Form
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSuccess, setFormSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({
    resumeUrl: "",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    coverMessage: "",
  });

  // Check if current user has already applied
  React.useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.applications)) {
            const found = data.applications.find((a: any) => a.jobId === jobId);
            if (found && isMounted) {
              setIsApplied(true);
              setAppStatus(found.status);
              setAppId(found.id);
            }
          }
        }
      } catch (err) {
        // Silently skip if user not logged in
      } finally {
        if (isMounted) setCheckingApp(false);
      }
    }
    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const handleToggleSave = async () => {
    setSaveLoading(true);
    try {
      const res = await toggleSaveJobAction(jobId);
      if (res.requiresLogin) {
        router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      } else if (res.saved !== undefined) {
        setSaved(res.saved);
      }
    } catch (err) {
      console.error("Save job error:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = (channel: "copy" | "whatsapp" | "twitter" | "linkedin") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out this opening: ${jobTitle} at ${companyName} on Central India Tech`;

    if (channel === "copy") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (channel === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    } else if (channel === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (channel === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    }
  };

  const handleQuickApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          resumeUrl: formData.resumeUrl.trim() || undefined,
          portfolioUrl: formData.portfolioUrl.trim() || undefined,
          linkedinUrl: formData.linkedinUrl.trim() || undefined,
          githubUrl: formData.githubUrl.trim() || undefined,
          coverMessage: formData.coverMessage.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
        throw new Error(data.error || "Failed to submit application");
      }

      setFormSuccess(true);
      setIsApplied(true);
      setAppStatus("APPLIED");
      if (data.application?.id) setAppId(data.application.id);
      setTimeout(() => {
        setShowApplyModal(false);
      }, 1800);
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExternalApplyAndTrack = async () => {
    if (!applicationUrl) return;
    // Open destination in new tab
    window.open(applicationUrl, "_blank", "noopener,noreferrer");

    // Proactively track as applied if user is logged in
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          coverMessage: "Applied via company external link.",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsApplied(true);
        setAppStatus("APPLIED");
        if (data.application?.id) setAppId(data.application.id);
      }
    } catch (e) {
      // Continue without interrupting navigation
    }
  };

  return (
    <div className="space-y-4">
      {/* Expired Job Notice */}
      {isExpired ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center">
          <p className="text-sm font-semibold text-destructive">
            Applications are closed for this opening.
          </p>
        </div>
      ) : isApplied ? (
        /* Applied Status Card */
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Application Tracked
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {appStatus?.replace("_", " ") || "Applied"}
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Your application is registered in your candidate portal. You will receive updates as the company reviews candidates.
          </p>

          {/* Stepper Progress */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground mb-1.5">
              {STATUS_STEPS.map((step, idx) => {
                const isCurrent = appStatus === step.key;
                const isPast =
                  STATUS_STEPS.findIndex((s) => s.key === appStatus) >= idx;
                return (
                  <span
                    key={step.key}
                    className={`${
                      isCurrent
                        ? "text-emerald-600 dark:text-emerald-400 font-bold"
                        : isPast
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {step.label}
                  </span>
                );
              })}
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 transition-all duration-500 rounded-full"
                style={{
                  width: `${
                    ((Math.max(
                      0,
                      STATUS_STEPS.findIndex((s) => s.key === appStatus)
                    ) +
                      1) /
                      STATUS_STEPS.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-emerald-500/20 text-xs">
            <button
              type="button"
              onClick={() => router.push("/profile/applications")}
              className="text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span>View in Applications</span>
              <ChevronRight className="h-3 w-3" />
            </button>

            {applicationUrl && (
              <a
                href={applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <span>Company Posting</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      ) : (
        /* Action Buttons: Apply Flow */
        <div className="flex flex-wrap items-center gap-3">
          {applicationUrl ? (
            <>
              <button
                type="button"
                onClick={handleExternalApplyAndTrack}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99] flex-1 sm:flex-initial"
              >
                <span>Apply on Company Site</span>
                <ExternalLink className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowApplyModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-colors"
                title="Submit application details or track your submission"
              >
                <Send className="h-4 w-4" />
                <span>Quick Apply / Track</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowApplyModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99] flex-1 sm:flex-initial"
            >
              <Send className="h-4 w-4" />
              <span>Direct Apply</span>
            </button>
          )}

          {/* Save Button */}
          <button
            type="button"
            onClick={handleToggleSave}
            disabled={saveLoading}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
              saved
                ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                : "bg-card text-foreground hover:bg-accent border-border"
            }`}
            title={saved ? "Saved" : "Save Job"}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-primary" : ""}`} />
            <span>{saved ? "Saved" : "Save"}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-accent border-border transition-colors"
            title="Share Job"
          >
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <span>Share</span>
          </button>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-foreground">Share this Opening</h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              Help your network discover this role at <span className="font-semibold text-foreground">{companyName}</span>.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleShare("whatsapp")}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border bg-card hover:bg-accent text-sm font-medium transition-colors"
              >
                <span className="text-emerald-500 font-bold">WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => handleShare("linkedin")}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border bg-card hover:bg-accent text-sm font-medium transition-colors"
              >
                <LinkedInIcon className="h-4 w-4 text-blue-600" />
                <span>LinkedIn</span>
              </button>
              <button
                type="button"
                onClick={() => handleShare("twitter")}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border bg-card hover:bg-accent text-sm font-medium transition-colors"
              >
                <span className="font-bold">X (Twitter)</span>
              </button>
              <button
                type="button"
                onClick={() => handleShare("copy")}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border bg-card hover:bg-accent text-sm font-medium transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Link Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="text-lg font-bold text-foreground">Apply for {jobTitle}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{companyName}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">Application Submitted!</h4>
                <p className="text-sm text-muted-foreground">
                  Your application has been registered and added to your profile.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickApply} className="space-y-4">
                {formError && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    Resume Link (Google Drive / Dropbox / PDF URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or link to resume"
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Make sure link sharing is set to viewable by anyone with the link.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                      <LinkedInIcon className="h-3.5 w-3.5 text-blue-600" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                      <GithubIcon className="h-3.5 w-3.5" />
                      GitHub / Portfolio
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Cover Note / Highlights (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly highlight your relevant experience and why you are interested in this role..."
                    value={formData.coverMessage}
                    onChange={(e) => setFormData({ ...formData, coverMessage: e.target.value })}
                    className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2.5 rounded-xl border text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
