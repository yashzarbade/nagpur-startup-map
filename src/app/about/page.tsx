import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Building2, Users, Rocket, Award, GraduationCap, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Nagpur Startup Map — Central India's Tech Ecosystem",
  description: "The living platform documenting and empowering Nagpur's startups, tech companies, founders, developers, and opportunities.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container-page py-8 max-w-4xl mx-auto">
      <Breadcrumbs items={[{ label: "About" }]} />

      <div className="my-8 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          <MapPin className="h-3.5 w-3.5" /> Nagpur, Maharashtra
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Nagpur&apos;s Tech Ecosystem, In One Place.
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
          Nagpur Startup Map is dedicated to mapping, celebrating, and accelerating Central India&apos;s fastest-growing technology and startup hub.
        </p>
      </div>

      <div className="space-y-12 mt-12">
        {/* Mission Card */}
        <div className="p-8 rounded-2xl border bg-card shadow-sm space-y-4">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            For years, the story of Indian technology was told only through Bengaluru, Mumbai, Pune, and Hyderabad. But Central India has always possessed deep engineering acumen, premier academic institutions like VNIT and IIM Nagpur, and homegrown giants like InfoCepts and Persistent Systems.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            <strong>Nagpur Startup Map</strong> is the single source of truth for founders, job seekers, students, investors, and community leaders. We believe transparent discoverability is the highest leverage tool to bring investment, retain local talent, and foster serendipitous connections across Vidarbha.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl border bg-card space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">Directory & Map</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every verified startup, enterprise delivery center in MIHAN, and software product company indexed with precision.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Rocket className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">Local Jobs</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Connecting talented engineers, designers, and interns directly with companies that are actively hiring right here in Nagpur.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">Community & Events</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tracking tech meetups, hackathons, demo days, and founder gatherings hosted by eChai, VNIT E-Cell, and IIM InFED.
            </p>
          </div>
        </div>

        {/* Academic & Infrastructure Pillars */}
        <div className="p-8 rounded-2xl border bg-card shadow-sm space-y-6">
          <h2 className="text-2xl font-bold">Nagpur&apos;s Strategic Tech Pillars</h2>

          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /> Premier Academic Base
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Home to the Visvesvaraya National Institute of Technology (VNIT), Indian Institute of Management (IIM Nagpur), IIIT Nagpur, and prestigious engineering colleges like RCOEM and YCCE producing thousands of engineers annually.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> MIHAN SEZ Tech Hub
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A massive multi-modal hub hosting global scale facilities for TCS, Infosys, Tech Mahindra, HCLTech, and Hexaware, creating a dense technical workforce in Central India.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="p-8 rounded-2xl bg-primary text-primary-foreground text-center space-y-4 shadow-lg">
          <h2 className="text-2xl font-bold">Be Part of Nagpur&apos;s Tech Story</h2>
          <p className="text-xs sm:text-sm text-primary-foreground/90 max-w-lg mx-auto">
            Whether you&apos;re a founder building in stealth, an engineer seeking your next challenge, or an event organizer — help make the map complete.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/submit"
              className="px-5 py-2.5 rounded-xl bg-background text-foreground font-semibold text-xs hover:bg-background/90 transition-colors shadow-sm"
            >
              Add Your Company
            </Link>
            <Link
              href="/startups"
              className="px-5 py-2.5 rounded-xl border border-primary-foreground/30 text-primary-foreground font-semibold text-xs hover:bg-primary-foreground/10 transition-colors"
            >
              Explore Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
