"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, ChevronDown, Check, Sparkles } from "lucide-react";

interface CityOption {
  slug: string;
  name: string;
  state: string;
  status: "LIVE" | "COMING_SOON";
}

const CITIES: CityOption[] = [
  {
    slug: "nagpur",
    name: "Nagpur",
    state: "Maharashtra",
    status: "LIVE",
  },
  {
    slug: "indore",
    name: "Indore",
    state: "Madhya Pradesh",
    status: "LIVE",
  },
  {
    slug: "bhopal",
    name: "Bhopal",
    state: "Madhya Pradesh",
    status: "LIVE",
  },
];

export function CitySelector() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Detect current city from pathname
  const currentCitySlug = React.useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] && CITIES.some((c) => c.slug === parts[0])) {
      return parts[0];
    }
    return "nagpur";
  }, [pathname]);

  const currentCity =
    CITIES.find((c) => c.slug === currentCitySlug) || CITIES[0];

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (city: CityOption) => {
    setOpen(false);
    if (city.slug === currentCitySlug) return;

    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] && CITIES.some((c) => c.slug === parts[0])) {
      // Replace city slug while preserving subpage (e.g. /nagpur/jobs -> /indore/jobs)
      parts[0] = city.slug;
      router.push(`/${parts.join("/")}`);
    } else {
      router.push(`/${city.slug}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border bg-card/80 px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-accent transition-colors"
        aria-expanded={open}
        aria-label="Select City"
      >
        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="truncate max-w-[90px] sm:max-w-none">
          {currentCity.name}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 mt-1.5 w-56 rounded-xl border bg-popover p-1.5 shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Select Startup Hub
          </div>
          <div className="space-y-1">
            {CITIES.map((city) => {
              const isSelected = city.slug === currentCitySlug;
              return (
                <button
                  key={city.slug}
                  onClick={() => handleSelectCity(city)}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? "bg-accent font-semibold text-foreground"
                      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      {city.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {city.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {city.status === "LIVE" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        Soon
                      </span>
                    )}
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-primary ml-1 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
