"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, ChevronRight } from "lucide-react";
import { TrendingTopic, Event } from "../../types/community";
import { EventIcon } from "./EventIcon";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface RightSidebarProps {
  mainSection: "Community" | "Events" | "Settings";
  trendingTopics: TrendingTopic[];
  events: Event[]; // kept for backwards compat — not used internally now
}

interface ApiEvent {
  id: number;
  event_id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  type: 1 | 2;
  image?: string;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch { return iso; }
}

function mapApiEvent(e: ApiEvent): Event {
  return {
    id: e.event_id ?? String(e.id),
    name: e.title,
    date: formatDate(e.date),
    location: e.location,
    icon: e.type === 2 ? "online" : "physical",
    isOnline: e.type === 2,
  };
}

function useEvents() {
  const [events,    setEvents]    = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/events/?per_page=15&page=1`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const raw: ApiEvent[] = Array.isArray(json) ? json : (json.data ?? []);
      setEvents(raw.map(mapApiEvent));
    } catch {
      // silently fail — EventsTab shows full error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { events, isLoading };
}

// ── Events panel (used in both Community + Events sections) ───────────────
function EventsPanel() {
  const { events, isLoading } = useEvents();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-green-500" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">No upcoming events.</p>
      ) : (
        <div className="space-y-0.5">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded -mx-2 px-2 transition-colors cursor-pointer">
                <EventIcon icon={event.icon} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{event.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{event.date}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{event.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
const RightSidebar: React.FC<RightSidebarProps> = ({ mainSection, trendingTopics }) => {

  // Community section — Trending Topics + Events
  if (mainSection === "Community") {
    return (
      <div className="space-y-4">
        {trendingTopics.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Trending now</h3>
            </div>
            {trendingTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex space-x-3 py-3 cursor-pointer hover:bg-gray-50 rounded -mx-2 px-2"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full font-semibold text-sm shrink-0">
                  {topic.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{topic.title}</p>
                  {topic.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{topic.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Real events feed */}
        <EventsPanel />
      </div>
    );
  }

  // Events section — events panel only
  if (mainSection === "Events") {
    return <EventsPanel />;
  }

  // Settings section — nothing needed on right
  return null;
};

export default RightSidebar;