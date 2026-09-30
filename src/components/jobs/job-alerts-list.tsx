"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Plus,
  Briefcase,
  Zap,
  Trash2,
  Power,
  MapPin,
  Building2,
  ArrowRight,
} from "lucide-react";

interface JobAlertItem {
  id: number;
  name: string;
  keyword: string | null;
  sector: string | null;
  skills: string | null;
  frequency: "INSTANT" | "DAILY" | "WEEKLY";
  active: boolean;
  lastNotifiedAt: string | Date | null;
  createdAt: string | Date;
}

const frequencyLabels: Record<string, string> = {
  INSTANT: "Instant notification",
  DAILY: "Daily digest",
  WEEKLY: "Weekly digest",
};

export function JobAlertsList({ initialAlerts }: { initialAlerts: JobAlertItem[] }) {
  const router = useRouter();
  const [alerts, setAlerts] = React.useState<JobAlertItem[]>(initialAlerts);
  const [processingId, setProcessingId] = React.useState<number | null>(null);

  const handleToggle = async (alertId: number, currentActive: boolean) => {
    setProcessingId(alertId);
    try {
      const res = await fetch("/api/job-alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId,
          active: !currentActive,
        }),
      });

      if (res.ok) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === alertId ? { ...a, active: !currentActive } : a))
        );
      }
    } catch (err) {
      console.error("Error toggling alert:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (alertId: number) => {
    if (!confirm("Are you sure you want to delete this job alert?")) return;
    setProcessingId(alertId);
    try {
      const res = await fetch(`/api/job-alerts?alertId=${alertId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      }
    } catch (err) {
      console.error("Error deleting alert:", err);
    } finally {
      setProcessingId(null);
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl border bg-muted/20">
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground">No job alerts yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          Create alerts to get notified when new jobs matching your skills and preferences are posted across Central India.
        </p>
        <Link
          href="/profile/job-alerts/new"
          className="inline-flex items-center gap-2 mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Your First Alert</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-card p-5 shadow-xs transition-all ${
            alert.active ? "hover:shadow-sm" : "opacity-60 bg-muted/30"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                alert.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              <Bell className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground">{alert.name}</h3>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                {alert.keyword && (
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Briefcase className="h-3 w-3 text-primary" />
                    &ldquo;{alert.keyword}&rdquo;
                  </span>
                )}
                {alert.sector && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                    {alert.sector}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500" />
                  {frequencyLabels[alert.frequency] || alert.frequency}
                </span>
              </div>

              <div className="text-[11px] text-muted-foreground mt-1.5">
                Created {new Date(alert.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {alert.lastNotifiedAt && (
                  <>
                    {" "}
                    • Last sent{" "}
                    {new Date(alert.lastNotifiedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => handleToggle(alert.id, alert.active)}
              disabled={processingId === alert.id}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                alert.active
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-muted text-muted-foreground border-border hover:bg-accent"
              }`}
              title={alert.active ? "Pause alert" : "Activate alert"}
            >
              <Power className="h-3.5 w-3.5" />
              <span>{alert.active ? "Active" : "Paused"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDelete(alert.id)}
              disabled={processingId === alert.id}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors"
              title="Delete alert"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
