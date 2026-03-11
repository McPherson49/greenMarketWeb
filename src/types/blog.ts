// ============================================================
// TYPES/blog.ts
// ============================================================

export interface BlogCategory {
  id: number;
  name: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
  avatar: string | null;
}

export interface Blog {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  category_id: number | null;
  author_id: number;
  status: "published" | "draft";
  section_title: string | null;
  subtitle: string | null;
  section_description: string | null;
  created_at: string;
  updated_at: string;

  // Nested relations
  category: BlogCategory | null;
  author: BlogAuthor;

  // Only on single GET /blogs/:id
  content?: string;

  // API returns either a comma string "a,b,c" OR an array ["a","b","c"]
  // Use the helper below to always get string[]
  tags?: string | string[];
}

// ─── Helper: always returns string[] regardless of API format ─
export function normaliseTags(tags: string | string[] | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean);
  return tags.split(',').map((t) => t.trim()).filter(Boolean);
}

export interface PaginatedBlogs {
  data: Blog[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string | null;
    last: string | null;
    next: string | null;
    prev: string | null;
  };
}

export interface SingleBlogResponse {
  success: boolean;
  data: Blog;
}