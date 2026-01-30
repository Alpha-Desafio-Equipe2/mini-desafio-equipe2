import { api } from "../../../shared/http/api.js";
import { AuthResponse, User } from "../../../shared/types.js";

export class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });

      // Salvar token e user
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  static async register(data: any): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", data);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login.html"; // Adjust path as needed
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }
}
