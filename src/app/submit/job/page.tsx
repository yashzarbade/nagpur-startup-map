"use client";

import * as React from "react";
import Link from "next/link";
import { Briefcase, CheckCircle2, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SubmissionAuthGuard } from "@/components/auth/submission-auth-guard";
import { createSubmissionAction } from "@/app/auth/actions";
import { SITE, EMPLOYMENT_TYPES, REMOTE_TYPES, JOB_DEPARTMENTS } from "@/lib/constants";

export default function SubmitJobPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    city: "nagpur",
    title: "",
    companyName: "",
    companySlug: "",
    department: "Engineering",
    location: "Nagpur",
    remoteType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceMin: "1",
    experienceMax: "4",
    salaryMin: "",
    salaryMax: "",
    skills: "",
    description: "",
    applicationUrl: "",
    expiresAt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cityId = formData.city === "indore" ? 3 : 1;
      const res = await createSubmissionAction({
        type: "JOB",
        cityId,
        data: {
          ...formData,
          cityId,
        },
      });

      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setLoading(false);
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit job listing.");
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-8 max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Submit", href: "/submit" },
          { label: "Post a Job" },
        ]}
      />

      <div className="my-6">
        <Link
          href="/submit"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3 w-3" /> Back to options
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Post a Tech Job</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Publish your opening or submit a role for Nagpur &amp; Indore talent on {SITE.name}.
        </p>
      </div>

      <SubmissionAuthGuard returnTo="/submit/job" submissionTypeName="a job listing">
        {submitted ? (
          <div className="p-8 rounded-3xl border bg-card text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Job Listing Submitted!</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Thank you for submitting <strong>{formData.title}</strong>. Our moderation team will verify the details and activate the listing on the job board.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard?tab=submissions"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
              >
                Track in Dashboard
              </Link>
              <Link
                href="/jobs"
                className="px-5 py-2.5 rounded-xl border bg-card font-semibold text-xs hover:bg-accent transition-colors"
              >
                View Jobs Board
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* City & Company */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                1. Location &amp; Company
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Hub City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                        location: e.target.value === "indore" ? "Indore" : "Nagpur",
                      })
                    }
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    <option value="nagpur">Nagpur (Maharashtra)</option>
                    <option value="indore">Indore (Madhya Pradesh)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="e.g. Immverse AI, Infosys, InfoBeans"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Role Details */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                2. Job Specification
              </h2>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Senior Full Stack Engineer, AI Prompt Engineer"
                  className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    {JOB_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) =>
                      setFormData({ ...formData, employmentType: e.target.value })
                    }
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Workplace Type
                  </label>
                  <select
                    value={formData.remoteType}
                    onChange={(e) =>
                      setFormData({ ...formData, remoteType: e.target.value })
                    }
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    {REMOTE_TYPES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Experience Range (Years)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min (e.g. 1)"
                      value={formData.experienceMin}
                      onChange={(e) =>
                        setFormData({ ...formData, experienceMin: e.target.value })
                      }
                      className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                    <input
                      type="number"
                      placeholder="Max (e.g. 4)"
                      value={formData.experienceMax}
                      onChange={(e) =>
                        setFormData({ ...formData, experienceMax: e.target.value })
                      }
                      className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Annual Salary / CTC (INR, Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min (₹)"
                      value={formData.salaryMin}
                      onChange={(e) =>
                        setFormData({ ...formData, salaryMin: e.target.value })
                      }
                      className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                    <input
                      type="number"
                      placeholder="Max (₹)"
                      value={formData.salaryMax}
                      onChange={(e) =>
                        setFormData({ ...formData, salaryMax: e.target.value })
                      }
                      className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Required Skills (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                  placeholder="e.g. React, Node.js, Python, PostgreSQL, AWS"
                  className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Job Description &amp; Responsibilities *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Paste job overview, key responsibilities, and requirements..."
                  className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Application Link or Career URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.applicationUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, applicationUrl: e.target.value })
                  }
                  placeholder="https://company.com/careers/apply or LinkedIn job URL"
                  className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Job for Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </SubmissionAuthGuard>
    </div>
  );
}
