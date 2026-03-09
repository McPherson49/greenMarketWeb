'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Save, X, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ApiFetcher from '@/utils/apis'; 

interface BlogForm {
  title: string;
  content: string;
  description: string;  // ← API requires this field name
  tags: string;
  status: 'published' | 'draft';
  featured_image: File | null;
}

const EMPTY_FORM: BlogForm = {
  title: '',
  content: '',
  description: '',
  tags: '',
  status: 'draft',
  featured_image: null,
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
    setFormData((prev) => ({ ...prev, featured_image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, featured_image: null }));
    setPreviewImage(null);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BlogForm, string>> = {};
    if (!formData.title.trim())       newErrors.title       = 'Title is required';
    if (!formData.content.trim())     newErrors.content     = 'Content is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
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
      body.append('title',       formData.title.trim());
      body.append('content',     formData.content.trim());
      body.append('description', formData.description.trim());
      body.append('status',      formData.status);

      // Tags: send as plain comma-separated string exactly as Postman docs show
      // e.g. "farming,agriculture,modern"
      if (formData.tags.trim()) {
        const tagList = formData.tags.split(',').map((t) => t.trim()).filter(Boolean).join(',');
        body.append('tags', tagList);
      }

      // Only append image if one was selected — server may crash on empty file field
      if (formData.featured_image instanceof File) {
        body.append('featured_image', formData.featured_image);
      }

      await ApiFetcher.post('/blogs', body, {
        // No Content-Type — axios sets multipart/form-data + boundary automatically
      });

      router.push('/admin/blogs');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setServerError(message);
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
            {isSaving ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>

        {/* Server error — shows all API validation errors */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm whitespace-pre-line">
            <p className="font-semibold mb-2">Could not save:</p>
            <p>{serverError}</p>
            {serverError.includes('500') && (
              <p className="mt-3 text-xs text-red-500 border-t border-red-200 pt-2">
                Tip: Try submitting without an image first to rule out an upload issue.
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">

          {/* Left Column */}
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

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Description <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-3">A short summary shown on the blog listing page.</p>
              <textarea
                value={formData.description}
                onChange={set('description')}
                rows={3}
                placeholder="Brief description of the post..."
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
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
                    <p className="text-xs text-gray-500 mt-3">{formData.featured_image?.name}</p>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <div className="space-y-3">
                      <ImageIcon className="w-14 h-14 mx-auto text-gray-400" />
                      <p className="text-base font-medium text-gray-700">Click to upload an image</p>
                      <p className="text-sm text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={set('content')}
                rows={18}
                placeholder="Write your blog post content here..."
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none leading-relaxed"
              />
              {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
            </div>
          </div>

          {/* Right Sidebar */}
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
              <p className="text-xs text-gray-500 mb-3">Separate with commas: farming, fruits, tips</p>
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
                <li>• Write a clear, concise description</li>
                <li>• Use a high-quality featured image</li>
                <li>• Add relevant tags to improve discovery</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}