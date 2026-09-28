"use client";

import * as React from "react";
import Link from "next/link";
import { Users, CheckCircle2, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SubmissionAuthGuard } from "@/components/auth/submission-auth-guard";
import { createSubmissionAction } from "@/app/auth/actions";
import { SITE } from "@/lib/constants";

export default function SubmitFounderPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    city: "nagpur",
    name: "",
    role: "Founder & CEO",
    companyName: "",
    companyWebsite: "",
    bio: "",
    linkedinUrl: "",
    twitterUrl: "",
    location: "Nagpur",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cityId = formData.city === "indore" ? 3 : 1;
      const res = await createSubmissionAction({
        type: "FOUNDER",
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
      setError(err.message || "Failed to submit founder profile.");
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-8 max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Submit", href: "/submit" },
          { label: "Add a Founder" },
        ]}
      />

      <div className="my-6">
        <Link
          href="/submit"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3 w-3" /> Back to options
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Founder Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Showcase your entrepreneurial journey and connect with the Central India startup network on {SITE.name}.
        </p>
      </div>

      <SubmissionAuthGuard returnTo="/submit/founder" submissionTypeName="a founder profile">
        {submitted ? (
          <div className="p-8 rounded-3xl border bg-card text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Profile Submitted for Verification!</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Thank you for submitting <strong>{formData.name}</strong>. Our moderation team will verify the details and link your profile to the ecosystem directory.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard?tab=submissions"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
              >
                Track in Dashboard
              </Link>
              <Link
                href="/founders"
                className="px-5 py-2.5 rounded-xl border bg-card font-semibold text-xs hover:bg-accent transition-colors"
              >
                View Founders
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

            {/* Hub City */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                1. Ecosystem Hub
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
                    Location / Area
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Dharampeth, Vijay Nagar"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                2. Founder &amp; Venture Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Priyesh Patel"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="Founder & CEO"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Startup / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="e.g. Flappic, Immverse AI"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Company Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.companyWebsite}
                    onChange={(e) =>
                      setFormData({ ...formData, companyWebsite: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Bio / Background *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Share your entrepreneurial journey, previous experience, and what you are building..."
                  className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedinUrl: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    X (Twitter) URL
                  </label>
                  <input
                    type="url"
                    value={formData.twitterUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, twitterUrl: e.target.value })
                    }
                    placeholder="https://x.com/..."
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
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
                    <span>Submit Founder Profile</span>
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
