'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Save, X, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ApiFetcher from '@/utils/apis';

// ─────────────────────────────────────────────────────────────
// API fields (from Postman docs + confirmed live response):
//
// REQUIRED:  title, description, status
// OPTIONAL:  category_id, section_title, subtitle,
//            section_description, image (file)
//
// NOTE: "description" is the main blog content (long form).
//       "section_description" is an optional extra section body.
//       There is no separate "content" field.
// ─────────────────────────────────────────────────────────────
interface BlogForm {
  title: string;
  description: string;        // main content — required
  status: 'published' | 'draft';
  section_title: string;      // optional
  subtitle: string;           // optional
  section_description: string; // optional
  tags: string;
  image: File | null;
}

const EMPTY_FORM: BlogForm = {
  title: '',
  description: '',
  status: 'draft',
  section_title: '',
  subtitle: '',
  section_description: '',
  tags: '',
  image: null,
};

export default function NewBlogPost() {
  const router = useRouter();
  const [formData, setFormData] = useState<BlogForm>(EMPTY_FORM);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof BlogForm, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setServerError('Image must be smaller than 2MB. Please compress or resize it and try again.');
      e.target.value = '';
      return;
    }
    setServerError(null);
    setFormData((prev) => ({ ...prev, image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreviewImage(null);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BlogForm, string>> = {};
    if (!formData.title.trim())       newErrors.title       = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setServerError(null);

    try {
      const body = new FormData();

      // ── Required fields ──────────────────────────────────
      body.append('title',       formData.title.trim());
      body.append('description', formData.description.trim());
      body.append('status',      formData.status);

      // ── Optional fields — only append if filled ──────────
      if (formData.section_title.trim())
        body.append('section_title', formData.section_title.trim());

      if (formData.subtitle.trim())
        body.append('subtitle', formData.subtitle.trim());

      if (formData.section_description.trim())
        body.append('section_description', formData.section_description.trim());

      if (formData.tags.trim()) {
        const tagList = formData.tags.split(',').map((t) => t.trim()).filter(Boolean).join(',');
        body.append('tags', tagList);
      }

      // ── Image — only append if a file was selected ───────
      // Never append an empty file field — server crashes on it
      if (formData.image instanceof File) {
        body.append('image', formData.image);
      }

      // ── Use native fetch for multipart/FormData with file uploads ──
      // Axios can corrupt the FormData boundary in some browsers when
      // files are included, causing the server to reject the image as
      // invalid. Native fetch handles FormData file uploads correctly.
      const token = `Bearer ${sessionStorage.getItem('jwt') ?? ''}`;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/blogs`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: token,
            // NO Content-Type — browser sets multipart/form-data + boundary automatically
          },
          body,
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const allErrors = (data?.errors && typeof data.errors === 'object')
          ? Object.entries(data.errors as Record<string, string[]>)
              .map(([field, msgs]) => `• ${field}: ${msgs[0]}`)
              .join('\n')
          : (data?.message as string) ?? `Server error ${res.status}`;
        throw new Error(allErrors);
      }

      router.push('/admin/blogs');
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const set = (field: keyof BlogForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/blogs" className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Blog Post</h1>
              <p className="text-gray-500 mt-1 text-sm">Fill in the details below to create a new post</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-3 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Saving...' : 'Save Post'}
          </button>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm whitespace-pre-line">
            <p className="font-semibold mb-1">Could not save:</p>
            <p>{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">

          {/* ── Left Column ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={set('title')}
                placeholder="Enter a compelling title..."
                className="w-full text-2xl font-bold text-gray-900 border-b-2 border-gray-300 focus:border-green-500 outline-none pb-3 placeholder:text-gray-300 placeholder:font-normal"
              />
              {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
            </div>

            {/* Subtitle (optional) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-1">
                Subtitle <span className="text-gray-400 text-sm font-normal">(optional)</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">A short tagline shown under the title.</p>
              <input
                type="text"
                value={formData.subtitle}
                onChange={set('subtitle')}
                placeholder="e.g. A brief overview of modern techniques"
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Main Content / Description — REQUIRED */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">
                The main body of the blog post. This is the <code className="bg-gray-100 px-1 rounded">description</code> field sent to the API.
              </p>
              <textarea
                value={formData.description}
                onChange={set('description')}
                rows={16}
                placeholder="Write your blog post content here..."
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none leading-relaxed"
              />
              {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-4">Featured Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-gray-400 transition-colors">
                {previewImage ? (
                  <div className="relative max-w-4xl mx-auto">
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
                      <Image src={previewImage} alt="Preview" fill className="object-cover" />
                    </div>
                    <button type="button" onClick={removeImage} className="absolute top-3 right-3 bg-white hover:bg-gray-100 p-2.5 rounded-full shadow-lg">
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                    <p className="text-xs text-gray-500 mt-3">{formData.image?.name}</p>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <div className="space-y-3">
                      <ImageIcon className="w-14 h-14 mx-auto text-gray-400" />
                      <p className="text-base font-medium text-gray-700">Click to upload an image</p>
                      <p className="text-sm text-gray-400">PNG, JPG, WEBP · Max 2MB</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Section (optional) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">Extra Section</h3>
                <span className="text-sm text-gray-400 font-normal">(optional)</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">Add a secondary content section with its own title and body.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <input
                    type="text"
                    value={formData.section_title}
                    onChange={set('section_title')}
                    placeholder="e.g. Introduction"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Body</label>
                  <textarea
                    value={formData.section_description}
                    onChange={set('section_description')}
                    rows={6}
                    placeholder="This section introduces the topic..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ─────────────────────────────────── */}
          <div className="space-y-6">

            {/* Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="status" checked={formData.status === 'draft'} onChange={() => setFormData((p) => ({ ...p, status: 'draft' }))} className="w-4 h-4 text-green-600" />
                  <div>
                    <span className="font-medium text-gray-900">Draft</span>
                    <p className="text-xs text-gray-500">Save without publishing</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="status" checked={formData.status === 'published'} onChange={() => setFormData((p) => ({ ...p, status: 'published' }))} className="w-4 h-4 text-green-600" />
                  <div>
                    <span className="font-medium text-gray-900">Published</span>
                    <p className="text-xs text-gray-500">Visible to all users</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-1">Tags</h3>
              <p className="text-xs text-gray-500 mb-3">Separate with commas</p>
              <input
                type="text"
                value={formData.tags}
                onChange={set('tags')}
                placeholder="e.g. farming, livestock, tips"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
              />
            </div>

            {/* Tips */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h3 className="font-semibold text-green-800 mb-3">Writing Tips</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Keep your title under 70 characters</li>
                <li>• The Content field is the main blog body</li>
                <li>• Use a high-quality featured image</li>
                <li>• Add relevant tags to improve discovery</li>
                <li>• Use Extra Section for supplementary info</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}