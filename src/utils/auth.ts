const TOKEN_KEY = "jwt";

// Save token to localStorage
export function loginAuth(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Remove token from localStorage
export function logoutAuth() {
  localStorage.removeItem(TOKEN_KEY);
}

// Get token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
