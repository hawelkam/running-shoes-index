/**
 * Server-side authentication utilities for Strava
 */

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface StravaUser {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  stravaAccessToken: string;
  stravaRefreshToken: string;
  stravaExpiresAt: number;
}

/**
 * Get the authenticated Strava user from cookies (server-side only)
 */
export async function getStravaUser(): Promise<StravaUser | null> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("strava_auth");

    if (!authCookie?.value) {
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET || "your-jwt-secret-key";
    const decoded = jwt.verify(authCookie.value, jwtSecret) as StravaUser;

    return decoded;
  } catch (error) {
    console.error("Error verifying Strava auth token:", error);
    return null;
  }
}
