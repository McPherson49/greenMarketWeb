import React from "react";
import { Calendar, MapPin, Users, ArrowRight, Video } from "lucide-react";
import Link from "next/link";
import { Event } from "../../types/community";

interface EventsTabProps {
  events: Event[];
}

const EventsTab: React.FC<EventsTabProps> = ({ events }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        <p className="text-sm text-gray-500 mt-1">{events.length} events coming up</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
          >
            {/* Cover Image */}
            <div className="h-44 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
                alt={event.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Online badge */}
              {event.isOnline && (
                <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Video className="w-3 h-3" /> Online
                </span>
              )}
            </div>

            <div className="p-4">
              {/* Title row */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-lg shrink-0">
                  {event.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                  {event.name}
                </h3>
              </div>

              {/* Meta */}
              <div className="space-y-1.5 mb-3">
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  {event.date}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </p>
                
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {event.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                

                {/* View Details → links to /community/events/[id] */}
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

      {/* View All */}
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
    </div>
  );
};

export default EventsTab;