"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, CheckCircle2, ArrowLeft, Send, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SECTORS } from "@/lib/constants";

export default function SubmitStartupPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    websiteUrl: "",
    sector: "AI",
    locationName: "MIHAN",
    descriptionShort: "",
    descriptionLong: "",
    foundedYear: "2024",
    teamSize: "11-50",
    hiring: false,
    careersUrl: "",
    founderName: "",
    founderRole: "Founder & CEO",
    founderLinkedin: "",
    submitterEmail: "",
    tags: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission / server action
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
          { label: "Add a Startup" },
        ]}
      />

      <div className="my-6">
        <Link
          href="/submit"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3 w-3" /> Back to options
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add Your Startup or Company</h1>
        <p className="text-sm text-muted-foreground mt-1">
          List your company on Nagpur&apos;s ecosystem directory. Free basic listing with verified badge review within 24 hours.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl border bg-card text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Submission Received!</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Thank you for submitting <strong>{formData.name}</strong> to the Nagpur Startup Map. Our local moderation team will review the details and publish the profile.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/startups"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
            >
              Explore Startups
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  websiteUrl: "",
                  sector: "AI",
                  locationName: "MIHAN",
                  descriptionShort: "",
                  descriptionLong: "",
                  foundedYear: "2024",
                  teamSize: "11-50",
                  hiring: false,
                  careersUrl: "",
                  founderName: "",
                  founderRole: "Founder & CEO",
                  founderLinkedin: "",
                  submitterEmail: "",
                  tags: "",
                });
              }}
              className="px-5 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 rounded-2xl border shadow-sm">
          {/* Company Essentials */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground border-b pb-2">1. Company Details</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Acme Technologies"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Website URL *</label>
                <input
                  type="url"
                  required
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Primary Sector *</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  {SECTORS.map((s) => (
                    <option key={s.slug} value={s.label}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Location / Area in Nagpur *</label>
                <select
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="MIHAN">MIHAN SEZ</option>
                  <option value="IT Park">IT Park (Gayatri Nagar)</option>
                  <option value="Dharampeth">Dharampeth</option>
                  <option value="Civil Lines">Civil Lines</option>
                  <option value="Sadar">Sadar</option>
                  <option value="Wardha Road">Wardha Road</option>
                  <option value="Pratap Nagar">Pratap Nagar</option>
                  <option value="Laxmi Nagar">Laxmi Nagar</option>
                  <option value="Ramdaspeth">Ramdaspeth</option>
                  <option value="Sitabuldi">Sitabuldi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Short Elevator Pitch (Max 140 chars) *</label>
              <input
                type="text"
                required
                maxLength={140}
                value={formData.descriptionShort}
                onChange={(e) => setFormData({ ...formData, descriptionShort: e.target.value })}
                placeholder="Brief one-sentence description of what your company does"
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Full Company Description</label>
              <textarea
                rows={4}
                value={formData.descriptionLong}
                onChange={(e) => setFormData({ ...formData, descriptionLong: e.target.value })}
                placeholder="Detailed background, products, services, milestones..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Founded Year</label>
                <input
                  type="number"
                  min="1980"
                  max="2026"
                  value={formData.foundedYear}
                  onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Team Size</label>
                <select
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="hiring"
                checked={formData.hiring}
                onChange={(e) => setFormData({ ...formData, hiring: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="hiring" className="text-xs font-semibold cursor-pointer">
                Are you actively hiring in Nagpur right now?
              </label>
            </div>

            {formData.hiring && (
              <div>
                <label className="text-xs font-semibold block mb-1.5">Careers Page URL</label>
                <input
                  type="url"
                  value={formData.careersUrl}
                  onChange={(e) => setFormData({ ...formData, careersUrl: e.target.value })}
                  placeholder="https://example.com/careers"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            )}
          </div>

          {/* Founder & Submitter Info */}
          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-base font-bold text-foreground border-b pb-2">2. Founder & Contact</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Founder Name</label>
                <input
                  type="text"
                  value={formData.founderName}
                  onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                  placeholder="Founder full name"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Founder LinkedIn</label>
                <input
                  type="url"
                  value={formData.founderLinkedin}
                  onChange={(e) => setFormData({ ...formData, founderLinkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Submitter Email (for verification) *</label>
              <input
                type="email"
                required
                value={formData.submitterEmail}
                onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                We will send confirmation updates and claim codes to this email.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Startup for Verification"} <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
