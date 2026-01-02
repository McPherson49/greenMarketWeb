'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, Eye, Plus, Calendar, User } from 'lucide-react';

// Mock blog data (replace with real API fetch later)
const mockBlogs = [
  {
    id: '1',
    title: 'The Importance of Livestock in Modern Farming 2025',
    category: 'LIVESTOCKS',
    author: 'Basäm',
    date: '3 Nov 2025',
    image: '/assets/blog1.png',
    status: 'Published',
  },
  {
    id: '2',
    title: 'Agro-Business & Entrepreneurship',
    category: 'UNCATEGORIZED',
    author: 'sinan',
    date: '3 Nov 2025',
    image: '/assets/blog2.png',
    status: 'Draft',
  },
  {
    id: '3',
    title: 'Success Stories & Fishermen Spotlight',
    category: 'FISHERY',
    author: 'Basäm',
    date: '3 Nov 2025',
    image: '/assets/blog3.png',
    status: 'Published',
  },
  {
    id: '4',
    title: 'Market Trends & Prices',
    category: 'FRUITS',
    author: 'sinan',
    date: '3 Nov 2025',
    image: '/assets/blog4.png',
    status: 'Published',
  },
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState(mockBlogs);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setBlogToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (blogToDelete) {
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete));
      setDeleteModalOpen(false);
      setBlogToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all blog posts and create new content
          </p>
        </div>

        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Blog Post
        </Link>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Author
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {blog.title}
                        </p>
                        <p className="text-xs text-gray-500 sm:hidden">
                          {blog.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 hidden sm:table-cell">
                    <span className="inline-block bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-medium uppercase">
                      {blog.category}
                    </span>
                  </td>

                  <td className="py-4 px-6 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">{blog.author}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{blog.date}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        blog.status === 'Published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/blog/${blog.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <Link
                        href={`/admin/blogs/edit/${blog.id}`}
                        className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDeleteClick(blog.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {blogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No blog posts found.</p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {blogs.length} blog post{blogs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Blog Post?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. The blog post will be permanently
              deleted.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}