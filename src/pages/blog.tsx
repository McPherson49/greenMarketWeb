"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
import Newsletter from "@/components/newsletter/Newsletter";

interface BlogPost {
  id: string;
  category: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

const allBlogPosts: BlogPost[] = [
  {
    id: "1",
    category: "LIVESTOCKS",
    image: "/assets/blog1.png",
    title: "Livestock Tips & Best Practices",
    excerpt:
      "Blimlävikt treskade i nibel den mobilissbruk dären jyn nöning osk hetreosk i rel ultran. Fåläss",
    author: "Basäm",
    date: "3 Nov 2025",
  },
  {
    id: "2",
    category: "UNCATEGORIZED",
    image: "/assets/blog2.png",
    title: "Agro-Business & Entrepreneurship",
    excerpt:
      "Blimlävikt treskade i nibel den mobilissbruk dären jyn nöning osk hetreosk i rel ultran. Fåläss",
    author: "Basam",
    date: "3 May 2025",
  },
  {
    id: "3",
    category: "FISHERY",
    image: "/assets/blog3.png",
    title: "Success Stories & Fishermen Spotlight",
    excerpt:
      "Blimlävikt treskade i nibel den mobilissbruk dären jyn nöning osk hetreosk i rel ultran. Fåläss",
    author: "Basäm",
    date: "3 Nov 2025",
  },
  {
    id: "4",
    category: "FRUITS",
    image: "/assets/blog4.png",
    title: "Market Trends & Prices",
    excerpt:
      "Blimlävikt treskade i nibel den mobilissbruk dären jyn nöning osk hetreosk i rel ultran. Fåläss",
    author: "sinan",
    date: "3 May 2025",
  },
  {
    id: "5",
    category: "LIVESTOCKS",
    image: "/assets/blog1.png",
    title: "Livestock Tips & Best Practices",
    excerpt:
      "Blimlävikt treskade i nibel den mobilissbruk dären jyn nöning osk hetreosk i rel ultran. Fåläss",
    author: "Basäm",
    date: "3 Nov 2025",
  },
  {
    id: "6",
    category: "UNCATEGORIZED",
    image: "/assets/blog2.png",
    title: "Agro-Business & Entrepreneurship",
    excerpt:
      "Blimlävikt treskade i nibel den mobilissbruk dären jyn nöning osk hetreosk i rel ultran. Fåläss",
    author: "sinan",
    date: "3 May 2025",
  },
];

const categories = [
  { name: "Agrochemical", count: 6 },
  { name: "Food", count: 8 },
  { name: "Farm machinery", count: 4 },
  { name: "Fish & Aquatic", count: 5 },
  { name: "Fresh Fruit", count: 7 },
];

const popularTags = [
  "Cabbage",
  "Broccoli",
  "Smoothie",
  "Fruit",
  "Salad",
  "Appetizer",
];

const filterOptions = [
  { label: "Shopping", active: false },
  { label: "Recipes", active: false },
  { label: "Kitchen", active: false },
  { label: "News", active: false },
  { label: "Food", active: false },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Show All");
  const [selectedSort, setSelectedSort] = useState("Sort: Featured");

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-16 px-4"
        style={{
          backgroundImage: "url('/assets/Footer.png')",
          width: "100%",
          height: "100%",
        }}
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

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3">
            {filterOptions.map((option) => (
              <button
                key={option.label}
                className={`px-6 py-2 rounded-full border transition-all ${
                  option.active
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-emerald-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-600 rounded-sm"></span>
              Blog News
            </h2>

            <div className="flex items-center gap-4">
              {/* Filter Dropdown */}
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer">
                <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{selectedFilter}</span>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer">
                <span className="text-sm text-gray-700">{selectedSort}</span>
              </div>

              {/* Search */}
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
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* Blog Posts Grid */}
            <div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {allBlogPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="group"
                  >
                    <article className="cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                        <span className="absolute top-3 left-3 z-10 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide rounded shadow-sm">
                          {post.category}
                        </span>
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium">by {post.author}</span>
                        <span>•</span>
                        <time>{post.date}</time>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  ‹
                </button>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  ›
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Category Widget */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Category
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <span className="text-emerald-600 text-sm">🌿</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  View All
                </button>
              </div>

              {/* Popular Tags */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-sm"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div className="mt-20">
        <Newsletter />
      </div>
    </div>
  );
}
