"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, Briefcase, Calendar, Users, ArrowRight, X } from "lucide-react";
import { COMPANIES_DATA, JOBS_DATA, EVENTS_DATA, FOUNDERS_DATA } from "@/lib/data";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  // Keyboard shortcut Ctrl+K or Cmd+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredCompanies = React.useMemo(() => {
    if (!query.trim()) return COMPANIES_DATA.slice(0, 4);
    const q = query.toLowerCase();
    return COMPANIES_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q) ||
        c.locationName.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [query]);

  const filteredJobs = React.useMemo(() => {
    if (!query.trim()) return JOBS_DATA.slice(0, 3);
    const q = query.toLowerCase();
    return JOBS_DATA.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.skills.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [query]);

  const filteredEvents = React.useMemo(() => {
    if (!query.trim()) return EVENTS_DATA.slice(0, 2);
    const q = query.toLowerCase();
    return EVENTS_DATA.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [query]);

  const filteredFounders = React.useMemo(() => {
    if (!query.trim()) return FOUNDERS_DATA.slice(0, 2);
    const q = query.toLowerCase();
    return FOUNDERS_DATA.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.companyName.toLowerCase().includes(q) ||
        f.role.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [query]);

  const navigateTo = (url: string) => {
    setOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-muted-foreground bg-muted/60 hover:bg-muted rounded-lg border transition-colors group"
        aria-label="Search directory"
      >
        <Search className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
        <span className="hidden lg:inline">Search ecosystem...</span>
        <span className="lg:hidden inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-50 w-full max-w-2xl bg-card border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 border-b">
              <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search startups, jobs, founders, events, tech sectors..."
                className="w-full h-14 bg-transparent text-sm sm:text-base outline-none placeholder:text-muted-foreground text-foreground"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-muted-foreground hover:text-foreground rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 divide-y divide-border/40">
              {/* Companies */}
              {filteredCompanies.length > 0 && (
                <div className="space-y-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" /> Startups & Tech Companies
                  </div>
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.slug}
                      onClick={() => navigateTo(`/company/${company.slug}`)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-accent cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                          {company.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                            {company.name}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {company.sector} • {company.locationName}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {/* Jobs */}
              {filteredJobs.length > 0 && (
                <div className="pt-3 space-y-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> Active Job Openings
                  </div>
                  {filteredJobs.map((job) => (
                    <div
                      key={job.slug}
                      onClick={() => navigateTo(`/job/${job.slug}`)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-accent cursor-pointer transition-colors group"
                    >
                      <div>
                        <div className="text-sm font-medium group-hover:text-primary transition-colors">
                          {job.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {job.companyName} • {job.remoteType.replace("_", " ")} • {job.department}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {/* Events */}
              {filteredEvents.length > 0 && (
                <div className="pt-3 space-y-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Events & Meetups
                  </div>
                  {filteredEvents.map((event) => (
                    <div
                      key={event.slug}
                      onClick={() => navigateTo(`/event/${event.slug}`)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-accent cursor-pointer transition-colors group"
                    >
                      <div>
                        <div className="text-sm font-medium group-hover:text-primary transition-colors">
                          {event.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.date} • {event.venue}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {/* Founders */}
              {filteredFounders.length > 0 && (
                <div className="pt-3 space-y-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Founders & Leaders
                  </div>
                  {filteredFounders.map((founder) => (
                    <div
                      key={founder.slug}
                      onClick={() => navigateTo(`/founder/${founder.slug}`)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-accent cursor-pointer transition-colors group"
                    >
                      <div>
                        <div className="text-sm font-medium group-hover:text-primary transition-colors">
                          {founder.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {founder.role} • {founder.companyName}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {filteredCompanies.length === 0 &&
                filteredJobs.length === 0 &&
                filteredEvents.length === 0 &&
                filteredFounders.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    <p className="text-sm">No results found for &ldquo;{query}&rdquo;</p>
                    <p className="text-xs mt-1">Try searching by sector (e.g. AI, SaaS) or location (MIHAN, Sadar)</p>
                  </div>
                )}
            </div>

            {/* Footer with hint */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-t text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span>Navigate with click</span>
                <span>•</span>
                <span>ESC to close</span>
              </div>
              <div className="font-semibold text-primary">Nagpur Startup Map</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
