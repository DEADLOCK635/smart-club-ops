// Mock authentication for the Organizer Dashboard (demo only — no real backend).
export const ADMIN_COOKIE = "sc_admin_session";
export const ADMIN_TOKEN = "smart-club-demo-session";

export const DEMO_ADMIN = {
  email: "admin@smartclub.dev",
  password: "admin123",
  name: "Organizer Admin",
};

export function loginAdmin(email: string, password: string): boolean {
  const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password;
  if (ok) {
    document.cookie = `${ADMIN_COOKIE}=${ADMIN_TOKEN}; path=/; max-age=${60 * 60 * 8}; samesite=lax`;
  }
  return ok;
}

export function logoutAdmin() {
  document.cookie = `${ADMIN_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
