import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  User,
  MapPin,
  Building2,
  ExternalLink,
  Globe,
  Share2,
  Sparkles,
} from "lucide-react";
import { db } from "@/db";
import { userProfiles, companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SITE } from "@/lib/constants";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.username, username.toLowerCase()))
    .limit(1);

  if (!profile) {
    return {
      title: "Profile Not Found",
    };
  }

  const title = `${profile.fullName || profile.username} | ${SITE.name}`;
  const description =
    profile.bio ||
    `${profile.fullName || profile.username}'s tech and startup profile on Central India Tech.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/profile/${profile.username}`,
    },
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/profile/${profile.username}`,
    },
  };
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.username, username.toLowerCase()))
    .limit(1);

  if (!profile || profile.status === "DISABLED") {
    notFound();
  }

  // If user has claimed a company, fetch public company details
  let claimedCompany: any = null;
  if (profile.claimedCompanyId) {
    const [comp] = await db
      .select({
        name: companies.name,
        slug: companies.slug,
        sector: companies.sector,
        logoUrl: companies.logoUrl,
        locationName: companies.locationName,
      })
      .from(companies)
      .where(eq(companies.id, profile.claimedCompanyId))
      .limit(1);
    claimedCompany = comp || null;
  }

  const skillsList = profile.skills
    ? profile.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="container-page py-12 max-w-3xl mx-auto">
      <div className="rounded-3xl border bg-card p-6 sm:p-10 shadow-xs space-y-8">
        {/* Profile Top Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary text-3xl font-extrabold border border-primary/20 shadow-sm shrink-0">
            {profile.fullName?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {profile.fullName || profile.username}
              </h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                  profile.role === "ADMIN"
                    ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
                    : profile.role === "COMPANY"
                    ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {profile.role}
              </span>
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              @{profile.username}
            </p>

            {(profile.location || profile.city) && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>
                  {[profile.location, profile.city].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="space-y-2 border-t pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              About
            </h2>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Claimed / Linked Company */}
        {claimedCompany && (
          <div className="space-y-2 border-t pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Affiliated Organization
            </h2>
            <Link
              href={`/company/${claimedCompany.slug}`}
              className="flex items-center justify-between rounded-2xl border bg-muted/40 p-4 hover:bg-muted/70 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card border text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {claimedCompany.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {claimedCompany.sector} • {claimedCompany.locationName}
                  </div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
            </Link>
          </div>
        )}

        {/* Skills */}
        {skillsList.length > 0 && (
          <div className="space-y-3 border-t pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Skills &amp; Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="rounded-xl border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social / Portfolio Links */}
        {(profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl) && (
          <div className="space-y-3 border-t pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Connect
            </h2>
            <div className="flex flex-wrap gap-3">
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent hover:text-primary transition-colors"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Website / Portfolio</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Ecosystem Footer Badge */}
        <div className="border-t pt-6 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
          <span className="font-semibold text-primary">Central India Tech Verified</span>
        </div>
      </div>
    </div>
  );
}
