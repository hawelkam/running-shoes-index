/**
 * Server-side authentication utilities for Strava
 */

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserRepository, type User } from "@/_utils/database";

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

/**
 * Get user from database by access token
 */
export async function getUserFromDatabase(
  refreshToken: string
): Promise<User | null> {
  try {
    return await UserRepository.getUserByAccessToken(refreshToken);
  } catch (error) {
    console.error("Error getting user from database:", error);
    return null;
  }
}

/**
 * Get user from database by username
 */
export async function getUserByUsername(
  username: string
): Promise<User | null> {
  try {
    return await UserRepository.getUserByUsername(username);
  } catch (error) {
    console.error("Error getting user by username:", error);
    return null;
  }
}
