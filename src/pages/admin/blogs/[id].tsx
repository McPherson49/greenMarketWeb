'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, X, Calendar, User, ImageIcon } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditBlogPost() {
  const { id } = useParams(); // Now works correctly
  const [formData, setFormData] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  // Mock fetch
  const getBlogById = (id: string) => {
    const blogs: Record<string, any> = {
      '1': {
        id: '1',
        title: 'The Importance of Livestock in Modern Farming 2025',
        category: 'LIVESTOCKS',
        content: 'Livestock farming has always been at the heart of agriculture...',
        author: 'Basäm',
        image: '/assets/blog1.png',
        status: 'Published',
      },
      // Add more...
    };
    return blogs[id] || null;
  };

  useEffect(() => {
    if (!id) return;

    const blog = getBlogById(id as string);
    if (blog) {
      setFormData(blog);
      setPreviewImage(blog.image);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!formData) return <div className="p-8 text-center text-red-600">Blog not found</div>;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Updated blog:', formData);
    alert('Blog updated successfully!');
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="text-gray-600 mt-1">ID: {id}</p>
        </div>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Post Title</h2>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setErrors({ ...errors, title: '' });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl font-bold"
            />
            {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-gray-400 transition-colors">
              {previewImage ? (
                <div className="relative max-w-4xl mx-auto">
                  <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
                    <Image src={previewImage} alt="Preview" fill className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setFormData({ ...formData, image: null });
                    }}
                    className="absolute top-4 right-4 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg"
                  >
                    <X className="w-6 h-6 text-red-600" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <div className="space-y-4">
                    <ImageIcon className="w-16 h-16 mx-auto text-gray-400" />
                    <p className="text-lg font-medium text-gray-700">Click to upload new image</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
            <textarea
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value });
                setErrors({ ...errors, content: '' });
              }}
              rows={15}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-medium leading-relaxed"
            />
            {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category</h2>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option>LIVESTOCKS</option>
              <option>FRUITS</option>
              <option>FISHERY</option>
              <option>UNCATEGORIZED</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Author</h2>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={formData.status === 'Draft'}
                  onChange={() => setFormData({ ...formData, status: 'Draft' })}
                  className="w-5 h-5 text-green-600"
                />
                <span className="font-medium">Draft</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={formData.status === 'Published'}
                  onChange={() => setFormData({ ...formData, status: 'Published' })}
                  className="w-5 h-5 text-green-600"
                />
                <span className="font-medium">Published</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Publish Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>January 02, 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <span>By {formData.author}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}