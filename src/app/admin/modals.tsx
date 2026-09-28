"use client";

import * as React from "react";
import { X, Loader2, Sparkles, Building2, Briefcase, Calendar, MapPin } from "lucide-react";
import type { CompanyAdminInput, JobAdminInput, EventAdminInput } from "@/app/admin/actions";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function BaseModal({ isOpen, onClose, title, icon, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-50">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-card border shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b px-5 py-4 bg-muted/30">
          <div className="flex items-center gap-2.5">
            {icon}
            <h3 className="text-base font-bold text-foreground">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Company Modal ──────────────────────────────────────────────────────────

export function CompanyModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CompanyAdminInput) => Promise<void>;
  initialData?: any;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<CompanyAdminInput>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    cityId: initialData?.cityId || 1,
    websiteUrl: initialData?.websiteUrl || "",
    linkedinUrl: initialData?.linkedinUrl || "",
    sector: initialData?.sector || "Software",
    companyType: initialData?.companyType || "Startup",
    stage: initialData?.stage || "BOOTSTRAPPED",
    foundedYear: initialData?.foundedYear || new Date().getFullYear(),
    teamSize: initialData?.teamSize || "11-50",
    locationName: initialData?.locationName || "",
    address: initialData?.address || "",
    latitude: initialData?.latitude || "",
    longitude: initialData?.longitude || "",
    descriptionShort: initialData?.descriptionShort || "",
    descriptionLong: initialData?.descriptionLong || "",
    hiring: !!initialData?.hiring,
    featured: !!initialData?.featured,
    verificationStatus: initialData?.verificationStatus || "VERIFIED",
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        cityId: initialData.cityId || 1,
        websiteUrl: initialData.websiteUrl || "",
        linkedinUrl: initialData.linkedinUrl || "",
        sector: initialData.sector || "Software",
        companyType: initialData.companyType || "Startup",
        stage: initialData.stage || "BOOTSTRAPPED",
        foundedYear: initialData.foundedYear || new Date().getFullYear(),
        teamSize: initialData.teamSize || "11-50",
        locationName: initialData.locationName || "",
        address: initialData.address || "",
        latitude: initialData.latitude ? String(initialData.latitude) : "",
        longitude: initialData.longitude ? String(initialData.longitude) : "",
        descriptionShort: initialData.descriptionShort || "",
        descriptionLong: initialData.descriptionLong || "",
        hiring: !!initialData.hiring,
        featured: !!initialData.featured,
        verificationStatus: initialData.verificationStatus || "VERIFIED",
      });
    } else {
      setFormData({
        name: "",
        cityId: 1,
        websiteUrl: "",
        linkedinUrl: "",
        sector: "Software",
        companyType: "Startup",
        stage: "BOOTSTRAPPED",
        foundedYear: new Date().getFullYear(),
        teamSize: "11-50",
        locationName: "",
        address: "",
        latitude: "",
        longitude: "",
        descriptionShort: "",
        descriptionLong: "",
        hiring: false,
        featured: false,
        verificationStatus: "VERIFIED",
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Company name is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Company: ${initialData.name}` : "Add New Company / Startup"}
      icon={<Building2 className="h-5 w-5 text-primary" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-destructive font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="e.g. InfoBeans Technologies"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">City *</label>
            <select
              value={formData.cityId}
              onChange={(e) => setFormData({ ...formData, cityId: Number(e.target.value) })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-medium"
            >
              <option value={1}>Nagpur (Maharashtra)</option>
              <option value={3}>Indore (Madhya Pradesh)</option>
              <option value={6}>Bhopal (Madhya Pradesh)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">Website URL</label>
            <input
              type="url"
              value={formData.websiteUrl || ""}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedinUrl || ""}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="https://linkedin.com/company/example"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">Sector</label>
            <input
              type="text"
              value={formData.sector || ""}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="e.g. AI / SaaS"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Company Type</label>
            <select
              value={formData.companyType || "Startup"}
              onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
            >
              <option value="Startup">Startup</option>
              <option value="Tech Company">Tech Company</option>
              <option value="IT Services">IT Services</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Product Company">Product Company</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Stage</label>
            <select
              value={formData.stage || "BOOTSTRAPPED"}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
            >
              <option value="BOOTSTRAPPED">Bootstrapped</option>
              <option value="SEED">Seed</option>
              <option value="SERIES_A">Series A</option>
              <option value="GROWTH">Growth</option>
              <option value="PUBLIC">Public</option>
              <option value="ACQUIRED">Acquired</option>
              <option value="UNKNOWN">Unknown</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">Founded Year</label>
            <input
              type="number"
              value={formData.foundedYear || ""}
              onChange={(e) => setFormData({ ...formData, foundedYear: Number(e.target.value) || null })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="2020"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Team Size</label>
            <select
              value={formData.teamSize || "11-50"}
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
            >
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="500-1000">500-1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Locality / Area</label>
            <input
              type="text"
              value={formData.locationName || ""}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="e.g. IT Park / Vijay Nagar"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="block font-semibold text-foreground mb-1">Latitude</label>
            <input
              type="text"
              value={formData.latitude || ""}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="21.1458"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block font-semibold text-foreground mb-1">Longitude</label>
            <input
              type="text"
              value={formData.longitude || ""}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="79.0882"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="block font-semibold text-foreground mb-1">Verification Status</label>
            <select
              value={formData.verificationStatus || "VERIFIED"}
              onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value as any })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-semibold"
            >
              <option value="VERIFIED">VERIFIED (Live)</option>
              <option value="PENDING">PENDING (Review)</option>
              <option value="REJECTED">REJECTED (Archived)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-foreground mb-1">Office Address</label>
          <input
            type="text"
            value={formData.address || ""}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
            placeholder="Full physical address or hub location"
          />
        </div>

        <div>
          <label className="block font-semibold text-foreground mb-1">Short Description (Summary) *</label>
          <textarea
            rows={2}
            value={formData.descriptionShort || ""}
            onChange={(e) => setFormData({ ...formData, descriptionShort: e.target.value })}
            className="w-full rounded-xl border bg-background p-3 text-xs"
            placeholder="One-line elevator pitch for company cards and directory search..."
          />
        </div>

        <div>
          <label className="block font-semibold text-foreground mb-1">Full Description</label>
          <textarea
            rows={3}
            value={formData.descriptionLong || ""}
            onChange={(e) => setFormData({ ...formData, descriptionLong: e.target.value })}
            className="w-full rounded-xl border bg-background p-3 text-xs"
            placeholder="Detailed background, product offerings, historical context, or notes..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
            <input
              type="checkbox"
              checked={formData.hiring}
              onChange={(e) => setFormData({ ...formData, hiring: e.target.checked })}
              className="rounded"
            />
            <span>Actively Hiring in Central India</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded"
            />
            <span>Feature on Homepage &amp; City Hero</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2 text-xs font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 flex items-center gap-1.5"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{initialData ? "Save Changes" : "Create Company"}</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// ─── Job Modal ──────────────────────────────────────────────────────────────

export function JobModal({
  isOpen,
  onClose,
  onSave,
  companies,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: JobAdminInput) => Promise<void>;
  companies: Array<{ id: number; name: string; cityId?: number | null }>;
  initialData?: any;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<JobAdminInput>({
    title: initialData?.title || "",
    companyId: initialData?.companyId || (companies[0]?.id ?? 1),
    cityId: initialData?.cityId || 1,
    description: initialData?.description || "",
    location: initialData?.location || "",
    department: initialData?.department || "Engineering",
    remoteType: initialData?.remoteType || "ON_SITE",
    employmentType: initialData?.employmentType || "FULL_TIME",
    experienceMin: initialData?.experienceMin || 0,
    experienceMax: initialData?.experienceMax || 3,
    salaryMin: initialData?.salaryMin || null,
    salaryMax: initialData?.salaryMax || null,
    skills: initialData?.skills || "",
    applicationUrl: initialData?.applicationUrl || "",
    isWalkin: !!initialData?.isWalkin,
    walkinDate: initialData?.walkinDate ? new Date(initialData.walkinDate).toISOString().split("T")[0] : null,
    walkinStartTime: initialData?.walkinStartTime || "10:00 AM",
    walkinEndTime: initialData?.walkinEndTime || "04:00 PM",
    walkinVenue: initialData?.walkinVenue || "",
    status: initialData?.status || "ACTIVE",
    featured: !!initialData?.featured,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        companyId: initialData.companyId || (companies[0]?.id ?? 1),
        cityId: initialData.cityId || 1,
        description: initialData.description || "",
        location: initialData.location || "",
        department: initialData.department || "Engineering",
        remoteType: initialData.remoteType || "ON_SITE",
        employmentType: initialData.employmentType || "FULL_TIME",
        experienceMin: initialData.experienceMin || 0,
        experienceMax: initialData.experienceMax || 3,
        salaryMin: initialData.salaryMin || null,
        salaryMax: initialData.salaryMax || null,
        skills: initialData.skills || "",
        applicationUrl: initialData.applicationUrl || "",
        isWalkin: !!initialData.isWalkin,
        walkinDate: initialData.walkinDate ? new Date(initialData.walkinDate).toISOString().split("T")[0] : null,
        walkinStartTime: initialData.walkinStartTime || "10:00 AM",
        walkinEndTime: initialData.walkinEndTime || "04:00 PM",
        walkinVenue: initialData.walkinVenue || "",
        status: initialData.status || "ACTIVE",
        featured: !!initialData.featured,
      });
    }
  }, [initialData, isOpen, companies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.companyId) {
      setError("Job title and company are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Job: ${initialData.title}` : "Create Job / Walk-In Drive"}
      icon={<Briefcase className="h-5 w-5 text-primary" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-destructive font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="e.g. Senior Full Stack Engineer"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Company *</label>
            <select
              value={formData.companyId}
              onChange={(e) => {
                const compId = Number(e.target.value);
                const selected = companies.find((c) => c.id === compId);
                setFormData({
                  ...formData,
                  companyId: compId,
                  cityId: selected?.cityId || formData.cityId,
                });
              }}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">City *</label>
            <select
              value={formData.cityId}
              onChange={(e) => setFormData({ ...formData, cityId: Number(e.target.value) })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
            >
              <option value={1}>Nagpur</option>
              <option value={3}>Indore</option>
              <option value={6}>Bhopal</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Workplace Mode</label>
            <select
              value={formData.remoteType || "ON_SITE"}
              onChange={(e) => setFormData({ ...formData, remoteType: e.target.value as any })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
            >
              <option value="ON_SITE">On-Site</option>
              <option value="HYBRID">Hybrid</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Employment Type</label>
            <select
              value={formData.employmentType || "FULL_TIME"}
              onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
              <option value="PART_TIME">Part Time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">Department</label>
            <input
              type="text"
              value={formData.department || ""}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="e.g. Engineering / Product"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Experience (Min - Max Yrs)</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={formData.experienceMin ?? 0}
                onChange={(e) => setFormData({ ...formData, experienceMin: Number(e.target.value) })}
                className="w-full rounded-xl border bg-background px-2.5 py-2 text-xs"
                placeholder="Min"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                value={formData.experienceMax ?? 3}
                onChange={(e) => setFormData({ ...formData, experienceMax: Number(e.target.value) })}
                className="w-full rounded-xl border bg-background px-2.5 py-2 text-xs"
                placeholder="Max"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Status</label>
            <select
              value={formData.status || "ACTIVE"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-semibold"
            >
              <option value="ACTIVE">ACTIVE (Published)</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">Application / Careers URL</label>
            <input
              type="url"
              value={formData.applicationUrl || ""}
              onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="https://company.com/apply"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Key Skills (Comma-separated)</label>
            <input
              type="text"
              value={formData.skills || ""}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="React, Next.js, TypeScript, PostgreSQL"
            />
          </div>
        </div>

        {/* Walk-in Drive Section */}
        <div className="rounded-xl border p-3.5 bg-purple-500/5 border-purple-500/20 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground">
            <input
              type="checkbox"
              checked={formData.isWalkin}
              onChange={(e) => setFormData({ ...formData, isWalkin: e.target.checked })}
              className="rounded"
            />
            <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              Mark as Walk-In Interview / Immediate Hiring Drive
            </span>
          </label>

          {formData.isWalkin && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-foreground mb-1">Interview Date *</label>
                <input
                  type="date"
                  value={formData.walkinDate || ""}
                  onChange={(e) => setFormData({ ...formData, walkinDate: e.target.value })}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Reporting Time</label>
                <input
                  type="text"
                  value={formData.walkinStartTime || ""}
                  onChange={(e) => setFormData({ ...formData, walkinStartTime: e.target.value })}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
                  placeholder="10:00 AM - 04:00 PM"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Interview Venue *</label>
                <input
                  type="text"
                  value={formData.walkinVenue || ""}
                  onChange={(e) => setFormData({ ...formData, walkinVenue: e.target.value })}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
                  placeholder="Office address / Campus venue"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold text-foreground mb-1">Job Description</label>
          <textarea
            rows={3}
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-xl border bg-background p-3 text-xs"
            placeholder="Key responsibilities, eligibility criteria, and instructions..."
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2 text-xs font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 flex items-center gap-1.5"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{initialData ? "Update Job" : "Publish Job"}</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

// ─── Event Modal ────────────────────────────────────────────────────────────

export function EventModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventAdminInput) => Promise<void>;
  initialData?: any;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<EventAdminInput>({
    title: initialData?.title || "",
    cityId: initialData?.cityId || 1,
    date: initialData?.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    startTime: initialData?.startTime || "05:00 PM",
    endTime: initialData?.endTime || "08:00 PM",
    organizer: initialData?.organizer || "Central India Tech Community",
    venue: initialData?.venue || "",
    location: initialData?.location || "Nagpur",
    eventType: initialData?.eventType || "MEETUP",
    registrationUrl: initialData?.registrationUrl || "",
    price: initialData?.price || "Free",
    imageUrl: initialData?.imageUrl || "",
    description: initialData?.description || "",
    status: initialData?.status || "UPCOMING",
    featured: !!initialData?.featured,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        cityId: initialData.cityId || 1,
        date: initialData.date ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        startTime: initialData.startTime || "05:00 PM",
        endTime: initialData.endTime || "08:00 PM",
        organizer: initialData.organizer || "Central India Tech Community",
        venue: initialData.venue || "",
        location: initialData.location || "Nagpur",
        eventType: initialData.eventType || "MEETUP",
        registrationUrl: initialData.registrationUrl || "",
        price: initialData.price || "Free",
        imageUrl: initialData.imageUrl || "",
        description: initialData.description || "",
        status: initialData.status || "UPCOMING",
        featured: !!initialData.featured,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) {
      setError("Event title and date are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Event: ${initialData.title}` : "Create Tech Event / Meetup"}
      icon={<Calendar className="h-5 w-5 text-primary" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-destructive font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="e.g. Central India AI Founders Meetup"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">City *</label>
            <select
              value={formData.cityId}
              onChange={(e) => setFormData({ ...formData, cityId: Number(e.target.value) })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-medium"
            >
              <option value={1}>Nagpur</option>
              <option value={3}>Indore</option>
              <option value={6}>Bhopal</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">Event Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Time (Start - End)</label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={formData.startTime || ""}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full rounded-xl border bg-background px-2.5 py-2 text-xs"
                placeholder="05:00 PM"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="text"
                value={formData.endTime || ""}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full rounded-xl border bg-background px-2.5 py-2 text-xs"
                placeholder="08:00 PM"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Event Type</label>
            <select
              value={formData.eventType || "MEETUP"}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
            >
              <option value="MEETUP">Community Meetup</option>
              <option value="HACKATHON">Hackathon</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="CONFERENCE">Conference</option>
              <option value="DEMO_DAY">Demo Day</option>
              <option value="STARTUP_PITCH">Startup Pitch</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">Venue / Physical Location</label>
            <input
              type="text"
              value={formData.venue || ""}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="e.g. AIC-RNTU Incubation Hub, Bhopal"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Organizer</label>
            <input
              type="text"
              value={formData.organizer || ""}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="Community or Host Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1">Registration / RSVP Link</label>
            <input
              type="url"
              value={formData.registrationUrl || ""}
              onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="https://luma.com/event"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">Ticket Price</label>
            <input
              type="text"
              value={formData.price || "Free"}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
              placeholder="Free or ₹199"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-foreground mb-1">Event Description</label>
          <textarea
            rows={3}
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-xl border bg-background p-3 text-xs"
            placeholder="Agenda, speakers, networking format, and attendee details..."
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2 text-xs font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 flex items-center gap-1.5"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{initialData ? "Update Event" : "Create Event"}</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
