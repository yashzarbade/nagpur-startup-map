"use client";

import * as React from "react";
import Link from "next/link";
import { Users, CheckCircle2, ArrowLeft, Send } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function SubmitTalentPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    title: "",
    bio: "",
    location: "Nagpur",
    experienceYears: "3",
    skills: "",
    workPreference: "HYBRID",
    openToWork: true,
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
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
          { label: "Join Talent Directory" },
        ]}
      />

      <div className="my-6">
        <Link
          href="/talent"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3 w-3" /> Back to talent directory
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Join Nagpur Tech Talent Network</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a public profile to get discovered by Nagpur startups, remote engineering teams, and fast-growing technology companies.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl border bg-card text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Profile Created!</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Welcome to the network, <strong>{formData.name}</strong>! Your profile is now pending brief verification and will appear in the talent directory shortly.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/talent"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
            >
              View Talent Directory
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
                  placeholder="e.g. Aditya Deshmukh"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Professional Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Full Stack Engineer / UI Designer"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Work Preference</label>
                <select
                  value={formData.workPreference}
                  onChange={(e) => setFormData({ ...formData, workPreference: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="HYBRID">Hybrid (Nagpur)</option>
                  <option value="REMOTE">Remote</option>
                  <option value="ON_SITE">On-site (Nagpur)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Primary Skills (comma-separated) *</label>
              <input
                type="text"
                required
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="TypeScript, Next.js, Python, Docker, Tailwind CSS, PostgreSQL"
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Bio & Background *</label>
              <textarea
                rows={4}
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell recruiters about your background, projects you've built, and what roles excite you..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">GitHub URL</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Portfolio URL</label>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://yourname.dev"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Contact Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@email.com"
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Joining..." : "Join Nagpur Talent Network"} <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
