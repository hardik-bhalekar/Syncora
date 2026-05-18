/**
 * Enterprise Frontend SDK - Core Client
 * Handles tenant propagation, auth, retries, and standard error parsing.
 */

import { getSession } from "next-auth/react";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  retries?: number;
}

export class ApiClient {
  private static async getHeaders(): Promise<Headers> {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    // In a browser context, next-auth handles cookies automatically.
    // We explicitly extract tenantId if needed for x-tenant-id headers,
    // though the backend middleware also extracts it from the JWT.
    const session = await getSession();
    if ((session?.user as any)?.tenantId) {
      headers.set("x-tenant-id", (session!.user as any).tenantId);
    }
    
    // Add tracing headers for OpenTelemetry/Sentry correlation
    headers.set("x-request-id", crypto.randomUUID());

    return headers;
  }

  static async fetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
    const { retries = 2, ...fetchOptions } = options;
    const headers = await this.getHeaders();
    
    let attempt = 0;
    while (attempt <= retries) {
      try {
        const response = await fetch(`/api${url}`, {
          ...fetchOptions,
          headers: new Headers({
            ...Object.fromEntries(headers.entries()),
            ...Object.fromEntries(new Headers(fetchOptions.headers || {}).entries())
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new ApiError(
            response.status,
            data?.error?.code || "UNKNOWN_ERROR",
            data?.error?.message || "An unknown API error occurred",
            data?.error?.details
          );
        }

        // Standard backend response is { success, data, meta, error }
        return data.data as T;
      } catch (error) {
        if (error instanceof ApiError && error.status < 500) {
          throw error; // Don't retry client errors (4xx)
        }
        if (attempt === retries) throw error;
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempt)));
        attempt++;
      }
    }
    throw new Error("Unreachable");
  }

  static get<T>(url: string, options?: FetchOptions) {
    return this.fetch<T>(url, { ...options, method: "GET" });
  }

  static post<T>(url: string, body: any, options?: FetchOptions) {
    return this.fetch<T>(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  static put<T>(url: string, body: any, options?: FetchOptions) {
    return this.fetch<T>(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  static delete<T>(url: string, options?: FetchOptions) {
    return this.fetch<T>(url, { ...options, method: "DELETE" });
  }
}
