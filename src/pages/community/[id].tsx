"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Link as LinkIcon,
  ArrowLeft,
  Share2,
  Clock,
  CheckCircle,
} from "lucide-react";
import { events } from "@/data/mockData";
import { Event } from "@/types/community";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // Already formatted string
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const event = events.find((e: Event) => String(e.id) === String(id));
  const [isJoined, setIsJoined] = useState(event?.isJoined ?? false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Event not found.</p>
          <Link href="/community" className="text-green-600 underline">
            ← Back to Community
          </Link>
        </div>
      </div>
    );
  }

  // Related events (exclude current)
  const relatedEvents = events.filter((e: Event) => String(e.id) !== String(id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/community" className="hover:text-green-600 transition-colors">Community</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{event.name}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">

          {/* ── Left: Main content ────────────────────────── */}
          <div className="space-y-6">

            {/* Hero Image */}
            <div className="relative aspect-[16/7] rounded-2xl overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
                alt={event.name}
                className="w-full h-full object-cover"
              />
              {event.isOnline && (
                <span className="absolute top-4 left-4 bg-green-500 text-white text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
                  <Video className="w-4 h-4" /> Online Event
                </span>
              )}
            </div>

            {/* Title & actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    {event.icon}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {event.name}
                  </h1>
                </div>
                <button
                  onClick={handleShare}
                  className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
                  title="Copy link"
                >
                  {copied
                    ? <CheckCircle className="w-5 h-5 text-green-600" />
                    : <Share2 className="w-5 h-5 text-gray-500" />
                  }
                </button>
              </div>

              {/* Meta grid */}
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Date</p>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Location</p>
                    <p className="text-sm font-semibold text-gray-900">{event.location}</p>
                  </div>
                </div>
                {event.attendees && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Users className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Attendees</p>
                      <p className="text-sm font-semibold text-gray-900">{event.attendees.toLocaleString()} registered</p>
                    </div>
                  </div>
                )}
                {event.time && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Clock className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Time</p>
                      <p className="text-sm font-semibold text-gray-900">{event.time}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Join / Leave CTA */}
              <button
                onClick={() => setIsJoined(!isJoined)}
                className={`w-full py-3 rounded-xl font-semibold text-base transition-colors ${
                  isJoined
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-md"
                }`}
              >
                {isJoined ? "✓ Leave Event" : "Join This Event"}
              </button>
            </div>

            {/* Description */}
            {event.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About This Event</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}

            {/* Links */}
            {(event.meetingLink || event.registrationLink) && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Event Links</h2>
                <div className="space-y-3">
                  {event.meetingLink && (
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors group"
                    >
                      <Video className="w-5 h-5 text-green-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-green-800">Join Meeting</p>
                        <p className="text-xs text-green-600 truncate">{event.meetingLink}</p>
                      </div>
                      <LinkIcon className="w-4 h-4 text-green-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                  {event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors group"
                    >
                      <LinkIcon className="w-5 h-5 text-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-blue-800">Register Now</p>
                        <p className="text-xs text-blue-600 truncate">{event.registrationLink}</p>
                      </div>
                      <LinkIcon className="w-4 h-4 text-blue-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Sidebar ────────────────────────────── */}
          <aside className="space-y-6">

            {/* Quick Info card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Event Summary</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="font-medium text-gray-900">
                    {event.isOnline ? "🌐 Online" : "📍 In Person"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Date</dt>
                  <dd className="font-medium text-gray-900">{event.date}</dd>
                </div>
                {event.time && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Time</dt>
                    <dd className="font-medium text-gray-900">{event.time}</dd>
                  </div>
                )}
                {event.attendees && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Registered</dt>
                    <dd className="font-medium text-gray-900">{event.attendees.toLocaleString()}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Other Events</h3>
                <div className="space-y-4">
                  {relatedEvents.map((e: Event) => (
                    <Link
                      key={e.id}
                      href={`/community/events/${e.id}`}
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl shrink-0">
                        {e.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                          {e.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{e.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/community"
                  className="block mt-4 text-center text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View all events →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}