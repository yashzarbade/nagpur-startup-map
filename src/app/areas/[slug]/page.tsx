import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CompanyCard } from "@/components/company-card";
import { EmptyState } from "@/components/empty-state";
import { SITE, AREAS } from "@/lib/constants";
import { getCompaniesByArea, getAllCompanies } from "@/lib/data";

const AREA_DESCRIPTIONS: Record<string, string> = {
  "mihan": "Multi-modal International Cargo Hub and Airport SEZ — home to major global IT tech giants like TCS, Infosys, Tech Mahindra, GlobalLogic, Hexaware and HCLTech.",
  "it-park": "Nagpur's dedicated Information Technology Park, housing enterprise software engineering hubs like Persistent Systems, Ceinsys, Trust Fintech, Micropro, and Perficient.",
  "dharampeth": "A bustling commercial and tech district featuring homegrown global data leaders like InfoCepts, Coursefinder.ai, and digital agencies.",
  "civil-lines": "Nagpur's administrative and upscale district, nurturing innovative AI research labs, digital agencies, KCyber Experts, and CropData.",
  "ramdaspeth": "Prominent business district hosting Corpay Technologies GCC, YourPhysio, and enterprise software firms.",
  "sadar": "Central commercial zone hosting pioneer enterprise SaaS, software consultancies, and digital agencies.",
  "hingna": "Industrial and aerospace engineering hub hosting drone startups like Aerizone Creative Labs and Aerovania.",
  "pratap-nagar": "Vibrant South-West Nagpur tech neighborhood with software engineering studios like TechQuadra and Flappic.",
  "bajaj-nagar": "Active software development pocket near VNIT housing companies like Tantransh Solutions.",
  "besa": "Emerging tech and innovation corridor home to digital healthcare leader Kratin and Lemon Ideas.",
  "central-avenue": "Key commerce artery in East Nagpur hosting fast-growing marketplaces like Frikly and software firms like Atina Technology.",
  "gandhibagh": "Central commercial district and home to e-commerce and retail technology innovators.",
  "itwari": "Historic trade center and registered base of consumer electronics brand Wings Lifestyle.",
  "new-nandanvan": "East Nagpur technology base housing India's largest educational ERP firm, MasterSoft.",
  "manewada": "Rapidly expanding tech and education cluster home to Tech Lync and Hesten Solutions.",
  "trimurti-nagar": "South-West tech neighborhood housing cybersecurity and threat intelligence firms like Infocryon.",
  "katol-road": "North-West tech hub home to cloud engineering and enterprise IT consulting firm Bloom Consulting Services.",
  "koradi-road": "North Nagpur corridor hosting digital agencies and travel tech platforms like Trivo IT Solutions.",
  "wathoda": "East Nagpur technology zone home to embedded systems and IoT automation startup Sensify Technologies.",
  "vivekanand-nagar": "Wardha Road commercial hub housing core banking software provider Virtual Galaxy Infotech.",
  "ghat-road": "Central commercial zone home to cybersecurity testing and defense labs like CyberBugs.",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return AREAS.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = AREAS.find((a) => a.slug === slug);
  const areaName = area ? area.label : slug.replace(/-/g, " ");

  return {
    title: `Tech Companies & Startups in ${areaName}, Nagpur`,
    description: `Browse verified technology companies, IT offices, and startups located in ${areaName}, Nagpur.`,
    alternates: { canonical: `/areas/${slug}` },
    openGraph: {
      title: `Startups in ${areaName} | ${SITE.name}`,
      description: `Explore tech companies in ${areaName}, Nagpur.`,
      url: `${SITE.url}/areas/${slug}`,
    },
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = AREAS.find((a) => a.slug === slug);
  const areaName = area ? area.label : slug.replace(/-/g, " ");

  const companies = getCompaniesByArea(slug);

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { label: "Startups", href: "/startups" },
          { label: `${areaName}` },
        ]}
      />

      {/* Header */}
      <div className="my-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <MapPin className="h-3.5 w-3.5" /> Innovation Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Tech Companies in {areaName}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          {AREA_DESCRIPTIONS[slug] || `Explore technology companies, software studios, and startups located in ${areaName}, Nagpur.`}
        </p>
      </div>

      {/* Area Navigation pills */}
      <div className="flex flex-wrap gap-2 pb-6 border-b mb-6">
        {AREAS.map((a) => (
          <Link
            key={a.slug}
            href={`/areas/${a.slug}`}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              a.slug === slug
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {a.label}
          </Link>
        ))}
      </div>

      {/* Companies List */}
      {companies.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.slug} {...company} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No companies listed in ${areaName} yet`}
          description={`Is your tech company located in ${areaName}? Get listed on the Nagpur Startup Map.`}
          actionLabel="Submit Your Startup"
          actionHref="/submit"
        />
      )}
    </div>
  );
}
