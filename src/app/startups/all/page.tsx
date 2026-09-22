import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";
import { getAllCompanies, CompanyData } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Startups & Tech Companies in Nagpur (A-Z Directory)",
  description: "Complete alphabetical directory of all verified startups, software firms, AI companies, and IT services in Nagpur, Maharashtra.",
  alternates: { canonical: "/startups/all" },
};

export default function AllStartupsAlphabeticalPage() {
  const companies = [...getAllCompanies()].sort((a, b) => a.name.localeCompare(b.name));

  // Group by first letter
  const grouped: Record<string, CompanyData[]> = {};
  companies.forEach((company) => {
    const letter = company.name.charAt(0).toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : "#";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(company);
  });

  const letters = Object.keys(grouped).sort();

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: "Startups", href: "/startups" },
          { label: "A-Z Directory" },
        ]}
      />

      <div className="my-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Nagpur Startups A-Z Directory
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          Complete index of all {companies.length} verified startups, technology companies, and digital ventures in Nagpur.
        </p>
      </div>

      {/* Alphabet Jump Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl border bg-muted/40 mb-8 sticky top-20 z-20 backdrop-blur-md">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-background hover:bg-primary hover:text-primary-foreground border text-xs font-bold transition-colors"
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Grouped Companies List */}
      <div className="space-y-10">
        {letters.map((letter) => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-36">
            <div className="flex items-center gap-3 border-b pb-2 mb-4">
              <span className="text-2xl font-black text-primary">{letter}</span>
              <span className="text-xs text-muted-foreground font-medium">
                ({grouped[letter].length} {grouped[letter].length === 1 ? "company" : "companies"})
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[letter].map((c) => (
                <Link
                  key={c.slug}
                  href={`/company/${c.slug}`}
                  className="p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm sm:text-base group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {c.name}
                        {c.verificationStatus === "VERIFIED" && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        )}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                        {c.sector}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">
                      {c.descriptionShort}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 mt-3 border-t">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {c.locationName}
                    </span>
                    {c.hiring && (
                      <span className="text-emerald-600 font-semibold text-[11px]">Hiring</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
