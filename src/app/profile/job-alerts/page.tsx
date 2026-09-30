import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, Plus } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getCurrentUser, getOrCreateProfile } from "@/lib/auth";
import { db } from "@/db";
import { jobAlerts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SITE } from "@/lib/constants";
import { JobAlertsList } from "@/components/jobs/job-alerts-list";

export const metadata: Metadata = {
  title: "Job Alerts",
  description: "Manage your job alert preferences for Central India Tech.",
  alternates: { canonical: `${SITE.url}/profile/job-alerts` },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function JobAlertsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?returnTo=/profile/job-alerts");
  }

  const profile = await getOrCreateProfile(user);
  if (!profile) {
    redirect("/login?returnTo=/profile/job-alerts");
  }

  let alerts: any[] = [];
  try {
    alerts = await db
      .select()
      .from(jobAlerts)
      .where(eq(jobAlerts.userId, user.id))
      .orderBy(desc(jobAlerts.createdAt));
  } catch (err) {
    console.error("[job-alerts] Error loading alerts:", err);
  }

  const breadcrumbs = [
    { label: "Profile", href: `/profile/${profile.username}` },
    { label: "Job Alerts", href: "/profile/job-alerts" },
  ];

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Alerts</h1>
          <p className="text-muted-foreground mt-2">
            Get notified when new jobs matching your criteria are posted.
          </p>
        </div>
        <Link
          href="/profile/job-alerts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Alert</span>
        </Link>
      </div>

      <JobAlertsList initialAlerts={alerts} />
    </div>
  );
}
