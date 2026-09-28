"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, CheckCircle2, ArrowLeft, Send, Sparkles, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SECTORS, SITE } from "@/lib/constants";
import { SubmissionAuthGuard } from "@/components/auth/submission-auth-guard";
import { createSubmissionAction } from "@/app/auth/actions";

export default function SubmitStartupPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    city: "nagpur",
    cityId: 1,
    name: "",
    websiteUrl: "",
    sector: "AI",
    locationName: "MIHAN",
    descriptionShort: "",
    descriptionLong: "",
    foundedYear: "2024",
    teamSize: "11-50",
    hiring: false,
    careersUrl: "",
    founderName: "",
    founderRole: "Founder & CEO",
    founderLinkedin: "",
    submitterEmail: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cityId = formData.city === "indore" ? 3 : 1;
      const res = await createSubmissionAction({
        type: "COMPANY",
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
      setError(err.message || "Failed to submit startup.");
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-8 max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Submit", href: "/submit" },
          { label: "Add a Startup" },
        ]}
      />

      <div className="my-6">
        <Link
          href="/submit"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3 w-3" /> Back to options
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add Your Startup or Company</h1>
        <p className="text-sm text-muted-foreground mt-1">
          List your company on {SITE.name}. Free basic listing with verified review within 24 hours.
        </p>
      </div>

      <SubmissionAuthGuard returnTo="/submit/startup" submissionTypeName="a startup">
        {submitted ? (
          <div className="p-8 rounded-3xl border bg-card text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Submission Received!</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Thank you for submitting <strong>{formData.name}</strong> to {SITE.name}. Our moderation team will review the details and publish the profile.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard?tab=submissions"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
              >
                Track in Dashboard
              </Link>
              <Link
                href="/startups"
                className="px-5 py-2.5 rounded-xl border bg-card font-semibold text-xs hover:bg-accent transition-colors"
              >
                Explore Directory
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

            {/* City Selection */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                1. Ecosystem Location
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
                        locationName: e.target.value === "indore" ? "Vijay Nagar" : "MIHAN",
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
                    Area / Tech Zone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.locationName}
                    onChange={(e) =>
                      setFormData({ ...formData, locationName: e.target.value })
                    }
                    placeholder="e.g. MIHAN, IT Park, Vijay Nagar, Super Corridor"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                2. Company Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Acrolinx AI"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.websiteUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, websiteUrl: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Primary Sector *
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) =>
                      setFormData({ ...formData, sector: e.target.value })
                    }
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    {SECTORS.map((s) => (
                      <option key={s.label} value={s.label}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    value={formData.foundedYear}
                    onChange={(e) =>
                      setFormData({ ...formData, foundedYear: e.target.value })
                    }
                    placeholder="2024"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Team Size
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) =>
                      setFormData({ ...formData, teamSize: e.target.value })
                    }
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    <option value="1-10">1-10 members</option>
                    <option value="11-50">11-50 members</option>
                    <option value="51-200">51-200 members</option>
                    <option value="201-500">201-500 members</option>
                    <option value="500+">500+ members</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Short One-Liner Description *
                </label>
                <input
                  type="text"
                  required
                  maxLength={300}
                  value={formData.descriptionShort}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionShort: e.target.value })
                  }
                  placeholder="e.g. AI-driven diagnostics for medical imaging"
                  className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Detailed Description (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.descriptionLong}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionLong: e.target.value })
                  }
                  placeholder="Share details about your product, mission, market focus, or traction..."
                  className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="e.g. AI, Healthcare, Machine Learning, SaaS"
                  className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>
            </div>

            {/* Founder Info */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                3. Founder Information (Optional)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Founder Name
                  </label>
                  <input
                    type="text"
                    value={formData.founderName}
                    onChange={(e) =>
                      setFormData({ ...formData, founderName: e.target.value })
                    }
                    placeholder="e.g. Priyesh Patel"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Founder Role
                  </label>
                  <input
                    type="text"
                    value={formData.founderRole}
                    onChange={(e) =>
                      setFormData({ ...formData, founderRole: e.target.value })
                    }
                    placeholder="Founder & CEO"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Founder LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.founderLinkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        founderLinkedin: e.target.value,
                      })
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
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
                    <span>Submit for Moderation</span>
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
