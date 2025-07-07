/**
 * Application-wide constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env["NEXT_PUBLIC_API_URL"] ?? "",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Please try again.",
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION: "Please check your input and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: "Changes saved successfully.",
  CREATED: "Created successfully.",
  UPDATED: "Updated successfully.",
  DELETED: "Deleted successfully.",
} as const;

// Route paths
export const ROUTES = {
  HOME: "/",
  SHOES: "/shoes",
  BRANDS: "/brands",
  REVIEWS: "/reviews",
  PROFILE: "/profile",
  ADMIN: "/admin",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
} as const;

// Shoe categories
export const SHOE_CATEGORIES = {
  ROAD: "road",
  TRAIL: "trail",
  TRACK: "track",
  GRAVEL: "gravel",
  GYM_TREADMILL: "gym-treadmill",
} as const;

// Validation constraints
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 255,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  SHOE_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  REVIEW_CONTENT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 5000,
  },
} as const;

// Environment
export const ENV = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

export type ShoeCategory =
  (typeof SHOE_CATEGORIES)[keyof typeof SHOE_CATEGORIES];
export type RouteKey = keyof typeof ROUTES;
