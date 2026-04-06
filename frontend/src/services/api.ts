const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    try {
      const stored = localStorage.getItem('musify-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.state?.accessToken || null;
      }
    } catch {
      // ignore
    }
    return null;
  }

  private getRefreshToken(): string | null {
    try {
      const stored = localStorage.getItem('musify-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.state?.refreshToken || null;
      }
    } catch {
      // ignore
    }
    return null;
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const token = this.getToken();
    const reqHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers: reqHeaders,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    // If 401, try to refresh the token
    if (response.status === 401 && token) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        reqHeaders['Authorization'] = `Bearer ${refreshed}`;
        const retryResponse = await fetch(`${this.baseUrl}${endpoint}`, {
          ...config,
          headers: reqHeaders,
        });
        if (!retryResponse.ok) {
          const error = await retryResponse.json().catch(() => ({}));
          throw new ApiError(retryResponse.status, error.error || 'Request failed');
        }
        return retryResponse.json();
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, error.error || 'Request failed');
    }

    return response.json();
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return null;

      const data = await response.json();

      // Update stored tokens
      const stored = localStorage.getItem('musify-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.state.accessToken = data.accessToken;
        parsed.state.refreshToken = data.refreshToken;
        localStorage.setItem('musify-auth', JSON.stringify(parsed));
      }

      return data.accessToken;
    } catch {
      return null;
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const api = new ApiClient(API_BASE);
