"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Send, Loader2 } from "lucide-react";
import { SubmissionAuthGuard } from "@/components/auth/submission-auth-guard";
import { createClaimAction } from "@/app/auth/actions";
import { SITE } from "@/lib/constants";

interface ClaimFormProps {
  companyId: number;
  companyName: string;
  companySlug: string;
  citySlug: string;
}

export function ClaimForm({
  companyId,
  companyName,
  companySlug,
  citySlug,
}: ClaimFormProps) {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");
  const [evidence, setEvidence] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await createClaimAction({
        companyId,
        name,
        email,
        role,
        linkedinUrl,
        evidence,
      });

      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setLoading(false);
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit claim.");
      setLoading(false);
    }
  };

  const returnTo = `/${citySlug}/claim/${companySlug}`;

  return (
    <SubmissionAuthGuard
      returnTo={returnTo}
      submissionTypeName={`a claim for ${companyName}`}
    >
      {submitted ? (
        <div className="rounded-3xl border bg-card p-8 sm:p-10 text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Verification Claim Submitted!</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Thank you for requesting verification for <strong>{companyName}</strong>. Our moderation team will verify ownership and connect your account.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
            >
              Track in Dashboard
            </Link>
            <Link
              href={`/${citySlug}/company/${companySlug}`}
              className="px-5 py-2.5 rounded-xl border bg-card font-semibold text-xs hover:bg-accent transition-colors"
            >
              Return to Company
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border text-xs text-muted-foreground">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <span>
              We verify ownership via your official corporate domain email or verified company LinkedIn profile.
            </span>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shashank Vaishnav"
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Official Work Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@companydomain.com"
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Must match company domain for automatic verification.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Your Role at Company *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Founder, CEO, CTO, HR Lead"
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Personal LinkedIn Profile
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Verification Evidence / Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                placeholder="Share any details supporting ownership (e.g. domain DNS, registered office, press link)..."
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Claim for Verification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </SubmissionAuthGuard>
  );
}
