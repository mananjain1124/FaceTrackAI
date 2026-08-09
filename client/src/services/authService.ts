import api from "./api";

export async function signup(email: string, password: string) {
  const response = await api.post("/api/auth/signup", {
    email,
    password,
  });
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });

  if (response.data.success && response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("admin", JSON.stringify(response.data.admin));
  }

  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  window.location.href = "/login";
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function getAdminUser() {
  const user = localStorage.getItem("admin");
  return user ? JSON.parse(user) : null;
}
