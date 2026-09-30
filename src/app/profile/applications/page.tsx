import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, Clock, Building2, MapPin, ExternalLink, ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getCurrentUser, getOrCreateProfile } from "@/lib/auth";
import { db } from "@/db";
import { jobApplications, jobs, companies } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "My Applications",
  description: "Track your job applications across Central India Tech.",
  alternates: { canonical: `${SITE.url}/profile/applications` },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  APPLIED: { label: "Applied", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Clock },
  UNDER_REVIEW: { label: "Under Review", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: AlertCircle },
  SHORTLISTED: { label: "Shortlisted", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
  INTERVIEW: { label: "Interview", color: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: Briefcase },
  REJECTED: { label: "Rejected", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
  HIRED: { label: "Hired", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
  WITHDRAWN: { label: "Withdrawn", color: "bg-gray-500/10 text-gray-500 border-gray-500/20", icon: XCircle },
};

export default async function ApplicationsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?returnTo=/profile/applications");
  }

  const profile = await getOrCreateProfile(user);
  if (!profile) {
    redirect("/login?returnTo=/profile/applications");
  }

  let applications: any[] = [];
  try {
    applications = await db
      .select({
        id: jobApplications.id,
        status: jobApplications.status,
        coverMessage: jobApplications.coverMessage,
        createdAt: jobApplications.createdAt,
        updatedAt: jobApplications.updatedAt,
        statusChangedAt: jobApplications.statusChangedAt,
        jobTitle: jobs.title,
        jobSlug: jobs.slug,
        jobLocation: jobs.location,
        jobStatus: jobs.status,
        jobCityId: jobs.cityId,
        companyName: companies.name,
        companySlug: companies.slug,
        companyLogo: companies.logoUrl,
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .innerJoin(companies, eq(jobApplications.companyId, companies.id))
      .where(eq(jobApplications.userId, user.id))
      .orderBy(desc(jobApplications.createdAt));
  } catch (err) {
    console.error("[applications] Error loading applications:", err);
  }

  const breadcrumbs = [
    { label: "Profile", href: `/profile/${profile.username}` },
    { label: "My Applications", href: "/profile/applications" },
  ];

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground mt-2">
          Track all your job applications across Central India Tech.
        </p>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const config = statusConfig[app.status] || statusConfig.APPLIED;
            const StatusIcon = config.icon;
            const citySlug = app.jobCityId === 3 ? "indore" : app.jobCityId === 6 ? "bhopal" : "nagpur";

            return (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border bg-card p-5 shadow-xs hover:shadow-sm transition-shadow"
              >
                {/* Company logo */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted/50 overflow-hidden p-1">
                  {app.companyLogo ? (
                    <img
                      src={app.companyLogo}
                      alt={app.companyName}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                {/* Job info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/${citySlug}/job/${app.jobSlug}`}
                    className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
                  >
                    {app.jobTitle}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                    <Link
                      href={`/${citySlug}/company/${app.companySlug}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {app.companyName}
                    </Link>
                    {app.jobLocation && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          {app.jobLocation}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Applied {new Date(app.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {app.statusChangedAt && app.status !== "APPLIED" && (
                      <> • Updated {new Date(app.statusChangedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}</>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {config.label}
                  </span>
                  {app.jobStatus !== "ACTIVE" && (
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border">
                      Job {app.jobStatus === "EXPIRED" ? "Expired" : "Closed"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border bg-muted/20">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No applications yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Start exploring jobs and apply to opportunities across Central India&apos;s tech ecosystem.
          </p>
          <Link
            href="/nagpur/jobs"
            className="inline-flex items-center gap-2 mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <span>Browse Jobs</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
