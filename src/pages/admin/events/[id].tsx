"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Save,
  X,
  Upload,
  Calendar,
  MapPin,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Video,
  Link as LinkIcon,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

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
  date: string;       // ISO datetime
  time?: string;      // ISO datetime
  location: string;
  type: 1 | 2;
  type_string: string;
  meeting_link?: string;
  registration_link?: string;
  description?: string;
  image?: string;
}

// ── Form state shape ──────────────────────────────────────────────────────
interface FormState {
  title: string;
  date: string;         // YYYY-MM-DD for <input type="date">
  time: string;         // HH:MM for <input type="time">
  location: string;
  isOnline: boolean;
  description: string;
  meetingLink: string;
  registrationLink: string;
  imageFile: File | null;
  imagePreview: string | null; // existing URL or object URL
}

/** "2026-12-24T23:00:00.000000Z" → "2026-12-24" */
function toDateInput(iso: string): string {
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return iso;
  }
}

/** "2026-03-20T13:00:00.000000Z" → "13:00" */
function toTimeInput(iso: string): string {
  try {
    return new Date(iso).toISOString().slice(11, 16);
  } catch {
    return iso;
  }
}

function apiToForm(e: ApiEvent): FormState {
  return {
    title: e.title,
    date: toDateInput(e.date),
    time: e.time ? toTimeInput(e.time) : "",
    location: e.location,
    isOnline: e.type === 2,
    description: e.description ?? "",
    meetingLink: e.meeting_link ?? "",
    registrationLink: e.registration_link ?? "",
    imageFile: null,
    imagePreview: e.image ?? null,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; // event_id (GRM...) or db id

  const [dbId, setDbId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ── Fetch event ───────────────────────────────────────────────────────
  const fetchEvent = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const url = id.startsWith("GRM")
        ? `${API_BASE}/admin/events/event-id/${id}`
        : `${API_BASE}/admin/events/${id}`;

      const res = await fetch(url, { headers: authHeaders() });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const json = await res.json();
      const raw: ApiEvent = json.data ?? json;
      setDbId(raw.id);
      setForm(apiToForm(raw));
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

  // ── Image handler ─────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    setForm({
      ...form,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  const set = (patch: Partial<FormState>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !dbId) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("date", form.date);
      if (form.time) fd.append("time", form.time);
      fd.append("location", form.location);
      fd.append("type", form.isOnline ? "2" : "1");
      fd.append("description", form.description);
      if (form.meetingLink) fd.append("meeting_link", form.meetingLink);
      if (form.registrationLink) fd.append("registration_link", form.registrationLink);
      // Only send image if a new file was selected — sending null/empty fails validation
      if (form.imageFile instanceof File) fd.append("image", form.imageFile);

      // Laravel requires POST + _method=PUT when sending FormData
      fd.append("_method", "PUT");
      const res = await fetch(`${API_BASE}/admin/events/${dbId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
          // No Content-Type — let browser set it with FormData boundary
        },
        body: fd,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => res.text());
        console.error("API validation errors:", errBody);
        throw new Error(`${res.status} ${res.statusText}`);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/admin/events");
      }, 1000);
    } catch (err) {
      console.error("Failed to update event:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ── States ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={fetchEvent}
          className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
        <p>Event not found.</p>
        <Link href="/admin/events" className="text-green-600 underline text-sm">
          ← Back to Events
        </Link>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-sm text-gray-500 mt-1">Update event details</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : saveSuccess ? (
            "✓ Saved!"
          ) : (
            <><Save className="w-5 h-5" /> Save Changes</>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Title */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set({ title: e.target.value })}
              className="w-full text-2xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-green-500 outline-none pb-3 transition-colors"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Date, Time, Location */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set({ date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => set({ time: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Location <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => set({ location: e.target.value })}
                  placeholder="e.g. Lagos Convention Center"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  required
                />
                <label className="flex items-center gap-2 whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isOnline}
                    onChange={(e) => set({ isOnline: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Online</span>
                </label>
              </div>
            </div>
          </div>

          {/* Meeting / Registration links */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900">Event Links</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-green-600" />
                Meeting Link {form.isOnline && <span className="text-red-500">*</span>}
              </label>
              <input
                type="url"
                value={form.meetingLink}
                onChange={(e) => set({ meetingLink: e.target.value })}
                placeholder="https://meet.example.com/..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-blue-500" />
                Registration Link <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="url"
                value={form.registrationLink}
                onChange={(e) => set({ registrationLink: e.target.value })}
                placeholder="https://register.example.com/..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm text-gray-700 leading-relaxed"
              placeholder="Describe the event, agenda, speakers..."
              required
            />
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Image */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Event Image</h3>
            <div className="space-y-4">
              {form.imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <Image
                    src={form.imagePreview}
                    alt="Event preview"
                    width={800}
                    height={400}
                    className="w-full object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => set({ imageFile: null, imagePreview: null })}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="aspect-[2/1] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <p className="text-sm text-gray-400">No image selected</p>
                </div>
              )}

              <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors">
                <Upload className="w-4 h-4" />
                {form.imagePreview ? "Replace Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 text-center">
                JPG, PNG · Max 2MB · Recommended 1200×600px
              </p>
            </div>
          </div>

          {/* Event type summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Event Type</h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => set({ isOnline: false })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  !form.isOnline
                    ? "bg-green-50 border-green-400 text-green-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                📍 Physical
              </button>
              <button
                type="button"
                onClick={() => set({ isOnline: true })}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  form.isOnline
                    ? "bg-blue-50 border-blue-400 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                🌐 Online
              </button>
            </div>
          </div>

          {/* Save button (sidebar copy) */}
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            {isSaving ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Saving…</>
            ) : saveSuccess ? (
              "✓ Saved!"
            ) : (
              <><Save className="w-5 h-5" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}