"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Upload, Loader2, AlertCircle } from "lucide-react";
import ApiFetcher from "@/utils/apis";


interface CommunityForm {
  name: string;
  description: string;
  guidelines: string;
  privacy: "public" | "private";
  iconFile: File | null;
  iconPreview: string | null;
  coverFile: File | null;
  coverPreview: string | null;
}

const DEFAULT: CommunityForm = {
  name: "",
  description: "",
  guidelines: "",
  privacy: "public",
  iconFile: null,
  iconPreview: null,
  coverFile: null,
  coverPreview: null,
};

export default function AdminCommunityEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [form, setForm] = useState<CommunityForm>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Load existing community data ────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ApiFetcher.get(`/communities/${id}`)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          guidelines: data.guidelines ?? "",
          privacy: data.privacy ?? "public",
          iconFile: null,
          iconPreview: data.icon ?? null,
          coverFile: null,
          coverPreview: data.image ?? null,
        });
      })
      .catch(() => setError("Failed to load community."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "icon" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === "icon") {
      setForm((f) => ({ ...f, iconFile: file, iconPreview: preview }));
    } else {
      setForm((f) => ({ ...f, coverFile: file, coverPreview: preview }));
    }
  };

  // ── Save via PUT /communities/:id ───────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      setSaveError("Name and description are required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("privacy", form.privacy);
      if (form.guidelines.trim()) formData.append("guidelines", form.guidelines.trim());
      if (form.iconFile) formData.append("icon", form.iconFile);
      if (form.coverFile) formData.append("image", form.coverFile);

      await ApiFetcher.put(`/communities/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push(`/admin/community/${id}`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.errors?.[Object.keys(err?.response?.data?.errors ?? {})[0]]?.[0] ??
        "Failed to save changes.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-gray-500 mb-4">{error}</p>
        <Link href="/admin/community" className="text-green-600 underline text-sm">
          Back to Communities
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href={`/admin/community/${id}`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Community</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update details, guidelines, and images</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {saveError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {saveError}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Name & Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Community Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Enter community name"
                maxLength={60}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.name.length}/60</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={6}
                maxLength={500}
                placeholder="Describe what this community is about…"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-700 leading-relaxed"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/500</p>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Community Guidelines
            </label>
            <textarea
              value={form.guidelines}
              onChange={(e) => setForm((f) => ({ ...f, guidelines: e.target.value }))}
              rows={6}
              maxLength={1000}
              placeholder="Community rules and guidelines (optional)…"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-700 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.guidelines.length}/1000</p>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Privacy</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {(["public", "private"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, privacy: p }))}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    form.privacy === p
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div>
                    <p className={`font-semibold text-sm capitalize ${form.privacy === p ? "text-green-800" : "text-gray-700"}`}>
                      {p}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {p === "public" ? "Anyone can find and join" : "Members must request to join"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Community Icon */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Community Icon</h3>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md mb-4 flex items-center justify-center">
                {form.iconPreview ? (
                  <img
                    src={form.iconPreview}
                    alt="Icon preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">
                    {form.name.charAt(0).toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium px-4 py-2 border border-green-300 rounded-lg hover:bg-green-50">
                <Upload className="w-4 h-4" />
                Change Icon
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "icon")}
                  className="hidden"
                />
              </label>
              {form.iconFile && (
                <button
                  onClick={() => setForm((f) => ({ ...f, iconFile: null, iconPreview: null }))}
                  className="mt-2 text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
              <p className="text-xs text-gray-400 mt-2 text-center">Square · 200×200px recommended</p>
            </div>
          </div>

          {/* Cover Photo */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Cover Photo</h3>
            <div className="space-y-3">
              {form.coverPreview ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 aspect-video">
                  <img
                    src={form.coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, coverFile: null, coverPreview: null }))}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <p className="text-xs text-gray-400">No cover image</p>
                </div>
              )}
              <label className="cursor-pointer block text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "cover")}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Cover
                </span>
              </label>
              <p className="text-xs text-gray-400 text-center">1600×500px · JPG, PNG · Max 5MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}