"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, CheckCircle2, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SubmissionAuthGuard } from "@/components/auth/submission-auth-guard";
import { createSubmissionAction } from "@/app/auth/actions";
import { EVENT_TYPES, SITE } from "@/lib/constants";

export default function SubmitEventPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    city: "nagpur",
    title: "",
    eventType: "MEETUP",
    organizer: "",
    date: "",
    startTime: "6:00 PM",
    endTime: "8:30 PM",
    venue: "",
    location: "Civil Lines, Nagpur",
    price: "Free",
    registrationUrl: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cityId = formData.city === "indore" ? 3 : 1;
      const res = await createSubmissionAction({
        type: "EVENT",
        cityId,
        data: {
          ...formData,
          cityId,
        },
      });

      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setLoading(false);
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit event.");
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-8 max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Submit", href: "/submit" },
          { label: "Add an Event" },
        ]}
      />

      <div className="my-6">
        <Link
          href="/submit"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3 w-3" /> Back to options
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Submit a Tech Event</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share your meetup, workshop, hackathon, or conference with the Central India builder community on {SITE.name}.
        </p>
      </div>

      <SubmissionAuthGuard returnTo="/submit/event" submissionTypeName="an event">
        {submitted ? (
          <div className="p-8 rounded-3xl border bg-card text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Event Submitted for Review!</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Thank you for submitting <strong>{formData.title}</strong>. Our moderation team will verify the details and list it on the community events board.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard?tab=submissions"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
              >
                Track in Dashboard
              </Link>
              <Link
                href="/events"
                className="px-5 py-2.5 rounded-xl border bg-card font-semibold text-xs hover:bg-accent transition-colors"
              >
                View Events
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* City Selection */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                1. Event City
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Hub City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                        location: e.target.value === "indore" ? "Vijay Nagar, Indore" : "Civil Lines, Nagpur",
                      })
                    }
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    <option value="nagpur">Nagpur (Maharashtra)</option>
                    <option value="indore">Indore (Madhya Pradesh)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Event Type *
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) =>
                      setFormData({ ...formData, eventType: e.target.value })
                    }
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  >
                    {EVENT_TYPES.map((et) => (
                      <option key={et.value} value={et.value}>
                        {et.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="rounded-2xl border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                2. Event Information
              </h2>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Central India Generative AI Hackathon, Nagpur DevFest"
                  className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Organizer Name / Community *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organizer}
                    onChange={(e) =>
                      setFormData({ ...formData, organizer: e.target.value })
                    }
                    placeholder="e.g. GDG Nagpur, Indore AI Club, VNIT E-Cell"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    placeholder="6:00 PM"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    placeholder="8:30 PM"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Entry / Ticket Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="Free or ₹199"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Venue / Hall
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData({ ...formData, venue: e.target.value })
                    }
                    placeholder="e.g. Radisson Blu, VNIT Auditorium, Brilliant Convention Centre"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Area / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Civil Lines, Vijay Nagar, IT Park"
                    className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Registration / RSVP Link *
                </label>
                <input
                  type="url"
                  required
                  value={formData.registrationUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, registrationUrl: e.target.value })
                  }
                  placeholder="https://lu.ma/... or https://meetup.com/..."
                  className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Event Agenda &amp; Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the event speakers, target audience, schedule, and takeaways..."
                  className="w-full rounded-xl border bg-background py-2 px-3 text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Event for Approval</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </SubmissionAuthGuard>
    </div>
  );
}
