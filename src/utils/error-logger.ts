/* eslint-disable no-console */
export interface ErrorContext {
  userId?: string;
  page?: string;
  component?: string;
  userAgent?: string;
  timestamp?: string;
  url?: string;
  [key: string]: unknown;
}

export function logError(error: Error, context?: ErrorContext): void {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : undefined,
    ...context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.group("🚨 Error Logged");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.log("Context:", context);
    console.groupEnd();
  }

  // In production, send to error monitoring service
  if (process.env.NODE_ENV === "production") {
    // TODO: Integrate with error monitoring service
    // Examples:
    // - Sentry.captureException(error, { extra: errorInfo });
    // - LogRocket.captureException(error);
    // - Custom error endpoint: fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorInfo) });

    // For now, still log to console as fallback
    console.error("Error logged:", errorInfo);
  }
}

export function logApiError(
  error: Error,
  endpoint: string,
  method: string = "GET",
  statusCode?: number
): void {
  logError(error, {
    type: "api_error",
    endpoint,
    method,
    statusCode,
    component: "api_client",
  });
}

export function logComponentError(
  error: Error,
  componentName: string,
  props?: Record<string, unknown>
): void {
  logError(error, {
    type: "component_error",
    component: componentName,
    props,
  });
}
