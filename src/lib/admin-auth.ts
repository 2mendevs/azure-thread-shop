// Hardcoded admin credentials per spec.
// NOTE: This is intentionally not real auth — admin actions are gated on the
// server by re-validating these same credentials inside server functions.
export const ADMIN_EMAIL = "2mendevsadmin@gmail.com";
export const ADMIN_PASSWORD = "Admin@1234";

const KEY = "2mendevs.admin";

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}

export function loginAdmin(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(KEY, "1");
    window.dispatchEvent(new Event("admin-auth-change"));
    return true;
  }
  return false;
}

export function logoutAdmin() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("admin-auth-change"));
}
