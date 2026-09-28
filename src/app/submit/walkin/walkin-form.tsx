"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowLeft, Loader2, Sparkles, Building2, MapPin, Calendar } from "lucide-react";
import { submitWalkinAction, WalkinFormState } from "./actions";

export function WalkinForm({ defaultCity }: { defaultCity?: string }) {
  const [state, formAction, isPending] = useActionState<WalkinFormState, FormData>(
    submitWalkinAction,
    { success: false }
  );

  if (state.success) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center shadow-sm max-w-xl mx-auto my-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Drive Submitted for Review!</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {state.message || "Thank you! Your walk-in drive submission is now pending review. Our team will verify the venue and details."}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/walkins"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition"
          >
            Explore Walk-In Drives
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl border bg-background px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted transition"
          >
            Submit Another Drive
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8 bg-card border rounded-2xl p-6 sm:p-10 shadow-sm">
      {/* Honeypot field for spam prevention */}
      <input type="text" name="website_hp" className="hidden" tabIndex={-1} autoComplete="off" />

      {state.message && !state.success && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      {/* ── Basic Information ── */}
      <div>
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
          <Building2 className="h-4 w-4 text-primary" />
          Company & Role Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Company or Recruiter Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              required
              placeholder="e.g. Persistent Systems, Infosys, Tech Startup"
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {state.errors?.companyName && (
              <p className="mt-1 text-xs text-red-500">{state.errors.companyName[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Job Title / Drive Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Mega Walk-in: Junior Full Stack Developer"
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {state.errors?.title && (
              <p className="mt-1 text-xs text-red-500">{state.errors.title[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── City & Venue ── */}
      <div className="border-t pt-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-primary" />
          Location & Interview Venue
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              City <span className="text-red-500">*</span>
            </label>
            <select
              name="city"
              required
              defaultValue={defaultCity || "nagpur"}
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="nagpur">Nagpur, Maharashtra</option>
              <option value="indore">Indore, Madhya Pradesh</option>
              <option value="bhopal">Bhopal, Madhya Pradesh</option>
            </select>
            {state.errors?.city && (
              <p className="mt-1 text-xs text-red-500">{state.errors.city[0]}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Exact Interview Venue / Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="venue"
              required
              placeholder="e.g. Tower 2, MIHAN SEZ, Nagpur or Crystal IT Park, Indore"
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {state.errors?.venue && (
              <p className="mt-1 text-xs text-red-500">{state.errors.venue[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Date & Timing ── */}
      <div className="border-t pt-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-primary" />
          Interview Date & Timings
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Interview Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="walkinDate"
              required
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {state.errors?.walkinDate && (
              <p className="mt-1 text-xs text-red-500">{state.errors.walkinDate[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="walkinStartTime"
              required
              placeholder="e.g. 10:00 AM"
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {state.errors?.walkinStartTime && (
              <p className="mt-1 text-xs text-red-500">{state.errors.walkinStartTime[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              End Time (Optional)
            </label>
            <input
              type="text"
              name="walkinEndTime"
              placeholder="e.g. 4:00 PM"
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      </div>

      {/* ── Role Description & Details ── */}
      <div className="border-t pt-6">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Role Details & Requirements
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Job Description & Candidate Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Mention job responsibilities, eligibility criteria, documents to carry (resume, ID proof), and selection rounds."
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {state.errors?.description && (
              <p className="mt-1 text-xs text-red-500">{state.errors.description[0]}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Experience Level
              </label>
              <input
                type="text"
                name="experience"
                placeholder="e.g. Freshers / 0-2 Years"
                className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Salary / Package
              </label>
              <input
                type="text"
                name="salary"
                placeholder="e.g. ₹3.5 - 6 LPA or Best in industry"
                className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Key Skills (Comma separated)
              </label>
              <input
                type="text"
                name="skills"
                placeholder="e.g. Java, Python, React, SQL"
                className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Links & Submitter Verification ── */}
      <div className="border-t pt-6">
        <h3 className="text-base font-semibold text-foreground mb-4">
          Source Links & Submitter Verification
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Original Notice / Announcement URL (Optional)
            </label>
            <input
              type="url"
              name="announcementUrl"
              placeholder="e.g. LinkedIn post, Telegram post, or career page link"
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Online Registration / Apply URL (Optional)
            </label>
            <input
              type="url"
              name="applicationUrl"
              placeholder="https://..."
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Your Email Address (For moderation updates) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="submitterEmail"
              required
              placeholder="hr@company.com or recruiter@email.com"
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {state.errors?.submitterEmail && (
              <p className="mt-1 text-xs text-red-500">{state.errors.submitterEmail[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Recruiter Contact Info (Shown publicly)
            </label>
            <input
              type="text"
              name="contactDetails"
              placeholder="e.g. Contact HR team at hr@example.com"
              className="w-full rounded-lg border bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      </div>

      {/* ── Submit Button ── */}
      <div className="pt-4 flex items-center justify-end gap-4">
        <Link
          href="/walkins"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50 transition"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Submit Walk-In Drive
            </>
          )}
        </button>
      </div>
    </form>
  );
}
