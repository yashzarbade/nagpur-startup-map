import Link from "next/link";
import {
  MapPin,
  Menu,
  Search,
  X,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { MobileMenu } from "./mobile-menu";
import { GlobalSearch } from "@/components/global-search";

const navLinks = [
  { label: "Startups", href: "/startups" },
  { label: "Jobs", href: "/jobs" },
  { label: "Events", href: "/events" },
  { label: "Founders", href: "/founders" },
  { label: "Hiring", href: "/hiring" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg transition-colors hover:text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline-block">
            {SITE.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Global Search command palette trigger */}
          <GlobalSearch />

          <Link
            href="/submit"
            className="hidden sm:inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Add Startup
          </Link>

          {/* Mobile menu trigger */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
