/**
 * Client-side authentication utilities for Strava
 */

export interface StravaUserInfo {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

/**
 * Get the Strava user info from cookies (client-side only)
 */
export function getStravaUserInfo(): StravaUserInfo | null {
  try {
    // This function is for client-side usage only
    if (typeof document === "undefined") {
      return null;
    }

    const cookies = document.cookie.split(";");
    const userCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("strava_user=")
    );

    if (!userCookie) {
      return null;
    }

    const userValue = userCookie.split("=")[1];
    if (!userValue) {
      return null;
    }
    const decoded = decodeURIComponent(userValue);

    return JSON.parse(decoded) as StravaUserInfo;
  } catch (error) {
    console.error("Error parsing Strava user info:", error);
    return null;
  }
}

/**
 * Clear Strava authentication cookies (client-side)
 */
export function clearStravaAuth() {
  if (typeof document !== "undefined") {
    document.cookie =
      "strava_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "strava_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}

/**
 * Check if user is authenticated (client-side)
 */
export function isAuthenticated(): boolean {
  return getStravaUserInfo() !== null;
}
