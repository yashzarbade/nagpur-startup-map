import Link from "next/link";
import { Sparkles, MapPin, Building2, Bell, ArrowRight, ArrowLeft } from "lucide-react";
import type { City } from "@/types";

interface CityComingSoonProps {
  city: City;
}

export function CityComingSoon({ city }: CityComingSoonProps) {
  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground mb-6">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Ecosystem In Progress • Coming Soon</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
          {city.name} Startup Map is{" "}
          <span className="text-gradient">Launching Soon</span>
        </h1>

        {/* Description */}
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          We are currently mapping the emerging startup and technology landscape in{" "}
          <strong className="text-foreground">{city.name}, {city.state}</strong>. We do not display mock or unverified listings to maintain 100% data integrity.
        </p>

        {/* City Info Card */}
        <div className="mt-8 rounded-2xl border bg-card/60 p-6 text-left shadow-xs backdrop-blur-sm">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground mb-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>About {city.name}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {city.description ||
              `${city.name} is one of Central India's premier commercial and educational hubs, rapidly fostering tech innovation, entrepreneurship, and talent.`}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Building2 className="h-4 w-4" />
            <span>Add a {city.name} Startup</span>
          </Link>
          <Link
            href="/nagpur"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent"
          >
            <span>Explore Nagpur Ecosystem</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>

        {/* Bottom link */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Cities</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
