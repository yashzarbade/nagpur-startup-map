import Link from "next/link";
import { MapPin } from "lucide-react";
import { SITE } from "@/lib/constants";
import { MobileMenu } from "./mobile-menu";
import { GlobalSearch } from "@/components/global-search";
import { CitySelector } from "./city-selector";
import { NavLinks } from "./nav-links";
import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Left: Brand + City Selector */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg transition-colors hover:text-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline-block font-extrabold tracking-tight">
              {SITE.name}
            </span>
          </Link>

          <CitySelector />
        </div>

        {/* Desktop Navigation (City-Aware) */}
        <NavLinks />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Global Search command palette trigger */}
          <GlobalSearch />

          <Link
            href="/submit"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-2xs transition-colors hover:bg-primary/90"
          >
            Add Startup
          </Link>

          {/* User Auth Nav */}
          <UserNav />

          {/* Mobile menu trigger */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
