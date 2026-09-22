"use client";

import * as React from "react";
import Link from "next/link";
import { Users, CheckCircle2, ArrowLeft, Send } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function SubmitFounderPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    role: "Founder & CEO",
    companyName: "",
    companyWebsite: "",
    bio: "",
    linkedinUrl: "",
    twitterUrl: "",
    location: "Nagpur",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="container-page py-8 max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Submit", href: "/submit" },
          { label: "Add a Founder" },
        ]}
      />

      <div className="my-6">
        <Link
          href="/submit"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3 w-3" /> Back to options
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Founder Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Showcase your entrepreneurial journey, connect with Nagpur&apos;s startup ecosystem, and represent your venture.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl border bg-card text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Profile Created!</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Founder profile for <strong>{formData.name}</strong> ({formData.companyName}) has been submitted and will be verified shortly.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/founders"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
            >
              Browse Founders Directory
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 rounded-2xl border shadow-sm">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shashank Dixit"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Role / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Founder & CEO / Co-Founder & CTO"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Associated Company *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. InfoCepts"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Company Website</label>
                <input
                  type="url"
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  placeholder="https://company.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Founder Bio *</label>
              <textarea
                rows={4}
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Background, education (VNIT, RCOEM, IIMN etc.), past experience, and vision for the company..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Contact Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="founder@company.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Publish Founder Profile"} <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
