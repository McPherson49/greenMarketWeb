// lib/api/blogs.ts

import ApiFetcher from "@/utils/apis"; // ← your axios instance
import { Blog, PaginatedBlogs, normaliseTags } from "@/types/blog";

// ─────────────────────────────────────────────────────────────
// Your API returns:
// { success, data: { current_page, data: [...blogs], last_page, ... } }
// ─────────────────────────────────────────────────────────────
interface RawApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Blog[];
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    first_page_url: string | null;
    last_page_url: string | null;
  };
}

function normalise(raw: RawApiResponse): PaginatedBlogs {
  return {
    data: raw.data.data,
    meta: {
      current_page: raw.data.current_page,
      last_page:    raw.data.last_page,
      per_page:     raw.data.per_page,
      total:        raw.data.total,
    },
    links: {
      first: raw.data.first_page_url,
      last:  raw.data.last_page_url,
      next:  raw.data.next_page_url,
      prev:  raw.data.prev_page_url,
    },
  };
}

// GET /blogs  — all blogs (paginated)
export async function getBlogs(params?: {
  page?: number;
  search?: string;
  tag?: string;
}): Promise<PaginatedBlogs> {
  const { data } = await ApiFetcher.get<RawApiResponse>("/blogs", { params });
  return normalise(data);
}

// GET /blogs  — public listing (token attached automatically if logged in)
// Falls back gracefully — once backend makes this public, works for everyone
export async function getPublishedBlogs(page = 1): Promise<PaginatedBlogs> {
  const { data } = await ApiFetcher.get<RawApiResponse>("/blogs/", {
    params: { page },
  });
  return normalise(data);
}

// GET /blogs/:id  — single blog post
export async function getBlog(id: string | number): Promise<Blog> {
  const { data } = await ApiFetcher.get<{ success: boolean; data: Blog }>(
    `/blogs/${id}`
  );
  return data.data;
}