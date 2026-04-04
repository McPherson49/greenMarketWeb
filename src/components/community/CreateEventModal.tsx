"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Upload, Tag, Globe, Lock, Sprout, Fish, Truck, Cpu, HelpCircle, Loader2 } from "lucide-react";
import { GiCow, GiWheat, GiGrain, GiCargoShip, GiMoneyStack } from "react-icons/gi";
import { createCommunity } from "@/services/community";

interface CreateCommunityModalProps {
  onClose: () => void;
  onCreated?: () => void; // callback to refetch list
  token: string;
}

interface CategoryOption {
  label: string;
  apiId: number; // maps to your backend category IDs — adjust as needed
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

const DEFAULT: FormState = {
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

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  onClose,
  onCreated,
  token,
}) => {
  const [form, setForm] = useState<FormState>(DEFAULT);
  const [tagInput, setTagInput] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [customCategory, setCustomCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isOther = form.categoryLabel === "Other";
  const isStep1Valid =
    form.name.trim().length >= 3 &&
    form.description.trim().length >= 10 &&
    (isOther ? customCategory.trim().length >= 2 : form.categoryId !== null);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (trimmed && !form.tags.includes(trimmed) && form.tags.length < 10) {
      setForm((f) => ({ ...f, tags: [...f.tags, trimmed] }));
      setTagInput("");
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, coverFile: file, coverPreview: URL.createObjectURL(file) }));
    }
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, iconFile: file, iconPreview: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append(
        "category_id",
        String(isOther ? form.categoryId : form.categoryId)
      );
      formData.append("privacy", form.privacy);
      if (form.guidelines.trim()) formData.append("guidelines", form.guidelines.trim());
      if (form.tags.length) formData.append("tags", JSON.stringify(form.tags));
      if (form.iconFile) formData.append("icon", form.iconFile);
      if (form.coverFile) formData.append("image", form.coverFile);

      await createCommunity(formData, token);
      onCreated?.();
      onClose();
    } catch (err: any) {
      setSubmitError(err?.message ?? "Failed to create community. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur overflow-y-auto">
      <div className="bg-white mt-10 rounded-2xl shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create a Community</h2>
            <p className="text-sm text-gray-500 mt-0.5">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-5">
          <div className="flex items-center gap-2">
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-green-500" : "bg-gray-200"}`} />
            <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-green-500" : "bg-gray-200"}`} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Basic Info</span>
            <span>Appearance & Privacy</span>
          </div>
        </div>

        {/* ── STEP 1 ── */}
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
                  const isSelected = form.categoryLabel === label;
                  return (
                    <button
                      key={label}
                      onClick={() =>
                        setForm((f) => ({ ...f, categoryLabel: label, categoryId: apiId }))
                      }
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left ${
                        isSelected
                          ? "bg-green-500 text-white border-green-500 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-green-600"}`} />
                      <span className="leading-tight">{label}</span>
                    </button>
                  );
                })}
              </div>
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

            {/* Guidelines */}
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
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="e.g., farming, nigeria"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <button
                  onClick={handleAddTag}
                  disabled={form.tags.length >= 10 || !tagInput.trim()}
                  className="px-4 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 text-white rounded-lg text-sm font-medium transition-colors"
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
                        onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            {/* Icon upload */}
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
                    onClick={() => setForm((f) => ({ ...f, iconFile: null, iconPreview: null }))}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Cover image */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Cover Image</label>
              {form.coverPreview ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-video">
                  <Image src={form.coverPreview} alt="Cover" fill className="object-cover" unoptimized />
                  <button
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
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG · Max 5MB</p>
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
                      <p className={`font-semibold text-sm capitalize ${form.privacy === p ? "text-green-800" : "text-gray-700"}`}>{p}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {p === "public" ? "Anyone can find and join" : "Members must request to join"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit error */}
            {submitError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {submitError}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center rounded-b-2xl">
          <button
            onClick={step === 1 ? onClose : () => setStep(1)}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-md"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg font-semibold shadow-md flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Community
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityModal;