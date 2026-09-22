import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Briefcase, Calendar, User, Building2, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Submit to Nagpur Startup Map",
  description:
    "Add your startup, post a job, submit an event, or register as a founder on Nagpur Startup Map. All submissions are free.",
  alternates: { canonical: "/submit" },
};

const submitOptions = [
  {
    icon: Building2,
    title: "Add a Startup",
    description: "Get your company listed on Nagpur's startup map. Free listing includes company profile, sector, location, and team information.",
    href: "/submit/startup",
    badge: "Free",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    iconColor: "text-orange-500",
  },
  {
    icon: User,
    title: "Add a Founder",
    description: "Create a founder profile linked to a Nagpur startup. Showcase your journey and connect with the local ecosystem.",
    href: "/submit/founder",
    badge: "Free",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    iconColor: "text-blue-500",
  },
  {
    icon: Briefcase,
    title: "Post a Job",
    description: "Publish a job listing to reach developers, designers, and tech talent in Nagpur. Active for 30 days.",
    href: "/submit/job",
    badge: "Free during launch",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconColor: "text-emerald-500",
  },
  {
    icon: Calendar,
    title: "Add an Event",
    description: "Submit a tech meetup, hackathon, workshop, or networking event happening in Nagpur.",
    href: "/submit/event",
    badge: "Free",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    iconColor: "text-purple-500",
  },
];

export default function SubmitPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Add to Nagpur Startup Map</h1>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Help build the most complete directory of Nagpur&apos;s startup and technology ecosystem. All basic submissions are free.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {submitOptions.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className="group relative flex flex-col rounded-xl border bg-card p-6 card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50`}>
                  <option.icon className={`h-5 w-5 ${option.iconColor}`} />
                </div>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${option.color}`}>
                  {option.badge}
                </span>
              </div>
              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {option.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 flex-1">
                {option.description}
              </p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium text-primary">
                Get started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Claim company */}
        <div className="mt-8 rounded-xl border bg-muted/20 p-6 text-center">
          <h3 className="font-semibold mb-1">Already have a company listed?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Claim your company profile to update information, add jobs, and manage your listing.
          </p>
          <Link
            href="/startups"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Find and claim your company
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Promotion CTA */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/50 p-6 text-center">
          <h3 className="font-semibold mb-1">Want more visibility?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Feature your startup, job, or event at the top of listings and homepage.
          </p>
          <Link
            href="/advertise"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
          >
            View promotion options
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
