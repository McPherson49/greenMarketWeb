"use client";

import Link from "next/link";
import Image from "next/image";
import { Blog, normaliseTags } from "@/types/blog";

const FALLBACK_IMAGE = "/assets/blog1.png";

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type BlogGridProps = {
  blogs: Blog[];
  isLoading?: boolean;
  skeletonCount?: number;
};

// ── Shimmer Skeleton ───────────────────────────────────────────
function BlogCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 h-full flex flex-col">
      <div className="relative aspect-4/3 overflow-hidden rounded-lg mb-4">
        <div className="absolute top-3 left-3 z-10 w-16 h-6 bg-gray-200 rounded animate-pulse" />
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      </div>
      <div className="space-y-3 flex-1">
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="flex items-center gap-2 pt-2">
          <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
        <div className="pt-2">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ── Blog Card ──────────────────────────────────────────────────
function BlogCard({ post }: { post: Blog }) {
  return (
    <Link href={`/blog/${post.id}`} className="group">
      <article className="cursor-pointer border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative aspect-4/3 overflow-hidden rounded-lg mb-4">
          {post.category?.name && (
            <span className="absolute top-3 left-3 z-10 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide rounded shadow-sm">
              {post.category.name}
            </span>
          )}
          <Image
            src={post.image_url ?? FALLBACK_IMAGE}
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
          {post.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {post.author?.avatar && (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-5 h-5 rounded-full object-cover"
            />
          )}
          <span className="font-medium">by {post.author?.name}</span>
          <span>•</span>
          <time>{formatDate(post.created_at)}</time>
        </div>
        <div className="mt-4">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
            Read More →
          </span>
        </div>
      </article>
    </Link>
  );
}

// ── Main Export ────────────────────────────────────────────────
export default function BlogGrid({
  blogs,
  isLoading = false,
  skeletonCount = 4,
}: BlogGridProps) {
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(skeletonCount)].map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {blogs.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}