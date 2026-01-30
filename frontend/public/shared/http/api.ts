const API_URL = "http://localhost:3000/farma-project";

interface RequestConfig extends RequestInit {
  headers?: HeadersInit;
}

export const api = {
  async request<T>(
    endpoint: string,
    method = "GET",
    body: any = null,
  ): Promise<T> {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestConfig = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      console.log(`[API] Requesting: ${API_URL}${endpoint}`); // Debug Log
      const response = await fetch(`${API_URL}${endpoint}`, config);

      // Handle 401 Unauthorized
      if (response.status === 401 && !endpoint.includes("/auth/login")) {
        console.warn("[API] 401 Unauthorized - Clearing tokens");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (window.location.pathname !== "/login.html") {
          if (window.navigate) {
            window.navigate("/login");
          } else {
            window.location.href = "/login.html";
          }
        }
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Erro na requisição API",
          );
        }
        return data as T;
      } else {
        // Received HTML or text?
        const text = await response.text();
        console.error(
          "API Error: Received non-JSON response",
          text.substring(0, 500),
        );
        throw new Error(
          `Erro de comunicação com o servidor (${response.status} ${response.statusText}). Verifique o backend.`,
        );
      }
    } catch (error: any) {
      console.error("API Error detailed:", error);
      throw error;
    }
  },

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, "GET");
  },
  post<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, "POST", body);
  },
  put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, "PUT", body);
  },
  patch<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, "PATCH", body);
  },
  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, "DELETE");
  },
};
