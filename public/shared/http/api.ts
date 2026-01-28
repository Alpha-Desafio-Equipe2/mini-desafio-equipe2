const API_URL = "http://localhost:3000/api";

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
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
      }
      return data as T;
    } catch (error: any) {
      console.error("API Error:", error);
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
  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, "DELETE");
  },
};
