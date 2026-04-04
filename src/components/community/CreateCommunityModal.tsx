"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X, Upload, Tag, Globe, Lock, Sprout,
  Fish, Truck, Cpu, HelpCircle, Loader2,
} from "lucide-react";
import { GiCow, GiWheat, GiGrain, GiCargoShip, GiMoneyStack } from "react-icons/gi";
import ApiFetcher from "@/utils/apis";

// ── Props ──────────────────────────────────────────────────────────────────
interface CreateCommunityModalProps {
  onClose: () => void;
  /** Called after a successful create — parent should refresh its list */
  onCreated?: () => void;
}

// ── Category options ───────────────────────────────────────────────────────
interface CategoryOption {
  label: string;
  apiId: number;
  Icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { label: "Livestock & Poultry",     apiId: 1, Icon: GiCow        },
  { label: "Crop Farming",            apiId: 2, Icon: GiWheat      },
  { label: "Aquaculture",             apiId: 3, Icon: Fish         },
  { label: "Agro-processing",         apiId: 4, Icon: GiGrain      },
  { label: "Export & Trade",          apiId: 5, Icon: GiCargoShip  },
  { label: "Supply & Logistics",      apiId: 6, Icon: Truck        },
  { label: "Finance & Investment",    apiId: 7, Icon: GiMoneyStack },
  { label: "Technology & Innovation", apiId: 8, Icon: Cpu          },
  { label: "Other",                   apiId: 9, Icon: HelpCircle   },
];

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
}) => {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [tagInput, setTagInput] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [customCategory, setCustomCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Validation ─────────────────────────────────────────────────────────
  const isOther = form.categoryLabel === "Other";

  /**
   * Step-1 is valid when:
   *   • name >= 3 chars
   *   • description >= 10 chars
   *   • a category is selected
   *   • IF "Other" is chosen, the free-text field is also filled (>= 2 chars)
   */
  const isStep1Valid =
    form.name.trim().length >= 3 &&
    form.description.trim().length >= 10 &&
    form.categoryId !== null &&
    (!isOther || customCategory.trim().length >= 2);

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
      fd.append("category_id", String(form.categoryId));
      fd.append("privacy",     form.privacy);

      if (form.guidelines.trim())
        fd.append("guidelines", form.guidelines.trim());

      // API expects tags as a JSON string: "[\"farming\",\"nigeria\"]"
      if (form.tags.length)
        fd.append("tags", JSON.stringify(form.tags));

      if (form.iconFile)  fd.append("icon",  form.iconFile);
      if (form.coverFile) fd.append("image", form.coverFile);

      // ApiFetcher auto-attaches the JWT — no manual token needed
      await ApiFetcher.post("/communities", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onCreated?.();
      onClose();
    } catch (err: any) {
      // Try to extract a human-readable error from the API response
      const apiErrors = err?.response?.data?.errors;
      const firstFieldError = apiErrors
        ? apiErrors[Object.keys(apiErrors)[0]]?.[0]
        : undefined;

      setSubmitError(
        firstFieldError ??
        err?.response?.data?.message ??
        "Failed to create community. Please try again."
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
            <h2 className="text-2xl font-bold text-gray-900">Create a Community</h2>
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
                {CATEGORY_OPTIONS.map(({ label, apiId, Icon }) => {
                  const selected = form.categoryLabel === label;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, categoryLabel: label, categoryId: apiId }))
                      }
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left ${
                        selected
                          ? "bg-green-500 text-white border-green-500 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${selected ? "text-white" : "text-green-600"}`} />
                      <span className="leading-tight">{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom category input (only when "Other" is chosen) */}
              {isOther && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Describe your category…"
                  maxLength={50}
                  className="mt-3 w-full px-4 py-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-green-50/30"
                />
              )}
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
                  : isOther && customCategory.trim().length < 2
                  ? "Please describe your category (at least 2 characters)."
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
              {submitting ? "Creating…" : "Create Community"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityModal;