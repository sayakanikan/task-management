import api from "@/lib/axios";
import { ApiResponse } from "@/types/api-response";
import Cookies from "js-cookie";

interface RegisterResponse {
  user: User
}

interface LoginResponse {
  token: string;
  token_type: string;
  expires_in: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export const AuthService = {
  async register(name: string, username: string, email: string, password: string) {
    const res = await api.post<ApiResponse<RegisterResponse>>("/auth/register", { name, username, email, password });
    const { user } = res.data.data;

    return user;
  },
  
  async login(email: string, password: string) {
    const res = await api.post<ApiResponse<LoginResponse>>("/auth/login", { email, password });
    const { token, expires_in } = res.data.data;

    Cookies.set("token", token, {
      expires: expires_in / 86400, // detik → hari
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return res.data;
  },

  async me(): Promise<ApiResponse<User>> {
    const res = await api.get("/auth/me");
    return res.data;
  },

  async logout() {
    Cookies.remove("token");
  },

  isAuthenticated(): boolean {
    return !!Cookies.get("token");
  },
};