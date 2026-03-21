"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  Calendar,
  MapPin,
  Video,
  Link as LinkIcon,
  ArrowLeft,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Event } from "@/types/community";
import { EventIcon } from "@/components/community/EventIcon";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop";

// ── API shape ─────────────────────────────────────────────────────────────
interface ApiEvent {
  id: number;
  event_id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  type: 1 | 2;
  type_string: string;
  meeting_link?: string;
  registration_link?: string;
  description?: string;
  image?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

type MappedEvent = Event & { rawImage?: string };

function mapApiEvent(e: ApiEvent): MappedEvent {
  return {
    id: e.event_id ?? String(e.id),
    name: e.title,
    date: formatDate(e.date),
    time: e.time ? formatTime(e.time) : undefined,
    location: e.location,
    icon: e.type === 2 ? "online" : "physical",
    description: e.description,
    isOnline: e.type === 2,
    meetingLink: e.meeting_link,
    registrationLink: e.registration_link,
    rawImage: e.image,
  };
}

// ── Service ───────────────────────────────────────────────────────────────
async function getEventById(id: string): Promise<MappedEvent> {
  const url = id.startsWith("GRM")
    ? `${API_BASE}/events/event-id/${id}`
    : `${API_BASE}/events/${id}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  const json = await res.json();
  const raw: ApiEvent = json.data ?? json;
  return mapApiEvent(raw);
}

async function getRelatedEvents(excludeId: string): Promise<MappedEvent[]> {
  const res = await fetch(`${API_BASE}/events/?per_page=4&page=1`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];

  const json = await res.json();
  const raw: ApiEvent[] = Array.isArray(json) ? json : (json.data ?? []);
  return raw
    .filter((e) => (e.event_id ?? String(e.id)) !== excludeId)
    .slice(0, 3)
    .map(mapApiEvent);
}

// ── Skeleton ──────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-6" />
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <div className="aspect-video bg-gray-200 rounded-2xl" />
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="grid sm:grid-cols-2 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-32" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [event, setEvent] = useState<MappedEvent | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<MappedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [main, related] = await Promise.all([
        getEventById(id),
        getRelatedEvents(id),
      ]);
      setEvent(main);
      setRelatedEvents(related);
    } catch (err) {
      setError("Failed to load event. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-gray-600">{error}</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={fetchEvent}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Retry
            </button>
            <Link href="/community" className="text-sm text-green-600 underline">
              Back to Community
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Event not found.</p>
          <Link href="/community" className="text-green-600 underline text-sm">
            ← Back to Community
          </Link>
        </div>
      </div>
    );
  }

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

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">

          {/* ── Left ─────────────────────────────────────── */}
          <div className="space-y-6">

            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
              <img
                src={event.rawImage || FALLBACK_IMAGE}
                alt={event.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
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
                  <EventIcon icon={event.icon} size="lg" />
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

              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Date</p>
                    <p className="text-sm font-semibold text-gray-900">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Location</p>
                    <p className="text-sm font-semibold text-gray-900">{event.location}</p>
                  </div>
                </div>
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
              </dl>
            </div>

            {relatedEvents.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Other Events</h3>
                <div className="space-y-4">
                  {relatedEvents.map((e) => (
                    <Link
                      key={e.id}
                      href={`/community/${e.id}`}
                      className="flex items-start gap-3 group"
                    >
                      <EventIcon icon={e.icon} size="md" />
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