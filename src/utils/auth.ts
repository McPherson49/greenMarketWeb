const TOKEN_KEY = "jwt";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// Save token to sessionStorage
export function loginAuth(token: string) {
  if (!isBrowser()) return;
  sessionStorage.setItem(TOKEN_KEY, token);
}

// Remove token from sessionStorage
export function logoutAuth() {
  if (!isBrowser()) return;
  sessionStorage.removeItem(TOKEN_KEY);
}

// Get token from sessionStorage — returns null on server
export function getAuthToken(): string | null {
  if (!isBrowser()) return null;
  return sessionStorage.getItem(TOKEN_KEY);
}