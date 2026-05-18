/**
 * Enterprise Standard API Response format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: {
    requestId?: string;
    pagination?: {
      cursor?: string;
      hasNextPage: boolean;
      totalCount?: number;
    };
    [key: string]: any;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

import { NextResponse } from "next/server";
import { AppError } from "./errors";
import { ZodError } from "zod";

export function successResponse<T>(data: T, meta?: ApiResponse<T>["meta"], status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      meta,
    },
    { status }
  );
}

export function errorResponse(error: unknown, requestId?: string) {
  console.error(`[API Error] RequestID: ${requestId}`, error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        meta: { requestId },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request payload",
          details: (error as any).issues || (error as any).errors,
        },
        meta: { requestId },
      },
      { status: 400 }
    );
  }

  // Fallback for unhandled errors
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
      meta: { requestId },
    },
    { status: 500 }
  );
}
