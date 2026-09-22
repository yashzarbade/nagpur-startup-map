import type { Metadata } from "next";
import Link from "next/link";
import { Users, MapPin, Briefcase, ExternalLink, Sparkles, ArrowRight, UserPlus } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";
import { getAllTalent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nagpur Tech Talent Directory — Developers, Designers & Engineers",
  description: "Discover top software engineers, AI researchers, UI/UX designers, and product builders based in Nagpur, Maharashtra.",
  alternates: { canonical: "/talent" },
};

export default function TalentDirectoryPage() {
  const talents = getAllTalent();

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ label: "Talent Directory" }]} />

      <div className="flex flex-col md:flex-row md:items-end justify-between my-6 gap-4 border-b pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
            <Users className="h-3.5 w-3.5" /> Nagpur Tech Talent Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Nagpur Tech Talent Directory
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mt-1">
            Discover software engineers, AI/ML developers, and designers based in Nagpur ready for full-time, hybrid, or remote roles.
          </p>
        </div>

        <Link
          href="/submit/talent"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm shrink-0"
        >
          <UserPlus className="h-4 w-4" /> Join Talent Directory
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {talents.map((talent) => (
          <Link
            key={talent.slug}
            href={`/talent/${talent.slug}`}
            className="p-5 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-bold text-base flex items-center justify-center border">
                  {talent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                {talent.openToWork && (
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    Available
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                {talent.name}
              </h3>
              <p className="text-xs font-medium text-foreground/80 mt-0.5">{talent.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                {talent.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {talent.primarySkills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-muted font-medium text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
                {talent.primarySkills.length > 4 && (
                  <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">
                    +{talent.primarySkills.length - 4}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 mt-4 border-t">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {talent.location}
              </span>
              <span>{talent.experienceYears}y exp • {talent.workPreference.toLowerCase()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
