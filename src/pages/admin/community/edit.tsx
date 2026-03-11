'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';   // ← Pages Router
import { ArrowLeft, Save, X, Upload, AlertCircle } from 'lucide-react';

// ── TODO: replace with real API call ────────────────────────────────────────
// Fetch:  const data = await CommunityService.getById(id)
// Save:   await CommunityService.update(id, formData)
interface CommunityForm {
  id: string;
  name: string;
  description: string;
  rules: string;
  icon: string | File | null;
  cover: string | File | null;
  status: 'Approved' | 'Pending' | 'Suspended';
}

const PLACEHOLDER: CommunityForm = {
  id: '',
  name: '',
  description: '',
  rules: '• Be respectful\n• No spam\n• Share accurate information\n• Posts must be related to agriculture',
  icon: null,
  cover: null,
  status: 'Pending',
};
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminCommunityEditPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };  // ← router.query for Pages Router

  const [formData, setFormData]       = useState<CommunityForm>({ ...PLACEHOLDER });
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    if (!id) return;

    // TODO: replace with real fetch
    // const data = await CommunityService.getById(id);
    // setFormData(data);
    // setIconPreview(data.icon);
    // setCoverPreview(data.cover);

    setFormData({ ...PLACEHOLDER, id });
    setLoading(false);
  }, [id]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'icon' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'icon') {
      setIconPreview(url);
      setFormData((f) => ({ ...f, icon: file }));
    } else {
      setCoverPreview(url);
      setFormData((f) => ({ ...f, cover: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: send to API
      // const fd = new FormData();
      // Object.entries(formData).forEach(([k, v]) => v && fd.append(k, v as any));
      // await fetch(`/api/admin/communities/${id}`, { method: 'PATCH', body: fd });
      console.log('Saving community:', formData);
      router.push(`/admin/community/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !id) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ── Header ──────────────────────────────────────────────────────── */}
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
          <p className="text-sm text-gray-500 mt-0.5">Update details, rules, and images</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* ── API notice ──────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
        <span>
          <strong>API not connected yet.</strong> Wire up the{' '}
          <code className="bg-amber-100 px-1 rounded text-xs">useEffect</code> fetch and{' '}
          <code className="bg-amber-100 px-1 rounded text-xs">handleSubmit</code> PATCH once the endpoint is ready.
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Main content ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Name & Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Community Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Enter community name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                  rows={6}
                  placeholder="Describe what this community is about..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-700 leading-relaxed"
                />
              </div>
            </div>

            {/* Community Rules */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Community Rules
              </label>
              <textarea
                value={formData.rules}
                onChange={(e) => setFormData((f) => ({ ...f, rules: e.target.value }))}
                rows={8}
                placeholder={'One rule per line...\ne.g. • Be respectful\n• No spam'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-mono text-sm text-gray-700"
              />
              <p className="text-xs text-gray-400 mt-2">Use • at the start of each line for bullet points</p>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Community Icon */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Community Icon</h3>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md mb-4 flex items-center justify-center">
                  {iconPreview ? (
                    <Image
                      src={iconPreview}
                      alt="Icon preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-3xl">🌾</span>
                  )}
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'icon')}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium">
                    <Upload className="w-4 h-4" />
                    Change Icon
                  </span>
                </label>
                <p className="text-xs text-gray-400 mt-1 text-center">Square · 200×200px recommended</p>
              </div>
            </div>

            {/* Cover Photo */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Cover Photo</h3>
              <div className="space-y-3">
                {coverPreview ? (
                  <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 aspect-3/1">
                    <Image
                      src={coverPreview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => { setCoverPreview(null); setFormData((f) => ({ ...f, cover: null })); }}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full aspect-3/1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <p className="text-xs text-gray-400">No cover image</p>
                  </div>
                )}
                <label className="cursor-pointer block text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload Cover
                  </span>
                </label>
                <p className="text-xs text-gray-400 text-center">1600×500px · JPG, PNG · Max 5MB</p>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Community Status</h3>
              <select
                value={formData.status}
                onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value as CommunityForm['status'] }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="Approved">✅ Approved</option>
                <option value="Pending">⏳ Pending Review</option>
                <option value="Suspended">🚫 Suspended</option>
              </select>
              <p className="text-xs text-gray-400 mt-2">
                Changing status here will update it on save.
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}