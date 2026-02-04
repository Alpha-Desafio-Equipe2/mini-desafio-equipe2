const API_URL = "/server07/api";

interface RequestConfig extends RequestInit {
  headers?: HeadersInit;
}

export const api = {
  async request<T>(
    endpoint: string,
    method = "GET",
    body: any = null,
  ): Promise<T> {
    let token = localStorage.getItem("token");
    
    // Fallback/Primary: Try reading from cookie
    if (!token) {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        if (match) token = match[2];
    }
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

      const response = await fetch(`${API_URL}${endpoint}`, config);

      // Handle 401 Unauthorized
      if (response.status === 401 && !endpoint.includes("/auth/login")) {
        console.warn("[API] 401 Unauthorized - Clearing tokens");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (window.location.pathname !== "/server07/login") {
          if (window.navigate) {
            window.navigate("/server07/login");
          } else {
            window.location.href = "/server07/login";
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
