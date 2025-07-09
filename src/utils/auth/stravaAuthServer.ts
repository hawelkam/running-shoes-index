/**
 * Server-side authentication utilities for Strava
 */

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { UserRepository, type User } from "@/utils/database";

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
    console.log("🍪 getStravaUser: Getting cookie store");
    const cookieStore = await cookies();

    console.log("🔍 getStravaUser: Looking for strava_auth cookie");
    const authCookie = cookieStore.get("strava_auth");

    console.log("🍪 getStravaUser: Cookie check result:", {
      hasCookie: !!authCookie,
      hasValue: !!authCookie?.value,
      cookieValueLength: authCookie?.value?.length ?? 0,
    });

    if (!authCookie?.value) {
      console.log("❌ getStravaUser: No auth cookie found");
      return null;
    }

    console.log("🔑 getStravaUser: Getting JWT secret");
    const jwtSecret = process.env["JWT_SECRET"] ?? "your-jwt-secret-key";
    console.log("🔑 getStravaUser: JWT secret check:", {
      hasJwtSecret: !!process.env["JWT_SECRET"],
      usingDefault: !process.env["JWT_SECRET"],
    });

    console.log("🔓 getStravaUser: Attempting to verify JWT token");
    const decoded = jwt.verify(authCookie.value, jwtSecret) as StravaUser;

    console.log(
      "getStravaUser: JWT verification successful for user:",
      decoded.id
    );
    return decoded;
  } catch (error) {
    console.error("getStravaUser: Error verifying Strava auth token:", error);
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
    console.log(
      "🗄️ getUserFromDatabase: Searching for user with refresh token:",
      {
        refreshTokenLength: refreshToken?.length,
        refreshTokenPrefix: refreshToken?.substring(0, 10),
      }
    );

    const user = await UserRepository.getUserByAccessToken(refreshToken);

    console.log("🗄️ getUserFromDatabase: Database query result:", {
      foundUser: !!user,
      userId: user?.id,
      username: user?.username,
      role: user?.role,
      accessTokenPrefix: user?.accesstoken?.substring(0, 10),
      accessTokenMatches: user?.accesstoken === refreshToken,
    });

    return user;
  } catch (error) {
    console.error(
      "❌ getUserFromDatabase: Error getting user from database:",
      error
    );
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
