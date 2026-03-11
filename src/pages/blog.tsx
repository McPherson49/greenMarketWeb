"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
import Newsletter from "@/components/newsletter/Newsletter";
import { getPublishedBlogs } from "@/services/blog";
import { Blog, PaginatedBlogs, normaliseTags } from "@/types/blog";
import BlogGrid from "@/components/blog/BlogGrid";

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const FALLBACK_IMAGE = "/assets/blog1.png";
// const filterLabels = ["Shopping", "Recipes", "Kitchen", "News", "Food"];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<PaginatedBlogs["meta"] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("Show All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // ── Derived: unique tags ───────────────────────────────────
  // normaliseTags handles both "a,b,c" string and ["a","b","c"] array
  const allTags = Array.from(
    new Set(blogs.flatMap((blog) => normaliseTags(blog.tags)))
  );

  // ── Derived: category name → count map ────────────────────
  // blog.category is { id, name } | null — extract .name for the key
  const categoryMap = blogs.reduce<Record<string, number>>((acc, blog) => {
    const cat = blog.category?.name ?? "Uncategorized"; // ✅ .name, not the object
    acc[cat] = (acc[cat] ?? 0) + 1;
    return acc;
  }, {});

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPublishedBlogs(currentPage);
      setBlogs(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError("Failed to load blog posts. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // ── Client-side filter ─────────────────────────────────────
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      searchQuery === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // normaliseTags so .includes() works whether tags is string or array
    const matchesTag =
      activeTag === null || normaliseTags(blog.tags).includes(activeTag);

    return matchesSearch && matchesTag;
  });

  const totalPages = pagination?.last_page ?? 1;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-2 md:py-8 px-4"
        style={{ backgroundImage: "url('/assets/Footer.png')" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-emerald-600 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
              Home / Blog & News
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blog & News
            </h1>
          </div>
          {/* <div className="flex flex-wrap gap-3">
            {filterLabels.map((label) => (
              <button
                key={label}
                onClick={() =>
                  setSelectedFilter(label === selectedFilter ? "Show All" : label)
                }
                className={`px-6 py-2 rounded-full border transition-all ${
                  selectedFilter === label
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-emerald-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div> */}
        </div>
      </section>

      {/* Main */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-600 rounded-sm"></span>
              Blog News
              {pagination && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({pagination.total} posts)
                </span>
              )}
            </h2>
            {/* <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
                <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{selectedFilter}</span>
              </div>
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div> */}
          </div>

          <div className="grid">
            <div>
              {/* Loading - Shimmer UI */}
              {isLoading && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 h-full flex flex-col">
                      <div className="relative aspect-4/3 overflow-hidden rounded-lg mb-4">
                        <div className="absolute top-3 left-3 z-10 w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="flex items-center gap-2 pt-2">
                          <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </div>
                        <div className="pt-2">
                          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error */}
              {error && !isLoading && (
                <div className="text-center py-20">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={fetchBlogs}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Empty */}
              {!isLoading && !error && filteredBlogs.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-lg">No blog posts found.</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-3 text-emerald-600 underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}

              {/* Grid */}
            <BlogGrid blogs={filteredBlogs} isLoading={isLoading} skeletonCount={8} />

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>
                  {pageNumbers.map((page, i) => {
                    const prev = pageNumbers[i - 1];
                    const showEllipsis = prev !== undefined && page - prev > 1;
                    return (
                      <span key={page} className="flex items-center gap-2">
                        {showEllipsis && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-emerald-600 text-white"
                              : "border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    );
                  })}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-20">
        <Newsletter />
      </div>
    </div>
  );
}