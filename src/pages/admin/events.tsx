"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Eye,
  Pencil,
  Calendar,
  MapPin,
  Plus,
  Loader2,
  AlertCircle,
  Video,
} from "lucide-react";
import CreateEventModal from "@/components/community/CreateEventModal";
import { NewEvent } from "@/types/community";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// ── Auth helper ───────────────────────────────────────────────────────────
// Adjust this to however your app stores the admin token
function getToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("jwt") ?? "";
}

function authHeaders() {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

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
  description?: string;
  image?: string;
  meeting_link?: string;
  registration_link?: string;
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

// ── Default form state ────────────────────────────────────────────────────
const DEFAULT_EVENT: NewEvent = {
  title: "",
  date: "",
  time: "",
  location: "",
  isOnline: false,
  description: "",
  image: null,
  previewImage: null,
  attendees: null,
  meetingLink: "",
  registrationLink: "",
};

// ── Page ──────────────────────────────────────────────────────────────────
export default function AdminEventsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEvent>(DEFAULT_EVENT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<ApiEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch all events ──────────────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/events`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      const raw: ApiEvent[] = Array.isArray(json) ? json : (json.data ?? []);
      setEvents(raw);
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

  // ── Create event ──────────────────────────────────────────────────────
  const handleCreateEvent = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      // API expects YYYY-MM-DD
      formData.append("date", newEvent.date);
      // API expects HH:MM
      if (newEvent.time) formData.append("time", newEvent.time);
      formData.append("location", newEvent.location);
      // API expects integer string "1" or "2"
      formData.append("type", newEvent.isOnline ? "2" : "1");
      formData.append("description", newEvent.description);
      if (newEvent.meetingLink) formData.append("meeting_link", newEvent.meetingLink);
      if (newEvent.registrationLink) formData.append("registration_link", newEvent.registrationLink);
      if (newEvent.image) formData.append("image", newEvent.image);

      const res = await fetch(`${API_BASE}/admin/events`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
          // NOTE: do NOT set Content-Type — browser sets it with boundary for FormData
        },
        body: formData,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => res.text());
        console.error("API validation errors:", errBody);
        throw new Error(`${res.status} ${res.statusText}`);
      }

      // Refresh list from server
      await fetchEvents();
      setShowCreateModal(false);
      setNewEvent(DEFAULT_EVENT);
    } catch (err) {
      console.error("Failed to create event:", err);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete event ──────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/events/${deleteTarget.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Failed to delete event. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage community events
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Event
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <AlertCircle className="w-8 h-8 text-red-400" />
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Create your first event using the button above.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {["Event", "Type", "Date", "Actions"].map((h) => (
                        <th
                          key={h}
                          className={`text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider
                            ${h === "Type" ? "hidden sm:table-cell" : ""}
                            ${h === "Date" ? "hidden md:table-cell" : ""}
                            ${h === "Actions" ? "text-center" : ""}
                          `}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50 transition-colors">

                        {/* Event name + image */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                              {event.image ? (
                                <Image
                                  src={event.image}
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  🗓️
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                {event.title}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5 font-mono">
                                {event.event_id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-4 px-6 hidden sm:table-cell">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              event.type === 2
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {event.type === 2 ? (
                              <><Video className="w-3 h-3" /> Online</>
                            ) : (
                              <><MapPin className="w-3 h-3" /> Physical</>
                            )}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span className="text-sm">{formatDate(event.date)}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-1">
                            <Link
                              href={`/community/${event.event_id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/events/${event.event_id}`}
                              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(event)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  {events.length} event{events.length !== 1 ? "s" : ""}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          newEvent={newEvent}
          onChange={setNewEvent}
          onClose={() => {
            setShowCreateModal(false);
            setNewEvent(DEFAULT_EVENT);
          }}
          onSubmit={handleCreateEvent}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Event?</h3>
            <p className="text-sm text-gray-600 mb-1">
              You are about to delete{" "}
              <span className="font-medium text-gray-900">"{deleteTarget.title}"</span>.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently remove the event. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}