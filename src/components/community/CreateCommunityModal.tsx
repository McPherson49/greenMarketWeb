import React, { useState } from "react";
import Image from "next/image";
import { X, Upload, Plus, Globe, Lock, Tag, Sprout, Fish, Factory, Truck, TrendingUp, Cpu, HelpCircle, Waves } from "lucide-react";
import { GiCow, GiWheat, GiGrain, GiCargoShip, GiMoneyStack, GiPlantSeed } from "react-icons/gi";
import { NewCommunity } from "../../types/community";

interface CreateCommunityModalProps {
  onClose: () => void;
  onSubmit: (community: NewCommunity) => void;
}

interface CategoryOption {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { label: "Livestock & Poultry",      Icon: GiCow        },
  { label: "Crop Farming",             Icon: GiWheat      },
  { label: "Aquaculture",              Icon: Fish         },
  { label: "Agro-processing",          Icon: GiGrain      },
  { label: "Export & Trade",           Icon: GiCargoShip  },
  { label: "Supply & Logistics",       Icon: Truck        },
  { label: "Finance & Investment",     Icon: GiMoneyStack },
  { label: "Technology & Innovation",  Icon: Cpu          },
  { label: "Other",                    Icon: HelpCircle   },
];

// Keep CATEGORIES as a plain string array for any downstream usage
const CATEGORIES = CATEGORY_OPTIONS.map((c) => c.label);

const DEFAULT_FORM: NewCommunity = {
  name: "",
  description: "",
  category: "",
  icon: "🌾",
  coverImage: null,
  coverPreview: null,
  isPrivate: false,
  tags: [],
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<NewCommunity>(DEFAULT_FORM);
  const [tagInput, setTagInput] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [customCategory, setCustomCategory] = useState("");

  const isOther = form.category === "Other";
  const isStep1Valid =
    form.name.trim().length >= 3 &&
    form.description.trim().length >= 10 &&
    (isOther ? customCategory.trim().length >= 2 : !!form.category);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (trimmed && !form.tags.includes(trimmed) && form.tags.length < 5) {
      setForm({ ...form, tags: [...form.tags, trimmed] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setForm({ ...form, coverImage: file, coverPreview: url });
    }
  };

  const handleSubmit = () => {
    const finalForm = form.category === "Other"
      ? { ...form, category: customCategory.trim() }
      : form;
    onSubmit(finalForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 px-4 backdrop-blur overflow-y-auto">
      <div className="bg-white mt-10 rounded-2xl shadow-2xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create a Community</h2>
            <p className="text-sm text-gray-500 mt-0.5">Step {step} of 2</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Step Indicator */}
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
            {/* Community Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Community Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Livestock & Poultry Network"
                maxLength={60}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.name.length}/60</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_OPTIONS.map(({ label, Icon }) => {
                  const isSelected = form.category === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setForm({ ...form, category: label })}
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

              {/* Custom category input — shown only when "Other" is selected */}
              {isOther && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Describe your category (e.g., Beekeeping, Mushroom Farming...)"
                    maxLength={50}
                    className="w-full px-4 py-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-green-50/30"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{customCategory.length}/50</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                maxLength={500}
                placeholder="What is this community about? What kind of discussions will happen here?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-700 leading-relaxed"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/500</p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Tags <span className="text-gray-400 font-normal">(up to 5)</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Help people discover your community</p>
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
                  disabled={form.tags.length >= 5 || !tagInput.trim()}
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
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 transition-colors">
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
            {/* Icon Picker — pick from the category icons */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Community Icon
              </label>
              <p className="text-xs text-gray-500 mb-3">Choose an icon that best represents your community</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {CATEGORY_OPTIONS.map(({ label, Icon }) => {
                  const isSelected = form.icon === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setForm({ ...form, icon: label })}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-50 shadow-sm"
                          : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? "text-green-600" : "text-gray-500"}`} />
                      <span className={`text-[10px] font-medium text-center leading-tight line-clamp-2 ${isSelected ? "text-green-700" : "text-gray-500"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Cover Image
              </label>
              {form.coverPreview ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-3/1">
                  <Image
                    src={form.coverPreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    onClick={() => setForm({ ...form, coverImage: null, coverPreview: null })}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors z-10"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="w-full aspect-3/1 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50/30 transition-colors flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">Click to upload cover image</p>
                      <p className="text-xs text-gray-400 mt-1">Recommended: 1500×500px · JPG, PNG · Max 5MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Preview Card */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Preview</label>
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="h-20 bg-linear-to-r from-green-400 to-emerald-500 relative">
                  {form.coverPreview && (
                    <Image src={form.coverPreview} alt="" fill className="object-cover" unoptimized />
                  )}
                </div>
                <div className="px-4 pb-4 pt-2 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-50 border-2 border-white rounded-full shadow-md flex items-center justify-center shrink-0">
                      {(() => {
                        const match = CATEGORY_OPTIONS.find((c) => c.label === form.icon);
                        if (match) return <match.Icon className="w-6 h-6 text-green-600" />;
                        return <Sprout className="w-6 h-6 text-green-600" />;
                      })()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{form.name || "Community Name"}</p>
                      <p className="text-xs text-gray-500">{(isOther ? customCategory : form.category) || "Category"} · 0 members</p>
                    </div>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.tags.map((t) => (
                        <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Privacy</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setForm({ ...form, isPrivate: false })}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    !form.isPrivate
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Globe className={`w-5 h-5 mt-0.5 shrink-0 ${!form.isPrivate ? "text-green-600" : "text-gray-400"}`} />
                  <div>
                    <p className={`font-semibold text-sm ${!form.isPrivate ? "text-green-800" : "text-gray-700"}`}>
                      Public
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Anyone can find and join this community
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => setForm({ ...form, isPrivate: true })}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    form.isPrivate
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Lock className={`w-5 h-5 mt-0.5 shrink-0 ${form.isPrivate ? "text-green-600" : "text-gray-400"}`} />
                  <div>
                    <p className={`font-semibold text-sm ${form.isPrivate ? "text-green-800" : "text-gray-700"}`}>
                      Private
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Members must request to join
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center rounded-b-2xl">
          <button
            onClick={step === 1 ? onClose : () => setStep(1)}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-md transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-md transition-colors"
            >
              Create Community
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityModal;