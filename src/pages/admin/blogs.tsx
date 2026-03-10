'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, Eye, Plus, Calendar, User, Loader2 } from 'lucide-react';
import { Blog, normaliseTags } from '@/types/blog';
import ApiFetcher from '@/utils/apis';

const FALLBACK_IMAGE = '/assets/blog1.png';

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await ApiFetcher.get('/admin/blogs');
      // API shape: { success, data: { data: [...blogs] } }
      setBlogs(data?.data?.data ?? []);
    } catch (err) {
      setError('Failed to load blog posts. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // ── Delete ─────────────────────────────────────────────────
  const handleDeleteClick = (id: number) => {
    setBlogToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);
    try {
      await ApiFetcher.delete(`admin/blogs/${blogToDelete}`);
      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete));
      setDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all blog posts and create new content</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Blog Post
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          <span className="ml-3 text-gray-600">Loading posts...</span>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="text-center py-16">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchBlogs} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Blog Posts Yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                Create your first blog post using the button above.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-100 border border-green-300"></div>
                  <span>Published</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-100 border border-yellow-300"></div>
                  <span>Draft</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Post</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Author</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-center py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                              <Image
                                src={blog.image ?? FALLBACK_IMAGE}
                                alt={blog.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 line-clamp-2">{blog.title}</p>
                              {/* normaliseTags handles string | string[] | undefined */}
                              {normaliseTags(blog.tags).length > 0 && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {normaliseTags(blog.tags).slice(0, 2).join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            {blog.author?.avatar ? (
                              <img
                                src={blog.author.avatar}
                                alt={blog.author.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                            )}
                            <span className="text-sm text-gray-700">{blog.author?.name}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 hidden lg:table-cell">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatDate(blog.created_at)}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            blog.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {blog.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Link href={`/blog/${blog.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link href={`/admin/blogs/${blog.id}`} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
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
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {blogs.length} blog post{blogs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Blog Post?</h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone. The blog post will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}