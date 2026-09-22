import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Users,
  MapPin,
  Briefcase,
  ExternalLink,
  Globe,
  Link2,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";
import { getAllTalent, getTalentBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllTalent().map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const talent = getTalentBySlug(slug);
  if (!talent) return { title: "Profile Not Found" };

  return {
    title: `${talent.name} — ${talent.title} in Nagpur`,
    description: `${talent.name} is a ${talent.title} based in Nagpur with ${talent.experienceYears} years of experience in ${talent.primarySkills.join(", ")}.`,
    alternates: { canonical: `/talent/${slug}` },
    openGraph: {
      title: `${talent.name} | ${SITE.name}`,
      description: talent.bio,
      url: `${SITE.url}/talent/${slug}`,
    },
  };
}

export default async function TalentDetailPage({ params }: Props) {
  const { slug } = await params;
  const talent = getTalentBySlug(slug);

  if (!talent) {
    notFound();
  }

  // Schema.org Person JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: talent.name,
    jobTitle: talent.title,
    description: talent.bio,
    homeLocation: {
      "@type": "Place",
      name: talent.location,
    },
    knowsAbout: talent.primarySkills,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-page py-8">
        <Breadcrumbs
          items={[
            { label: "Talent", href: "/talent" },
            { label: talent.name },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-3 mt-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center border shrink-0">
                    {talent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{talent.name}</h1>
                      {talent.openToWork && (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                          Open to Work
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">
                      {talent.title}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {talent.location}, Maharashtra
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {talent.portfolioUrl && (
                    <a
                      href={talent.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold hover:bg-accent transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" /> Portfolio
                    </a>
                  )}
                  {talent.linkedinUrl && (
                    <a
                      href={talent.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold hover:bg-accent transition-colors"
                    >
                      <Link2 className="h-3.5 w-3.5" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* About / Bio */}
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-3">
              <h2 className="text-lg font-bold">About</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {talent.bio}
              </p>
            </div>

            {/* Skills & Technologies */}
            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-3">
              <h2 className="text-lg font-bold">Skills & Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {talent.primarySkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-accent text-accent-foreground text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl border bg-card shadow-sm space-y-4 text-sm">
              <h3 className="font-semibold text-sm">Work Details</h3>
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-medium mt-0.5">{talent.experienceYears} Years</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Work Preference</p>
                <p className="font-medium mt-0.5">{talent.workPreference.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Availability</p>
                <p className="font-medium mt-0.5 text-emerald-600">
                  {talent.openToWork ? "Immediately Available" : "Not Looking"}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border bg-primary/5 text-center space-y-3">
              <Briefcase className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-bold text-sm">Looking to hire {talent.name.split(" ")[0]}?</h3>
              <p className="text-xs text-muted-foreground">
                Connect with local candidates or post a job opening on Nagpur Startup Map.
              </p>
              <Link
                href="/submit/job"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Post a Job Opening
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
