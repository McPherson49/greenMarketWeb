"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Video } from "lucide-react";
import { Event } from "../../types/community";
import { FaLaptop } from "react-icons/fa";
import { FaPersonWalking } from "react-icons/fa6";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop";

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
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
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

// ── Service ───────────────────────────────────────────────────────────────
type MappedEvent = Event & { rawImage?: string };

async function getPublishedEvents(): Promise<MappedEvent[]> {
  const url = `${API_BASE}/events/?per_page=15&page=1`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  const json = await res.json();
  const raw: ApiEvent[] = Array.isArray(json) ? json : (json.data ?? []);

  return raw.map((e) => ({
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
  }));
}

// ── Icon renderer — keeps icon as string, renders the right component ─────
function EventIcon({ icon }: { icon: string }) {
  return (
    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0 text-green-700">
      {icon === "online" ? (
        <FaLaptop className="w-4 h-4" />
      ) : (
        <FaPersonWalking className="w-4 h-4" />
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────
function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="h-44 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse shrink-0" />
          <div className="h-5 bg-gray-200 rounded animate-pulse flex-1" />
        </div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="pt-3 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────
const EventsTab: React.FC = () => {
  const [events, setEvents] = useState<MappedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPublishedEvents();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        {!isLoading && !error && (
          <p className="text-sm text-gray-500 mt-1">
            {events.length} event{events.length !== 1 ? "s" : ""} coming up
          </p>
        )}
      </div>

      {/* Loading shimmer */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && events.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium">No upcoming events</p>
          <p className="text-sm mt-1">Check back later for new events.</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && !error && events.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="h-44 relative overflow-hidden">
                  <img
                    src={event.rawImage || FALLBACK_IMAGE}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                  {event.isOnline && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Video className="w-3 h-3" /> Online
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <EventIcon icon={event.icon} />
                    <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                      {event.name}
                    </h3>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {event.date}
                      {event.time && (
                        <span className="ml-1 text-gray-400">· {event.time}</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </p>
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {event.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                    <Link
                      href={`/community/${event.id}`}
                      className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {events.length > 4 && (
            <div className="text-center pt-2">
              <Link
                href="/community/events"
                className="inline-flex items-center gap-2 px-6 py-3 border border-green-500 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventsTab;