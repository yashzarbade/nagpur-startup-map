"use client";

import * as React from "react";
import Link from "next/link";
import { Briefcase, CheckCircle2, ArrowLeft, Send } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function SubmitJobPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: "",
    companyName: "",
    companyWebsite: "",
    department: "Engineering",
    location: "Nagpur",
    remoteType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceMin: "1",
    experienceMax: "4",
    salaryMin: "600000",
    salaryMax: "1200000",
    skills: "",
    description: "",
    applicationUrl: "",
    contactEmail: "",
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
          { label: "Post a Job" },
        ]}
      />

      <div className="my-6">
        <Link
          href="/submit"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3 w-3" /> Back to options
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Post a Job Opening in Nagpur</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Publish your opening to connect with qualified developers, designers, and tech professionals across Nagpur. Free during ecosystem launch.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl border bg-card text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Job Submitted Successfully!</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your role &ldquo;{formData.title}&rdquo; at <strong>{formData.companyName}</strong> has been received and will go live on the jobs board following basic moderation.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/jobs"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
            >
              View Active Jobs
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors"
            >
              Post Another Job
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 rounded-2xl border shadow-sm">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Full Stack Developer"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Hiring Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Immverse AI"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="DevOps">DevOps & Cloud</option>
                  <option value="Marketing">Marketing & Growth</option>
                  <option value="Operations">Operations / Sales</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Workplace Policy</label>
                <select
                  value={formData.remoteType}
                  onChange={(e) => setFormData({ ...formData, remoteType: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="HYBRID">Hybrid (Nagpur office)</option>
                  <option value="ON_SITE">On-site (Nagpur)</option>
                  <option value="REMOTE">Remote (Nagpur-friendly)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Employment Type</label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Annual Salary Min (₹ INR)</label>
                <input
                  type="number"
                  step="50000"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                  placeholder="e.g. 600000"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Annual Salary Max (₹ INR)</label>
                <input
                  type="number"
                  step="50000"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                  placeholder="e.g. 1400000"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Key Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React, Next.js, Node.js, TypeScript, PostgreSQL"
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Job Description *</label>
              <textarea
                rows={5}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Outline responsibilities, requirements, benefits, and tech stack..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Application URL or Email *</label>
                <input
                  type="text"
                  required
                  value={formData.applicationUrl}
                  onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                  placeholder="https://careers.company.com/role or jobs@company.com"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Poster Contact Email</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="hr@company.com"
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
            {loading ? "Publishing..." : "Post Job Opening"} <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
