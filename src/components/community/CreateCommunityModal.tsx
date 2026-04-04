"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Upload, Tag, Globe, Lock, Sprout, Loader2 } from "lucide-react";
import ApiFetcher from "@/utils/apis";
import { getCategories } from "@/services/category";
import { Category } from "@/types/category";

// ── Props ──────────────────────────────────────────────────────────────────
export interface CommunityToEdit {
  id: number;
  name: string;
  description: string;
  guidelines?: string;
  privacy: "public" | "private";
  tags?: string[];
  category?: { id: number; name: string };
  icon?: string;
  image?: string;
}

interface CreateCommunityModalProps {
  onClose: () => void;
  /** Called after a successful create/update — parent should refresh its list */
  onCreated?: () => void;
  /** Pass an existing community to switch into edit mode */
  community?: CommunityToEdit;
}

// ── Category options ───────────────────────────────────────────────────────
// Uses the same Category type & getCategories() service as the rest of the app

// ── Form state ─────────────────────────────────────────────────────────────
interface FormState {
  name: string;
  description: string;
  categoryId: number | null;
  categoryLabel: string;
  tags: string[];
  guidelines: string;
  privacy: "public" | "private";
  iconFile: File | null;
  iconPreview: string | null;
  coverFile: File | null;
  coverPreview: string | null;
}

const DEFAULT_FORM: FormState = {
  name: "",
  description: "",
  categoryId: null,
  categoryLabel: "",
  tags: [],
  guidelines: "",
  privacy: "public",
  iconFile: null,
  iconPreview: null,
  coverFile: null,
  coverPreview: null,
};

