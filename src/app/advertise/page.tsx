import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, CheckCircle2, Building2, Briefcase, Calendar, Rocket, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Promote Your Startup & Jobs in Nagpur | Advertising",
  description: "Promote your startup, hire top talent, and sponsor Nagpur's fastest growing tech ecosystem platform.",
  alternates: { canonical: "/advertise" },
};

export default function AdvertisePage() {
  const plans = [
    {
      title: "Featured Startup",
      price: "₹2,999",
      period: "per month",
      description: "Maximum visibility for high-growth Nagpur startups looking for talent, clients, and investors.",
      features: [
        "Pinned placement in Sector & Homepage directories",
        "Gold 'Featured' badge & visual highlight",
        "Direct Dofollow backlink to your website",
        "Social spotlight on LinkedIn & Twitter",
        "Priority support & direct profile claim",
      ],
      cta: "Feature Your Company",
      href: "/contact?subject=sponsorship",
      popular: true,
      icon: Building2,
    },
    {
      title: "Featured Job Opening",
      price: "₹999",
      period: "per 30 days",
      description: "Put your job directly in front of thousands of active developers, designers, and students in Nagpur.",
      features: [
        "Top pinned position on Jobs directory for 30 days",
        "Highlighted job card with special border",
        "Included in weekly Nagpur Tech Job Alert email",
        "Direct link to your application portal or ATS",
        "Social share to 2,000+ local tech members",
      ],
      cta: "Post Featured Job",
      href: "/submit/job",
      popular: false,
      icon: Briefcase,
    },
    {
      title: "Ecosystem Partner",
      price: "₹9,999",
      period: "per quarter",
      description: "For VC funds, law firms, cloud providers, and accelerators seeking deep footprint in Central India.",
      features: [
        "Logo in header & footer across entire platform",
        "Dedicated Ecosystem Partner profile & article",
        "Quarterly sponsored newsletter placement",
        "VIP invitations to Demo Days & Meetups",
        "Access to verified talent & startup directory data",
      ],
      cta: "Become a Partner",
      href: "/contact?subject=partnership",
      popular: false,
      icon: Sparkles,
    },
  ];

  return (
    <div className="container-page py-8 max-w-5xl mx-auto">
      <Breadcrumbs items={[{ label: "Advertise" }]} />

      <div className="my-8 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <Sparkles className="h-3.5 w-3.5" /> High-Intent Reach
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Reach Nagpur&apos;s Tech & Startup Leaders
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Connect directly with software engineers, founders, job candidates, and enterprise leaders building in Nagpur.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 my-12">
        {plans.map((plan) => (
          <div
            key={plan.title}
            className={`p-6 sm:p-8 rounded-2xl border bg-card flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all ${
              plan.popular ? "border-primary ring-2 ring-primary/20" : ""
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                Most Popular
              </span>
            )}

            <div>
              <plan.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-xl font-bold">{plan.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 min-h-[36px]">
                {plan.description}
              </p>

              <div className="my-6">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="text-xs text-muted-foreground ml-1.5">{plan.period}</span>
              </div>

              <div className="space-y-2.5 pt-4 border-t text-xs">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href={plan.href}
                className={`w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-sm ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border hover:bg-accent"
                }`}
              >
                {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
