import { NextResponse } from "next/server";
import {
  getStravaUser,
  getUserFromDatabase,
} from "@/_utils/auth/stravaAuthServer";

export async function GET() {
  try {
    // Get the authenticated user from cookies
    const stravaUser = await getStravaUser();

    if (!stravaUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get the user from database using their access token
    console.log(
      "Fetching user from database with refresh token:",
      stravaUser.stravaRefreshToken
    );
    const dbUser = await getUserFromDatabase(stravaUser.stravaRefreshToken);

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Return user info (excluding sensitive access token)
    const userInfo = {
      id: dbUser.id,
      username: dbUser.username,
      role: dbUser.role,
      created_at: dbUser.created_at,
      updated_at: dbUser.updated_at,
      stravaInfo: {
        id: stravaUser.id,
        firstName: stravaUser.firstName,
        lastName: stravaUser.lastName,
        profilePicture: stravaUser.profilePicture,
      },
    };

    return NextResponse.json({ user: userInfo });
  } catch (error) {
    console.error("Error getting user info:", error);
    return NextResponse.json(
      { error: "Failed to get user info" },
      { status: 500 }
    );
  }
}