// ── Component ──────────────────────────────────────────────────────────────
const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  onClose,
  onCreated,
  community,
}) => {
  const isEditMode = Boolean(community);
  const [form, setForm] = useState<FormState>(() =>
    community
      ? {
          name:         community.name,
          description:  community.description,
          categoryId:   community.category?.id   ?? null,
          categoryLabel:community.category?.name ?? "",
          tags:         community.tags            ?? [],
          guidelines:   community.guidelines      ?? "",
          privacy:      community.privacy,
          iconFile:     null,
          iconPreview:  community.icon  ?? null,
          coverFile:    null,
          coverPreview: community.image ?? null,
        }
      : DEFAULT_FORM
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => { if (data) setCategories(data); })
      .finally(() => setCategoriesLoading(false));
  }, []);
  const [tagInput, setTagInput] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Validation ─────────────────────────────────────────────────────────
  const isStep1Valid =
    form.name.trim().length >= 3 &&
    form.description.trim().length >= 10 &&
    form.categoryId !== null;

  // ── Tag helpers ────────────────────────────────────────────────────────
  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (trimmed && !form.tags.includes(trimmed) && form.tags.length < 10) {
      setForm((f) => ({ ...f, tags: [...f.tags, trimmed] }));
      setTagInput("");
    }
  };

  // ── Image helpers ──────────────────────────────────────────────────────
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm((f) => ({ ...f, coverFile: file, coverPreview: URL.createObjectURL(file) }));
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm((f) => ({ ...f, iconFile: file, iconPreview: URL.createObjectURL(file) }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const fd = new FormData();
      fd.append("name",        form.name.trim());
      fd.append("description", form.description.trim());

      if (form.categoryId !== null)
        fd.append("category_id", String(form.categoryId));

      fd.append("privacy", form.privacy);

      if (form.guidelines.trim())
        fd.append("guidelines", form.guidelines.trim());

      form.tags.forEach((tag) => fd.append("tags[]", tag));

      // Only send files if new ones were chosen (edit keeps existing otherwise)
      if (form.iconFile)  fd.append("icon",  form.iconFile);
      if (form.coverFile) fd.append("image", form.coverFile);

      const axiosOpts = {
        headers: { "Content-Type": undefined } as any,
        transformRequest: (data: any) => data,
      };

      if (isEditMode && community) {
        // PUT /communities/:id  — Laravel needs _method spoofing for multipart
        fd.append("_method", "PUT");
        await ApiFetcher.post(`/communities/${community.id}`, fd, axiosOpts);
      } else {
        await ApiFetcher.post("/communities", fd, axiosOpts);
      }

      onCreated?.();
      onClose();
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      const firstFieldError = apiErrors
        ? apiErrors[Object.keys(apiErrors)[0]]?.[0]
        : undefined;

      setSubmitError(
        firstFieldError ??
        err?.response?.data?.message ??
        `Failed to ${isEditMode ? "update" : "create"} community. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur overflow-y-auto">
      <div className="bg-white mt-10 rounded-2xl shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">

        {/* ── Header ── */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Community" : "Create a Community"}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* ── Step progress ── */}
        <div className="px-6 pt-5">
          <div className="flex items-center gap-2">
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-green-500" : "bg-gray-200"}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-green-500" : "bg-gray-200"}`} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Basic Info</span>
            <span>Appearance &amp; Privacy</span>
          </div>
        </div>

        {/* ════════════════ STEP 1 ════════════════ */}
        {step === 1 && (
          <div className="p-6 space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Community Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Livestock & Poultry Network"
                maxLength={60}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.name.length}/60</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categoriesLoading ? (
                  <div className="col-span-3 flex items-center justify-center py-6 text-gray-400 gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading categories…
                  </div>
                ) : categories.map((cat) => {
                  const selected = form.categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, categoryId: cat.id, categoryLabel: cat.name }))
                      }
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left ${
                        selected
                          ? "border-green-500 shadow-sm text-white"
                          : "bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
                      }`}
                      style={selected ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                    >
                      {cat.icon ? (
                        <img
                          src={cat.icon}
                          alt={cat.name}
                          className="w-4 h-4 shrink-0 object-contain"
                          style={selected ? { filter: "brightness(0) invert(1)" } : {}}
                        />
                      ) : (
                        <Sprout className={`w-4 h-4 shrink-0 ${selected ? "text-white" : "text-green-600"}`} />
                      )}
                      <span className="leading-tight">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={5}
                maxLength={500}
                placeholder="What is this community about?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-700"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/500</p>
            </div>

            {/* Guidelines (optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Guidelines</label>
              <textarea
                value={form.guidelines}
                onChange={(e) => setForm((f) => ({ ...f, guidelines: e.target.value }))}
                rows={3}
                maxLength={1000}
                placeholder="Community rules and guidelines (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-700 text-sm"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Tags <span className="text-gray-400 font-normal">(up to 10)</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleAddTag(); }
                    }}
                    placeholder="e.g., farming, nigeria"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={form.tags.length >= 10 || !tagInput.trim()}
                  className="px-4 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Add
                </button>
              </div>

              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
                        }
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Inline hint when button is disabled */}
            {!isStep1Valid && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                {form.name.trim().length < 3
                  ? "Community name must be at least 3 characters."
                  : form.categoryId === null
                  ? "Please select a category."
                  : "Description must be at least 10 characters."}
              </p>
            )}
          </div>
        )}

        {/* ════════════════ STEP 2 ════════════════ */}
        {step === 2 && (
          <div className="p-6 space-y-6">

            {/* Community Icon */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Community Icon</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 shrink-0">
                  {form.iconPreview ? (
                    <img src={form.iconPreview} alt="Icon" className="w-full h-full object-cover" />
                  ) : (
                    <Sprout className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <label className="cursor-pointer flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium px-4 py-2 border border-green-300 rounded-lg hover:bg-green-50">
                  <Upload className="w-4 h-4" />
                  Upload icon
                  <input type="file" accept="image/*" onChange={handleIconUpload} className="hidden" />
                </label>
                {form.iconPreview && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, iconFile: null, iconPreview: null }))}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Cover Image</label>
              {form.coverPreview ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-video">
                  <Image src={form.coverPreview} alt="Cover" fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, coverFile: null, coverPreview: null }))}
                    className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="w-full aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50/30 transition-colors flex flex-col items-center justify-center gap-3">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Click to upload cover image</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG · Max 5 MB</p>
                    </div>
                  </div>
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Privacy */}
            <div>
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
                    {p === "public" ? (
                      <Globe className={`w-5 h-5 mt-0.5 shrink-0 ${form.privacy === p ? "text-green-600" : "text-gray-400"}`} />
                    ) : (
                      <Lock className={`w-5 h-5 mt-0.5 shrink-0 ${form.privacy === p ? "text-green-600" : "text-gray-400"}`} />
                    )}
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

            {/* API error banner */}
            {submitError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {submitError}
              </p>
            )}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center rounded-b-2xl">
          <button
            type="button"
            onClick={step === 1 ? onClose : () => setStep(1)}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-md transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-md flex items-center gap-2 transition-colors"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? (isEditMode ? "Saving…" : "Creating…") : (isEditMode ? "Save Changes" : "Create Community")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityModal;