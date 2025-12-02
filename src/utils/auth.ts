const TOKEN_KEY = "jwt";

// Save token to localStorage
export function loginAuth(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

// Remove token from localStorage
export function logoutAuth() {
  sessionStorage.removeItem(TOKEN_KEY);
}

// Get token from localStorage
export function getAuthToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}
