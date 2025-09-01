import { apiRequest } from "./queryClient";

export interface LoginResponse {
  sessionId: string;
  user: {
    id: string;
    email: string;
    role: string;
    clientSlug?: string;
    name: string;
  };
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await apiRequest("POST", "/api/auth/login", { email, password });
    return res.json();
  },

  async register(userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
    clientSlug?: string;
  }): Promise<LoginResponse> {
    const res = await apiRequest("POST", "/api/auth/register", userData);
    return res.json();
  },

  async logout(): Promise<void> {
    await apiRequest("POST", "/api/auth/logout");
  },

  async me(): Promise<LoginResponse["user"]> {
    const res = await apiRequest("GET", "/api/user/me");
    return res.json();
  },
};
