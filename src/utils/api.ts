import { logApiError } from "./error-logger";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}

export async function handleApiResponse<T>(
  response: Response,
  endpoint?: string
): Promise<T> {
  if (!response.ok) {
    let errorData: { message?: string; code?: string; error?: string } = {};

    try {
      errorData = (await response.json()) as {
        message?: string;
        code?: string;
        error?: string;
      };
    } catch {
      // If JSON parsing fails, use status text
      errorData = { message: response.statusText };
    }

    const errorMessage =
      errorData.message ?? errorData.error ?? `HTTP ${response.status}`;
    const apiError = new ApiError(
      errorMessage,
      response.status,
      errorData.code,
      errorData
    );

    // Log the API error
    if (endpoint) {
      logApiError(apiError, endpoint, "unknown", response.status);
    }

    throw apiError;
  }

  try {
    return (await response.json()) as T;
  } catch {
    const parseError = new ApiError(
      "Failed to parse response JSON",
      response.status,
      "PARSE_ERROR"
    );

    if (endpoint) {
      logApiError(parseError, endpoint);
    }

    throw parseError;
  }
}

export async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    return await handleApiResponse<T>(response, url);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    const networkError = new ApiError(
      error instanceof Error ? error.message : "Network error occurred",
      0,
      "NETWORK_ERROR"
    );

    logApiError(networkError, url, options?.method ?? "GET");
    throw networkError;
  }
}

// Convenience methods
export const api = {
  get: <T>(url: string) => apiCall<T>(url, { method: "GET" }),
  post: <T>(url: string, data?: unknown) => {
    const options: RequestInit = { method: "POST" };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return apiCall<T>(url, options);
  },
  put: <T>(url: string, data?: unknown) => {
    const options: RequestInit = { method: "PUT" };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return apiCall<T>(url, options);
  },
  patch: <T>(url: string, data?: unknown) => {
    const options: RequestInit = { method: "PATCH" };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return apiCall<T>(url, options);
  },
  delete: <T>(url: string) => apiCall<T>(url, { method: "DELETE" }),
};
