// NO "use client" — server-side rendered
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { GetServerSideProps } from "next";
import { Blog, normaliseTags, PaginatedBlogs } from "@/types/blog";

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getReadTime(text: string): string {
  const words = text?.trim().split(/\s+/).length ?? 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

const FALLBACK_IMAGE = "/assets/blog1.png";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function serverGetBlog(id: string): Promise<Blog> {
  const res = await fetch(`${BASE_URL}/blogs/${id}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Blog ${id} not found: ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function serverGetBlogs(page = 1): Promise<PaginatedBlogs> {
  const res = await fetch(`${BASE_URL}/blogs?page=${page}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to fetch blogs: ${res.status}`);
  const json = await res.json();
  return {
    data: json.data?.data ?? [],
    meta: {
      current_page: json.data?.current_page ?? 1,
      last_page:    json.data?.last_page ?? 1,
      per_page:     json.data?.per_page ?? 15,
      total:        json.data?.total ?? 0,
    },
    links: {
      first: json.data?.first_page_url ?? null,
      last:  json.data?.last_page_url ?? null,
      next:  json.data?.next_page_url ?? null,
      prev:  json.data?.prev_page_url ?? null,
    },
  };
}

interface BlogDetailPageProps {
  blogPost: Blog;
  trendingPosts: Blog[];
  allTags: string[];
}

export const getServerSideProps: GetServerSideProps<BlogDetailPageProps> = async ({ params }) => {
  const id = params?.id as string;

  let blogPost: Blog;
  try {
    blogPost = await serverGetBlog(id);
  } catch (error: unknown) {
    const status = (error as Error).message.match(/\d{3}/)?.[0];
    if (status === "401" || status === "403") {
      return { redirect: { destination: "/blog?error=auth", permanent: false } };
    }
    console.error("Blog fetch failed:", error);
    return { notFound: true };
  }

  let trendingPosts: Blog[] = [];
  let allTags: string[] = [];
  try {
    const allBlogsResponse = await serverGetBlogs(1);
    trendingPosts = allBlogsResponse.data
      .filter((b: Blog) => String(b.id) !== id)
      .slice(0, 4);
    allTags = Array.from(
      new Set<string>(allBlogsResponse.data.flatMap((b: Blog) => normaliseTags(b.tags)))
    );
  } catch {
    // sidebar fails silently
  }

  return { props: { blogPost, trendingPosts, allTags } };
};

export default function BlogDetailPage({ blogPost, trendingPosts, allTags }: BlogDetailPageProps) {
  const tags = normaliseTags(blogPost.tags);

  // Use description as the main readable content for read time
  const readTimeText = blogPost.description
    ? getReadTime(blogPost.description)
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-emerald-600 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:underline">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-[200px]">{blogPost.title}</span>
          </p>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="grid lg:grid-cols-[1fr_340px] gap-5">

            {/* ── Article ─────────────────────────────────────── */}
            <article className="max-w-3xl">

              {/* Category badge */}
              {blogPost.category?.name && (
                <span className="inline-block bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-medium mb-4 uppercase">
                  {blogPost.category.name}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {blogPost.title}
              </h1>

              {/* Subtitle */}
              {blogPost.subtitle && (
                <p className="text-xl text-gray-500 mb-6 leading-relaxed">
                  {blogPost.subtitle}
                </p>
              )}

              {/* Author + date + read time */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {blogPost.author?.avatar
                      ? <img src={blogPost.author.avatar} alt={blogPost.author.name} className="w-full h-full object-cover" />
                      : <User className="w-4 h-4 text-gray-600" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">By {blogPost.author?.name}</p>
                    {readTimeText && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {readTimeText}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(blogPost.created_at)}</span>
                </div>
              </div>

              {/* Featured image */}
              <div className="relative aspect-[16/10] mb-8 rounded-2xl overflow-hidden">
                <Image
                  src={blogPost.image ?? FALLBACK_IMAGE}
                  alt={blogPost.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-cover"
                />
              </div>

              {/* Main content — description field */}
              {blogPost.description && (
                <div className="prose prose-lg max-w-none mb-8 text-gray-700 leading-relaxed">
                  <p>{blogPost.description}</p>
                </div>
              )}

              {/* Extra section */}
              {(blogPost.section_title || blogPost.section_description) && (
                <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  {blogPost.section_title && (
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      {blogPost.section_title}
                    </h2>
                  )}
                  {blogPost.section_description && (
                    <p className="text-gray-700 leading-relaxed">
                      {blogPost.section_description}
                    </p>
                  )}
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-sm"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* ── Sidebar ──────────────────────────────────────── */}
            <aside className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Trending Now</h3>
                {trendingPosts.length === 0 ? (
                  <p className="text-sm text-gray-400">No trending posts yet.</p>
                ) : (
                  <div className="space-y-4">
                    {trendingPosts.map((post: Blog) => (
                      <Link key={post.id} href={`/blog/${post.id}`} className="flex gap-3 group">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={post.image ?? FALLBACK_IMAGE}
                            alt={post.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
                            {post.title}
                          </h4>
                          <span className="text-xs text-emerald-600">
                            {post.category?.name ?? "General"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Tags</h3>
                {allTags.length === 0 ? (
                  <p className="text-sm text-gray-400">No tags found.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}