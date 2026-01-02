"use client";

import React, { useState } from "react";
import { Plus, X, Trash2, Calendar, User, Image } from "lucide-react";
import { useRouter } from "next/navigation";

type BlogSection = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
};

export default function NewBlogPost() {
  const [mainTitle, setMainTitle] = useState("");
  const [category, setCategory] = useState("LIVESTOCKS");
  const [author, setAuthor] = useState("Basäm");
  const [status, setStatus] = useState<"Draft" | "Published">("Draft");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [sections, setSections] = useState<BlogSection[]>([
    { id: "initial", title: "", subtitle: "", description: "" },
  ]);


   const router = useRouter();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        title: "",
        subtitle: "",
        description: "",
      },
    ]);
  };

  const removeSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter((s) => s.id !== id));
    }
  };

  const updateSection = (
    id: string,
    field: keyof BlogSection,
    value: string
  ) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!mainTitle.trim()) newErrors.mainTitle = "Main title is required";
    if (!image) newErrors.image = "Featured image is required";

    const hasContent = sections.some((s) => s.description.trim());
    if (!hasContent)
      newErrors.sections = "Please add at least one section with content";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Blog ready to submit:", {
      mainTitle,
      category,
      author,
      status,
      sections,
    });
    alert("Blog post submitted! Check console for details.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-4 ">
        {/* Header */}
        <div>
          <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex items-center space-x-2">
              <li>
                <button
                  onClick={() => router.back()}
                  className="font-bold text-black hover:underline"
                >
                  Blog
                </button>
              </li>

              <li>
                <span className="text-gray-500">/</span>
              </li>

              <li>
                <span className="text-gray-500">News</span>
              </li>
            </ol>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Blog Post
            </h1>
            <p className="text-gray-600 mt-2">
              Write a rich blog post with a main title, featured image, and{" "}
              <strong>multiple optional sections</strong>.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStatus("Draft")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                status === "Draft"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              Publish Post
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Title */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Main Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={mainTitle}
                onChange={(e) => {
                  setMainTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, mainTitle: "" }));
                }}
                placeholder="e.g., The Importance of Livestock in Modern Farming 2026"
                className="w-full text-lg font-bold text-gray-900 placeholder-gray-400 border-b-2 border-gray-300 focus:border-green-500 outline-none pb-3"
              />
              {errors.mainTitle && (
                <p className="text-red-500 text-sm mt-3">{errors.mainTitle}</p>
              )}
            </div>

            {/* Main Description (First Section) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Main Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={sections[0].description}
                onChange={(e) =>
                  updateSection(sections[0].id, "description", e.target.value)
                }
                rows={12}
                placeholder="Write the main content of your blog post here..."
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-800 leading-relaxed"
              />
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Featured Image <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-gray-400 transition-colors">
                {previewImage ? (
                  <div className="relative max-w-4xl mx-auto">
                    <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={previewImage}
                        alt="Featured"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setImage(null);
                      }}
                      className="absolute top-4 right-4 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="space-y-4">
                      <Image className="w-16 h-16 mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Click to upload featured image
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          or drag and drop (PNG, JPG up to 10MB)
                        </p>
                      </div>
                    </div>
                  </label>
                )}
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-3">{errors.image}</p>
              )}
            </div>

            {/* Additional Sections */}
            {sections.length > 1 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Additional Sections
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Add more sections with titles, subtitles, and
                      descriptions.
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                    {sections.length - 1} Extra{" "}
                    {sections.length - 1 === 1 ? "Section" : "Sections"}
                  </span>
                </div>

                {/* Fixed: Removed duplicated line and corrected JSX */}
                {sections.slice(1).map((section, index) => (
                  <div
                    key={section.id}
                    className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeSection(section.id)}
                      className="absolute top-6 right-6 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                      title="Remove this section"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Title (optional)
                        </label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            updateSection(section.id, "title", e.target.value)
                          }
                          placeholder="e.g., Why Livestock Matters"
                          className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 border-b border-gray-200 focus:border-green-500 outline-none pb-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtitle (optional)
                        </label>
                        <input
                          type="text"
                          value={section.subtitle}
                          onChange={(e) =>
                            updateSection(
                              section.id,
                              "subtitle",
                              e.target.value
                            )
                          }
                          placeholder="e.g., A look into food security and income generation"
                          className="w-full text-lg italic text-gray-600 placeholder-gray-400 border-b border-gray-200 focus:border-green-500 outline-none pb-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={section.description}
                          onChange={(e) =>
                            updateSection(
                              section.id,
                              "description",
                              e.target.value
                            )
                          }
                          rows={10}
                          placeholder="Write the content for this section here..."
                          className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-gray-800 leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="mt-6 text-sm text-gray-500">
                      Additional Section {index + 1}
                    </div>
                  </div>
                ))}

                {errors.sections && (
                  <p className="text-red-500 text-center font-medium">
                    {errors.sections}
                  </p>
                )}
              </div>
            )}

            {/* Add Section Button */}
            <button
              type="button"
              onClick={addSection}
              className="w-full py-6 border-2 border-dashed border-green-300 rounded-2xl bg-green-50 hover:bg-green-100 hover:border-green-500 transition-all flex flex-col items-center justify-center gap-3 text-green-700 font-semibold"
            >
              <Plus className="w-10 h-10" />
              <span className="text-lg">
                {sections.length === 1
                  ? "Add Additional Section"
                  : "Add Another Section"}
              </span>
              <span className="text-sm font-normal">
                Optional: Title • Subtitle • Description
              </span>
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option>LIVESTOCKS</option>
                <option>FRUITS</option>
                <option>FISHERY</option>
                <option>UNCATEGORIZED</option>
                <option>AGRO-BUSINESS</option>
                <option>EQUIPMENT</option>
              </select>
            </div>

            {/* Author */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Author</h3>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                Publish Status
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="radio"
                    checked={status === "Draft"}
                    onChange={() => setStatus("Draft")}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="font-medium">Draft</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="radio"
                    checked={status === "Published"}
                    onChange={() => setStatus("Published")}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="font-medium">Published</span>
                </label>
              </div>
            </div>

            {/* Preview Info */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span>Will be published on: January 02, 2026</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span>By {author || "Author"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
