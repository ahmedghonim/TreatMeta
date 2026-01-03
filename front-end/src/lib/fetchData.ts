"use client";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

interface FetchDataOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  lang?: string;
  body?: any;
  cache?: RequestInit["cache"];
  token?: string;
  headers?: Record<string, string>;
  revalidate?: string;
  withOutStringify?: boolean;
  noHadar?: boolean;
  timeout?: number; // Timeout in milliseconds
  next?: {
    revalidate: number;
  };
}

interface ApiResponse<T> {
  data?: T;
  error?: string | Response;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds

export async function fetchData<T>(
  url: string,
  options?: FetchDataOptions
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    cache,
    next,
    revalidate,
    timeout = DEFAULT_TIMEOUT
  } = options || {};

  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  const option: RequestInit = {
    cache,
    next,
    method,
    body: JSON.stringify(body),
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options?.headers || {}),
    },
  };

  const fetchURL = "/api" + url;

  try {
    const res = await fetch(fetchURL, option);
    clearTimeout(timeoutId);

    if (!res.ok) {
      // Try to get error message from response body
      let errorMessage = `Request failed with status ${res.status}`;
      try {
        const errorBody = await res.json();
        errorMessage = errorBody.message || errorBody.error || errorMessage;
      } catch {
        // Response body is not JSON, use status text
        errorMessage = res.statusText || errorMessage;
      }

      if (res.status === 500) {
        throw new Error(`Server Error: ${errorMessage}`);
      } else if (res.status === 404) {
        notFound();
      }

      throw new Error(errorMessage);
    }

    const responseData: ApiResponse<T> = {};

    if (revalidate) {
      revalidatePath(revalidate, "page");
    }

    responseData.data = await res.json();
    return responseData;

  } catch (error: any) {
    clearTimeout(timeoutId);

    // Handle abort/timeout
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    // Handle network errors (no internet, DNS failure, etc.)
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Network error. Please check your connection and try again.");
    }

    // Re-throw if it's already a proper Error
    if (error instanceof Error) {
      throw error;
    }

    // Fallback for unknown error types
    throw new Error("An unexpected error occurred. Please try again.");
  }
}
