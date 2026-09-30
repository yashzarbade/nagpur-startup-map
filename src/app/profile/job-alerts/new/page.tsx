"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

const SECTORS = [
  "All Sectors",
  "SaaS",
  "FinTech",
  "HealthTech",
  "EdTech",
  "AI / ML",
  "E-Commerce",
  "CleanTech",
  "Agritech",
  "Logistics",
  "Enterprise Software",
  "IT Services",
];

const CITIES = [
  { id: 0, name: "All Central India (Nagpur, Indore, Bhopal)" },
  { id: 1, name: "Nagpur" },
  { id: 3, name: "Indore" },
  { id: 6, name: "Bhopal" },
];

export default function NewJobAlertPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    keyword: "",
    cityId: 0,
    sector: "All Sectors",
    remoteType: "All",
    employmentType: "Full-time",
    frequency: "DAILY",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please provide an alert name (e.g. 'Frontend Developer in Nagpur')");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/job-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          keyword: formData.keyword.trim() || undefined,
          cityId: formData.cityId > 0 ? formData.cityId : undefined,
          sector: formData.sector !== "All Sectors" ? formData.sector : undefined,
          remoteType: formData.remoteType !== "All" ? formData.remoteType : undefined,
          employmentType: formData.employmentType !== "All" ? formData.employmentType : undefined,
          frequency: formData.frequency,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?returnTo=/profile/job-alerts/new");
          return;
        }
        throw new Error(data.error || "Failed to create job alert");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/profile/job-alerts");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to create alert");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-8 max-w-2xl">
      <Breadcrumbs
        items={[
          { label: "Job Alerts", href: "/profile/job-alerts" },
          { label: "New Alert" },
        ]}
      />

      <div className="mb-8">
        <Link
          href="/profile/job-alerts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to alerts</span>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Job Alert</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Receive tailored notifications whenever companies in Central India post jobs matching your preferences.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-xs">
        {success ? (
          <div className="py-10 text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Alert Created!</h3>
            <p className="text-sm text-muted-foreground">
              Redirecting you to your job alerts dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Alert Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer or Python Roles"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Target Keyword or Role (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. React, Next.js, Product Manager, DevOps"
                value={formData.keyword}
                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Location / Hub
                </label>
                <select
                  value={formData.cityId}
                  onChange={(e) => setFormData({ ...formData, cityId: Number(e.target.value) })}
                  className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                >
                  {CITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Sector / Industry
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                >
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Workplace Mode
                </label>
                <select
                  value={formData.remoteType}
                  onChange={(e) => setFormData({ ...formData, remoteType: e.target.value })}
                  className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                >
                  <option value="All">All Modes (On-site, Hybrid, Remote)</option>
                  <option value="On-site">On-site only</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Notification Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                >
                  <option value="INSTANT">Instant (as soon as posted)</option>
                  <option value="DAILY">Daily digest</option>
                  <option value="WEEKLY">Weekly digest</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t">
              <Link
                href="/profile/job-alerts"
                className="px-4 py-2.5 rounded-xl border text-sm font-semibold hover:bg-accent transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Creating Alert...</span>
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    <span>Create Alert</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
