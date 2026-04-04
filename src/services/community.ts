// services/community.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL as string;

function authHeaders(token?: string): Record<string, string> {
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function jsonHeaders(token?: string): Record<string, string> {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiCommunity {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category?: { id: number; name: string };
  privacy: "public" | "private";
  status: "pending" | "approved" | "rejected" | "suspended";
  members_count: number;
  posts_count: number;
  tags?: string[];
  guidelines?: string;
  icon?: string;
  image?: string;
  created_at: string;
  creator?: { id: number; name: string };
  is_member?: boolean;
  is_creator?: boolean;
  is_admin?: boolean;
}

export interface ApiPostUser {
  id: number;
  name: string;
  avatar?: string;
  avatar_url?: string; // API returns both avatar and avatar_url
}

export interface ApiPost {
  id: number;
  title?: string;
  content: string;
  tags?: string[];
  images?: string[] | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at?: string;
  status?: string;
  community_id: number;
  user_id?: number;
  // API returns "user" not "author"
  user?: ApiPostUser;
  // Keep "author" as alias for backwards compat with any other code
  author?: ApiPostUser;
  is_liked?: boolean;
  community?: { id: number; name: string };
}

export interface ApiComment {
  id: number;
  content: string;
  created_at: string;
  // Comments may also use "user" instead of "author"
  user?: { id: number; name: string; avatar?: string; avatar_url?: string };
  author?: { id: number; name: string; avatar?: string };
  likes_count: number;
  replies_count: number;
  replies?: ApiComment[];
  is_liked?: boolean;
  parent_id?: number | null;
}

export interface ApiMember {
  id: number;
  name: string;
  email?: string;
  role: "Admin" | "Moderator" | "Member";
  joined_at: string;
  avatar?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ─── Helper ───────────────────────────────────────────────────────────────────
async function handleResponse(res: Response): Promise<unknown> {
  if (!res.ok) {
    let errorData: unknown = {};
    try { errorData = await res.json(); } catch {
      errorData = { message: res.statusText || `HTTP Error ${res.status}` };
    }
    const error = new Error(`HTTP ${res.status}`) as Error & {
      response: { status: number; data: unknown };
    };
    error.response = { status: res.status, data: errorData };
    throw error;
  }
  return res.json();
}

// ─── Communities ──────────────────────────────────────────────────────────────

export async function getAllCommunities(params?: {
  category_id?: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}): Promise<unknown> {
  const qs = new URLSearchParams();
  if (params?.category_id) qs.set("category_id", params.category_id);
  if (params?.search)      qs.set("search",      params.search);
  if (params?.sort_by)     qs.set("sort_by",     params.sort_by);
  if (params?.sort_order)  qs.set("sort_order",  params.sort_order);
  if (params?.per_page)    qs.set("per_page",    String(params.per_page));
  if (params?.page)        qs.set("page",        String(params.page ?? 1));

  const res = await fetch(`${API_BASE}/communities?${qs}`, {
    headers: { Accept: "application/json" },
  });
  return handleResponse(res);
}

export async function getCommunityById(
  id: number | string,
  params?: { include_posts?: boolean; sort_posts?: string; posts_per_page?: number },
  token?: string
): Promise<ApiCommunity> {
  const qs = new URLSearchParams();
  if (params?.include_posts)  qs.set("include_posts",  "true");
  if (params?.sort_posts)     qs.set("sort_posts",     params.sort_posts);
  if (params?.posts_per_page) qs.set("posts_per_page", String(params.posts_per_page));

  const res = await fetch(`${API_BASE}/communities/${id}?${qs}`, {
    headers: authHeaders(token),
  });
  const json = await handleResponse(res) as { data?: ApiCommunity } | ApiCommunity;
  return (json as { data?: ApiCommunity }).data ?? (json as ApiCommunity);
}

export async function createCommunity(formData: FormData, token: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/communities`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
  const json = await handleResponse(res) as { data?: unknown };
  return json.data ?? json;
}

export async function updateCommunity(
  id: number | string,
  formData: FormData,
  token: string
): Promise<unknown> {
  const res = await fetch(`${API_BASE}/communities/${id}`, {
    method: "PUT",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
  const json = await handleResponse(res) as { data?: unknown };
  return json.data ?? json;
}

export async function deleteCommunity(id: number | string, token: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/communities/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function joinCommunity(id: number | string, token: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/communities/${id}/join`, {
    method: "POST",
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function leaveCommunity(id: number | string, token: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/communities/${id}/leave`, {
    method: "POST",
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function getCommunityMembers(
  id: number | string,
  token: string,
  per_page = 20
): Promise<unknown> {
  const res = await fetch(`${API_BASE}/communities/${id}/members?per_page=${per_page}`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getCommunityPosts(
  communityId: number | string,
  params?: { sort_by?: string; per_page?: number; page?: number }
): Promise<unknown> {
  const qs = new URLSearchParams();
  if (params?.sort_by)  qs.set("sort_by",  params.sort_by);
  if (params?.per_page) qs.set("per_page", String(params.per_page ?? 15));
  if (params?.page)     qs.set("page",     String(params.page ?? 1));

  const res = await fetch(`${API_BASE}/communities/${communityId}/posts?${qs}`, {
    headers: { Accept: "application/json" },
  });
  return handleResponse(res);
}

export async function createPost(
  communityId: number | string,
  formData: FormData,
  token: string
): Promise<ApiPost> {
  const res = await fetch(`${API_BASE}/communities/${communityId}/posts`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: formData,
  });
  const json = await handleResponse(res) as { data?: ApiPost } | ApiPost;
  return (json as { data?: ApiPost }).data ?? (json as ApiPost);
}

export async function updatePost(
  communityId: number | string,
  postId: number | string,
  body: { content?: string; title?: string; tags?: string[] },
  token: string
): Promise<ApiPost> {
  const res = await fetch(`${API_BASE}/communities/${communityId}/posts/${postId}`, {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify(body),
  });
  const json = await handleResponse(res) as { data?: ApiPost } | ApiPost;
  return (json as { data?: ApiPost }).data ?? (json as ApiPost);
}

export async function deletePost(
  communityId: number | string,
  postId: number | string,
  token: string
): Promise<unknown> {
  const res = await fetch(`${API_BASE}/communities/${communityId}/posts/${postId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function likePost(
  communityId: number | string,
  postId: number | string,
  token: string
): Promise<unknown> {
  const res = await fetch(`${API_BASE}/communities/${communityId}/posts/${postId}/like`, {
    method: "POST",
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export async function getPostComments(
  communityId: number | string,
  postId: number | string,
  per_page = 20
): Promise<unknown> {
  const res = await fetch(
    `${API_BASE}/communities/${communityId}/posts/${postId}/comments?per_page=${per_page}`,
    { headers: { Accept: "application/json" } }
  );
  return handleResponse(res);
}

export async function createComment(
  communityId: number | string,
  postId: number | string,
  body: { content: string; parent_id?: number | null },
  token: string
): Promise<ApiComment> {
  const res = await fetch(
    `${API_BASE}/communities/${communityId}/posts/${postId}/comments`,
    { method: "POST", headers: jsonHeaders(token), body: JSON.stringify(body) }
  );
  const json = await handleResponse(res) as { data?: ApiComment } | ApiComment;
  return (json as { data?: ApiComment }).data ?? (json as ApiComment);
}

export async function replyToComment(
  communityId: number | string,
  postId: number | string,
  commentId: number | string,
  body: { content: string },
  token: string
): Promise<ApiComment> {
  const res = await fetch(
    `${API_BASE}/communities/${communityId}/posts/${postId}/comments/${commentId}/reply`,
    { method: "POST", headers: jsonHeaders(token), body: JSON.stringify(body) }
  );
  const json = await handleResponse(res) as { data?: ApiComment } | ApiComment;
  return (json as { data?: ApiComment }).data ?? (json as ApiComment);
}

export async function deleteComment(
  communityId: number | string,
  postId: number | string,
  commentId: number | string,
  token: string
): Promise<unknown> {
  const res = await fetch(
    `${API_BASE}/communities/${communityId}/posts/${postId}/comments/${commentId}`,
    { method: "DELETE", headers: authHeaders(token) }
  );
  return handleResponse(res);
}

export async function likeComment(
  communityId: number | string,
  postId: number | string,
  commentId: number | string,
  token: string
): Promise<unknown> {
  const res = await fetch(
    `${API_BASE}/communities/${communityId}/posts/${postId}/comments/${commentId}/like`,
    { method: "POST", headers: authHeaders(token) }
  );
  return handleResponse(res);
}