import { NextRequest, NextResponse } from "next/server";
import {
  getStravaUser,
  getUserFromDatabase,
} from "@/utils/auth/stravaAuthServer";
import { UserRepository } from "@/utils/database";

export async function PATCH(request: NextRequest) {
  try {
    // Get authenticated user
    const stravaUser = await getStravaUser();

    if (!stravaUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user from database
    const dbUser = await getUserFromDatabase(stravaUser.stravaRefreshToken);

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const { role } = await request.json();

    if (!role || !["user", "admin", "moderator"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'user', 'admin', or 'moderator'" },
        { status: 400 }
      );
    }

    // Only allow self-promotion to admin for now (for testing purposes)
    // In production, this should require admin privileges
    if (role === "admin" && dbUser.username) {
      const updatedUser = await UserRepository.updateUserRole(
        dbUser.username,
        role
      );

      return NextResponse.json({
        success: true,
        message: `Role updated to ${role}`,
        user: updatedUser,
      });
    }

    return NextResponse.json(
      { error: "Unauthorized to update role" },
      { status: 403 }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
