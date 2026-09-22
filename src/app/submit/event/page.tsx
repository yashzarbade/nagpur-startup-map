"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, CheckCircle2, ArrowLeft, Send } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function SubmitEventPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
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
    submitterEmail: "",
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
        <h1 className="text-3xl font-bold tracking-tight">Submit a Tech Event in Nagpur</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share your meetup, workshop, hackathon, or demo day with Nagpur&apos;s active developer and startup ecosystem.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl border bg-card text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Event Submitted!</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Thank you! <strong>{formData.title}</strong> has been received and will be listed on our community calendar after brief verification.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
            >
              Browse Events Calendar
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors"
            >
              Submit Another Event
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 rounded-2xl border shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold block mb-1.5">Event Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Nagpur AI Builders Meetup #3"
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Event Type</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="MEETUP">Community Meetup</option>
                  <option value="HACKATHON">Hackathon</option>
                  <option value="WORKSHOP">Hands-on Workshop</option>
                  <option value="DEMO_DAY">Demo Day / Pitch Night</option>
                  <option value="CONFERENCE">Conference</option>
                  <option value="NETWORKING">Networking Mixer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Organizer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="e.g. Nagpur Tech Community / IIM InFED"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Start Time</label>
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  placeholder="6:00 PM"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Ticket Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Free or ₹499"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Venue Name *</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. IIM Nagpur / CoWork Nagpur / VNIT Auditorium"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">Area / Neighborhood in Nagpur</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. MIHAN / Civil Lines / Dharampeth"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Registration / RSVP Link</label>
              <input
                type="url"
                value={formData.registrationUrl}
                onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                placeholder="https://lu.ma/event or https://meetup.com/event"
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5">Event Description *</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Agenda, speakers, prerequisites, and who should attend..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Publish Event to Calendar"} <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
