import { redirect } from "next/navigation";

import AdminClient from "@/components/features/admin/AdminClient";
import {
  getStravaUser,
  getUserFromDatabase,
} from "@/utils/auth/stravaAuthServer";

export default async function AdminPage() {
  console.log("🚀 AdminPage: Starting admin page access check");

  // Get authenticated user
  console.log("🔍 AdminPage: Attempting to get Strava user from cookies");
  const stravaUser = await getStravaUser();

  console.log("👤 AdminPage: Strava user result:", {
    hasUser: !!stravaUser,
    userId: stravaUser?.id,
    firstName: stravaUser?.firstName,
    lastName: stravaUser?.lastName,
    hasAccessToken: !!stravaUser?.stravaAccessToken,
    hasRefreshToken: !!stravaUser?.stravaRefreshToken,
    expiresAt: stravaUser?.stravaExpiresAt,
    isExpired: stravaUser
      ? Date.now() > stravaUser.stravaExpiresAt * 1000
      : null,
  });

  if (!stravaUser) {
    console.log("❌ AdminPage: No Strava user found, redirecting to /");
    redirect("/");
  }

  // Get user from database to check role
  console.log(
    "🔍 AdminPage: Attempting to get user from database using refresh token:",
    stravaUser.stravaRefreshToken
  );
  const dbUser = await getUserFromDatabase(stravaUser.stravaRefreshToken);

  console.log("🗄️ AdminPage: Database user result:", {
    hasDbUser: !!dbUser,
    userId: dbUser?.id,
    username: dbUser?.username,
    role: dbUser?.role,
    accesstoken: dbUser?.accesstoken
      ? `${dbUser.accesstoken.substring(0, 10)}...`
      : null,
    created_at: dbUser?.created_at,
    updated_at: dbUser?.updated_at,
  });

  if (!dbUser) {
    console.log("❌ AdminPage: No database user found, redirecting to /");
    redirect("/");
  }

  if (dbUser.role !== "admin") {
    console.log(
      `❌ AdminPage: User role '${dbUser.role}' is not admin, redirecting to /`
    );
    redirect("/");
  }

  console.log("✅ AdminPage: Admin access granted, rendering AdminClient");
  return <AdminClient user={dbUser} />;
}
