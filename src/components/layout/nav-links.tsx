"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const KNOWN_CITIES = ["nagpur", "indore", "bhopal"];

export function NavLinks() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const city = parts[0] && KNOWN_CITIES.includes(parts[0]) ? parts[0] : "nagpur";

  const navLinks = [
    { label: "Startups", href: `/${city}/startups` },
    { label: "Jobs", href: `/${city}/jobs` },
    { label: "Walk-Ins", href: `/walkins` },
    { label: "Events", href: `/${city}/events` },
    { label: "Founders", href: `/${city}/founders` },
    { label: "Hiring", href: `/${city}/hiring` },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "bg-accent text-accent-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
