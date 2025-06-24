// Cache duration constants for consistent revalidation across the app
export const CACHE_DURATIONS = {
  // Short cache for frequently changing data (30 seconds)
  SHORT: 30,

  // Medium cache for moderately changing data (1 minute)
  MEDIUM: 60,

  // Long cache for rarely changing data (5 minutes)
  LONG: 300,

  // Very long cache for stable data (1 hour)
  VERY_LONG: 3600,
} as const;

// Common revalidation options
export const CACHE_OPTIONS = {
  SHORT: { next: { revalidate: CACHE_DURATIONS.SHORT } },
  MEDIUM: { next: { revalidate: CACHE_DURATIONS.MEDIUM } },
  LONG: { next: { revalidate: CACHE_DURATIONS.LONG } },
  VERY_LONG: { next: { revalidate: CACHE_DURATIONS.VERY_LONG } },
} as const;
