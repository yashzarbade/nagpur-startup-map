"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const mobileLinks = [
  { label: "Startups", href: "/startups" },
  { label: "Jobs", href: "/jobs" },
  { label: "Events", href: "/events" },
  { label: "Founders", href: "/founders" },
  { label: "Hiring", href: "/hiring" },
  { label: "Talent", href: "/talent" },
  { label: "Submit", href: "/submit" },
  { label: "Advertise", href: "/advertise" },
  { label: "About", href: "/about" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 z-50 border-b bg-background shadow-lg animate-fade-in">
          <nav className="container-page py-4" aria-label="Mobile navigation">
            <ul className="space-y-1">
              {mobileLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
