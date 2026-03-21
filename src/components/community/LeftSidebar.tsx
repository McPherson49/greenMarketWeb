"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, Search, Loader2 } from "lucide-react";
import { Community, Event } from "../../types/community";
import { EventIcon } from "./EventIcon";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface LeftSidebarProps {
  mainSection: "Community" | "Events" | "Settings";
  communities: Community[];
  events?: Event[];
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
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
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
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch_ = useCallback(async () => {
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
      // silently fail — full error shown in EventsTab
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { events, isLoading };
}

// ── Community section sidebar ─────────────────────────────────────────────
function CommunitySidebar({
  communities,
  events,
}: {
  communities: Community[];
  events: Event[];
}) {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">My Community</h3>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        {communities.map((community) => (
          <div
            key={community.id}
            className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-gray-50 rounded -mx-2 px-2"
          >
            <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-2xl shrink-0">
              {community.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{community.name}</p>
              <p className="text-xs text-gray-500">{community.members} members</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Events</h3>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        {events.length === 0 ? (
          <p className="text-xs text-gray-400 py-2">No events yet.</p>
        ) : (
          events.slice(0, 3).map((event) => (
            <div key={event.id} className="py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start space-x-3">
                <EventIcon icon={event.icon} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1 truncate">{event.name}</p>
                  <p className="text-xs text-gray-500 mb-1">{event.date}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{event.location}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// ── Events section sidebar ────────────────────────────────────────────────
function EventsSidebar() {
  const { events, isLoading } = useEvents();
  const [query, setQuery] = useState("");

  const filtered = events.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-green-500" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">
          {query ? "No events match your search." : "No events found."}
        </p>
      ) : (
        <div className="space-y-1">
          {filtered.map((event) => (
            <div
              key={event.id}
              className="flex items-center space-x-3 py-2 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            >
              <EventIcon icon={event.icon} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{event.name}</p>
                <p className="text-xs text-gray-500">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
const LeftSidebar: React.FC<LeftSidebarProps> = ({ mainSection, communities }) => {
  const { events, isLoading } = useEvents();

  if (mainSection === "Community") {
    return (
      <CommunitySidebar
        communities={communities}
        events={isLoading ? [] : events}
      />
    );
  }

  if (mainSection === "Events") {
    return <EventsSidebar />;
  }

  return null;
};

export default LeftSidebar;