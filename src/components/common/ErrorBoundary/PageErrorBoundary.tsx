import React, { ReactNode } from "react";
import Link from "next/link";

import { ErrorBoundary } from "./ErrorBoundary";

interface PageErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function PageErrorBoundary({
  children,
  fallback,
}: PageErrorBoundaryProps) {
  const defaultFallback = (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-red-600 mb-4">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Error</h1>
        <p className="text-gray-600 mb-6">
          This page encountered an error. Please try refreshing or go back to
          the homepage.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
          <Link
            href="/"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback ?? defaultFallback}>
      {children}
    </ErrorBoundary>
  );
}
