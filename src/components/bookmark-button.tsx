"use client";

import * as React from "react";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleSaveJobAction, toggleSaveCompanyAction } from "@/app/auth/actions";

interface BookmarkButtonProps {
  type: "job" | "company";
  id: number;
  initialSaved?: boolean;
  className?: string;
}

export function BookmarkButton({
  type,
  id,
  initialSaved = false,
  className = "",
}: BookmarkButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = React.useState(initialSaved);
  const [loading, setLoading] = React.useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      if (type === "job") {
        const res = await toggleSaveJobAction(id);
        if (res.requiresLogin) {
          router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
        } else if (res.saved !== undefined) {
          setSaved(res.saved);
        }
      } else {
        const res = await toggleSaveCompanyAction(id);
        if (res.requiresLogin) {
          router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
        } else if (res.saved !== undefined) {
          setSaved(res.saved);
        }
      }
    } catch (err) {
      console.error("Bookmark toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`p-1.5 rounded-lg border transition-colors ${
        saved
          ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
          : "bg-background/80 text-muted-foreground border-border hover:text-foreground hover:bg-accent"
      } ${className}`}
      title={saved ? "Remove from saved" : "Save / Bookmark"}
      aria-label={saved ? "Remove from saved" : "Save / Bookmark"}
    >
      <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-primary" : ""}`} />
    </button>
  );
}
