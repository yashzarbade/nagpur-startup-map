"use client";

import * as React from "react";
import Link from "next/link";
import { User, LogOut, Bookmark, FileText, Settings, Sparkles, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/app/auth/actions";

export function UserNav() {
  const [user, setUser] = React.useState<any>(null);
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const supabase = createClient();

    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen to changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center justify-center rounded-lg border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-accent transition-colors"
      >
        Sign In
      </Link>
    );
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border bg-card/90 px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-accent transition-colors"
        aria-expanded={open}
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="max-w-[80px] sm:max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-52 rounded-xl border bg-popover p-1.5 shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          <div className="px-2.5 py-2 border-b mb-1">
            <div className="text-xs font-semibold text-foreground truncate">
              {displayName}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {user.email}
            </div>
          </div>

          <div className="space-y-0.5">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard?tab=submissions"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>My Submissions</span>
            </Link>

            <Link
              href="/dashboard?tab=saved"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Saved Items</span>
            </Link>

            <Link
              href="/dashboard?tab=profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Edit Profile</span>
            </Link>
          </div>

          <div className="border-t mt-1 pt-1">
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
