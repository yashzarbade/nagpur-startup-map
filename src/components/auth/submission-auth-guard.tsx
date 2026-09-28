"use client";

import * as React from "react";
import Link from "next/link";
import { Lock, LogIn, ArrowRight, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SITE } from "@/lib/constants";

interface SubmissionAuthGuardProps {
  children: React.ReactNode;
  returnTo: string;
  submissionTypeName: string;
}

export function SubmissionAuthGuard({
  children,
  returnTo,
  submissionTypeName,
}: SubmissionAuthGuardProps) {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card p-12 text-center">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-3xl border bg-card p-8 sm:p-12 text-center shadow-xs space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
          <Lock className="h-6 w-6" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to submit {submissionTypeName}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Please log in or create an account to submit content to {SITE.name}. This ensures quality listings and lets you track your submission moderation in real time.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Continue</span>
          </Link>
          <Link
            href={`/login?mode=signup&returnTo=${encodeURIComponent(returnTo)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border bg-muted/50 px-6 py-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <span>Create Account</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="pt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Community Moderation • Safe &amp; Spam-Protected</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
