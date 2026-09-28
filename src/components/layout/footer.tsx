import Link from "next/link";
import { MapPin } from "lucide-react";
import { SITE, SECTORS } from "@/lib/constants";

const footerLinks = {
  cities: [
    { label: "Nagpur Hub", href: "/nagpur" },
    { label: "Indore Hub", href: "/indore" },
    { label: "Bhopal Hub", href: "/bhopal" },
    { label: "Nagpur Jobs", href: "/nagpur/jobs" },
    { label: "Indore Jobs", href: "/indore/jobs" },
    { label: "Bhopal Jobs", href: "/bhopal/jobs" },
  ],
  discover: [
    { label: "Startups Directory", href: "/startups" },
    { label: "Jobs Board", href: "/jobs" },
    { label: "Walk-in Drives", href: "/walkins" },
    { label: "Tech Events", href: "/events" },
    { label: "Founders Network", href: "/founders" },
    { label: "Hiring Companies", href: "/hiring" },
    { label: "Local Talent Pool", href: "/talent" },
  ],
  sectors: SECTORS.slice(0, 6).map((s) => ({
    label: `${s.label} Startups`,
    href: `/startups/${s.slug}`,
  })),
  contribute: [
    { label: "Add Startup", href: "/submit/startup" },
    { label: "Post a Job", href: "/submit/job" },
    { label: "Post a Walk-In Drive", href: "/submit/walkin" },
    { label: "Add Event", href: "/submit/event" },
    { label: "Register as Talent", href: "/submit/talent" },
    { label: "Advertise with Us", href: "/advertise" },
  ],
  company: [
    { label: "About Platform", href: "/about" },
    { label: "Contact Team", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 pb-20 md:pb-0">
      <div className="container-page section-spacing">
        {/* Top section */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              {SITE.name}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Mapping Central India&apos;s leading tech, AI, SaaS, and employment ecosystems across Nagpur, Indore, and Bhopal.
            </p>
          </div>

          {/* Hubs & Cities */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Startup Hubs</h3>
            <ul className="space-y-2">
              {footerLinks.cities.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Discover</h3>
            <ul className="space-y-2">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contribute */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Contribute</h3>
            <ul className="space-y-2">
              {footerLinks.contribute.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="hidden lg:block">
            <h3 className="text-sm font-semibold mb-3">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. Empowering Central India tech founders and builders.
          </p>
          <div className="flex gap-4">
            {footerLinks.company.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
