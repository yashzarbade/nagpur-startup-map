import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string | undefined>;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && key !== "page") {
        params.set(key, value);
      }
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  };

  // Generate visible page range
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className="flex items-center gap-1.5 text-xs sm:text-sm font-medium"
    >
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-lg border bg-card px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border bg-muted/40 px-3 py-1.5 text-muted-foreground/50 cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {/* First Page Link if range starts beyond 1 */}
      {start > 1 && (
        <>
          <Link
            href={buildPageUrl(1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-card text-foreground hover:bg-muted transition-colors"
          >
            1
          </Link>
          {start > 2 && <span className="px-1 text-muted-foreground">...</span>}
        </>
      )}

      {/* Numbered Page Buttons */}
      {pages.map((p) => {
        const isCurrent = p === currentPage;
        return isCurrent ? (
          <span
            key={p}
            aria-current="page"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={buildPageUrl(p)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-card text-foreground hover:bg-muted transition-colors"
          >
            {p}
          </Link>
        );
      })}

      {/* Last Page Link if range ends before totalPages */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-muted-foreground">...</span>}
          <Link
            href={buildPageUrl(totalPages)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-card text-foreground hover:bg-muted transition-colors"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-lg border bg-card px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-lg border bg-muted/40 px-3 py-1.5 text-muted-foreground/50 cursor-not-allowed">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
