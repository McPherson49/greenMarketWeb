"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Save, X, Image as ImageIcon, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Blog, normaliseTags } from "@/types/blog";
import ApiFetcher from "@/utils/apis";

interface BlogForm {
  title: string;
  content: string;
  description: string;
  tags: string;
  status: "published" | "draft";
  featured_image: File | string | null;
}

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<BlogForm | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof BlogForm, string>>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── Fetch the blog to pre-fill the form ───────────────────
  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchBlog = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const { data: json } = await ApiFetcher.get(`/blogs/${id}`);
        const blog: Blog = json.data;

        // Pre-fill form from live blog data
        setFormData({
          title: blog.title,
          content: blog.content ?? "",
          description: blog.description ?? "",
          // normaliseTags handles both 'a,b,c' string and ['a','b','c'] array
          tags: normaliseTags(blog.tags).join(", "),
          status: blog.status,
          featured_image: blog.image ?? null,
        });

        // Show existing image in preview
        if (blog.image) setPreviewImage(blog.image);
      } catch (err) {
        console.error(err);
        setFetchError(
          "Failed to load blog post. Please go back and try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // ── Image picker ───────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;
    setFormData({ ...formData, featured_image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (!formData) return;
    setFormData({ ...formData, featured_image: null });
    setPreviewImage(null);
  };

  // ── Validation ─────────────────────────────────────────────
  const validate = (): boolean => {
    if (!formData) return false;
    const newErrors: Partial<Record<keyof BlogForm, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit → POST /blogs/:id with _method=PUT ─────────────
  //
  // WHY POST with _method=PUT?
  // The API uses Laravel which doesn't support PUT with file uploads.
  // The workaround is to send a POST request but include a hidden
  // field _method=PUT — Laravel reads this and treats it as a PUT.
  // (This is called "method spoofing" and is standard in Laravel.)
  // ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !validate()) return;

    setIsSaving(true);
    setServerError(null);

    try {
      const body = new FormData();
      body.append("_method", "PUT"); // ← Laravel method spoofing
      body.append("title", formData.title.trim());
      body.append("content", formData.content.trim());
      body.append("description", formData.description.trim());
      // Tags: plain comma-separated string matching API expectation
      if (formData.tags.trim()) {
        const tagList = formData.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
          .join(",");
        body.append("tags", tagList);
      }
      body.append("status", formData.status);

      // Only attach featured_image if a NEW file was selected
      // (if it's still a string, it's the existing URL — don't re-send it)
      if (formData.featured_image instanceof File) {
        body.append("featured_image", formData.featured_image);
      }

      // DO NOT set Content-Type manually — axios detects FormData automatically
      // and sets the correct multipart/form-data boundary. Setting it manually
      // can interfere with the Authorization header added by the interceptor.
      await ApiFetcher.post(`/blogs/${id}`, body);

      router.push("/admin/blogs");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setServerError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const set =
    (field: keyof BlogForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setFormData((prev) =>
        prev ? { ...prev, [field]: e.target.value } : prev,
      );
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  // ── States ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        <span className="ml-3 text-gray-600">Loading blog post...</span>
      </div>
    );
  }

  if (fetchError || !formData) {
    return (
      <div className="text-center py-32">
        <p className="text-red-500 mb-4">
          {fetchError ?? "Blog post not found."}
        </p>
        <Link href="/admin/blogs" className="text-green-600 underline">
          ← Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/blogs"
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Blog Post
              </h1>
              <p className="text-gray-500 mt-1 text-sm">ID: {id}</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-3 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">
            {serverError}
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
                onChange={set("title")}
                className="w-full text-2xl font-bold text-gray-900 border-b-2 border-gray-300 focus:border-green-500 outline-none pb-3"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2">{errors.title}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={set("description")}
                rows={3}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Featured Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-gray-400 transition-colors">
                {previewImage ? (
                  <div className="relative max-w-4xl mx-auto">
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={previewImage}
                        alt="Featured"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 bg-white hover:bg-gray-100 p-2.5 rounded-full shadow-lg"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                    {formData.featured_image instanceof File && (
                      <p className="text-xs text-gray-500 mt-2">
                        New: {formData.featured_image.name}
                      </p>
                    )}
                    {typeof formData.featured_image === "string" && (
                      <label className="cursor-pointer block mt-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <span className="text-sm text-green-600 underline">
                          Replace image
                        </span>
                      </label>
                    )}
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="space-y-3">
                      <ImageIcon className="w-14 h-14 mx-auto text-gray-400" />
                      <p className="text-base font-medium text-gray-700">
                        Click to upload an image
                      </p>
                      <p className="text-sm text-gray-400">
                        PNG, JPG, WEBP up to 10MB
                      </p>
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
                onChange={set("content")}
                rows={18}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none leading-relaxed"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-2">{errors.content}</p>
              )}
            </div>
          </div>

          {/* ── Right Sidebar ─────────────────────────────────── */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === "draft"}
                    onChange={() =>
                      setFormData((p) => (p ? { ...p, status: "draft" } : p))
                    }
                    className="w-4 h-4 text-green-600"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Draft</span>
                    <p className="text-xs text-gray-500">Hidden from public</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === "published"}
                    onChange={() =>
                      setFormData((p) =>
                        p ? { ...p, status: "published" } : p,
                      )
                    }
                    className="w-4 h-4 text-green-600"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Published</span>
                    <p className="text-xs text-gray-500">
                      Visible to all users
                    </p>
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
                onChange={set("tags")}
                placeholder="farming, livestock, tips"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
