"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, MapPin, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function ContactPage() {
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 800);
  };

  return (
    <div className="container-page py-8 max-w-3xl mx-auto">
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <div className="my-8 text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Get in Touch
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Have feedback, want to partner with Nagpur Startup Map, or submit custom ecosystem data? We would love to hear from you.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8 text-sm">
        <div className="p-4 rounded-xl border bg-card text-center space-y-1">
          <Mail className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="font-semibold text-xs">Email Us</p>
          <p className="text-muted-foreground text-xs">hello@nagpurstartupmap.com</p>
        </div>
        <div className="p-4 rounded-xl border bg-card text-center space-y-1">
          <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="font-semibold text-xs">Location</p>
          <p className="text-muted-foreground text-xs">Nagpur, Maharashtra, India</p>
        </div>
        <div className="p-4 rounded-xl border bg-card text-center space-y-1">
          <MessageSquare className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="font-semibold text-xs">Community</p>
          <p className="text-muted-foreground text-xs">Join Nagpur Tech WhatsApp & Luma</p>
        </div>
      </div>

      {sent ? (
        <div className="p-8 rounded-2xl border bg-card text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold">Message Sent!</h2>
          <p className="text-xs text-muted-foreground">
            Thank you for reaching out. We typically respond to ecosystem inquiries within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl border bg-card shadow-sm space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1.5">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Anand"
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1.5">Subject *</label>
            <select className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20">
              <option value="general">General Feedback or Suggestion</option>
              <option value="partnership">Incubator / University Partnership</option>
              <option value="sponsorship">Promotions & Advertising Inquiries</option>
              <option value="data">Data Correction or Listing Update</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1.5">Message *</label>
            <textarea
              rows={4}
              required
              placeholder="How can we help?"
              className="w-full px-3.5 py-2 text-sm rounded-xl border bg-background outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"} <Send className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
