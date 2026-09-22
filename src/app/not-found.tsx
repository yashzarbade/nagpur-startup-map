import Link from "next/link";
import { Search, Building2, Briefcase, Calendar, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center min-h-[60vh] text-center py-20">
      <div className="mb-6">
        <span className="text-7xl font-bold text-muted-foreground/20">404</span>
      </div>
      <h1 className="text-2xl font-bold mb-2">We couldn&apos;t find that page.</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Try searching or explore the links below.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 max-w-md w-full">
        <Link
          href="/startups"
          className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Building2 className="h-4 w-4 text-primary" />
          Search Nagpur Startups
        </Link>
        <Link
          href="/jobs"
          className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Briefcase className="h-4 w-4 text-primary" />
          Explore Jobs
        </Link>
        <Link
          href="/events"
          className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Calendar className="h-4 w-4 text-primary" />
          Explore Events
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Home className="h-4 w-4 text-primary" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
