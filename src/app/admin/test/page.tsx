import { redirect } from "next/navigation";

import {
  getStravaUser,
  getUserFromDatabase,
} from "@/utils/auth/stravaAuthServer";

export default async function AdminTestPage() {
  try {
    console.log("AdminTest: Starting test");

    // Get authenticated user
    const stravaUser = await getStravaUser();
    console.log("AdminTest: StravaUser result:", !!stravaUser);

    if (!stravaUser) {
      console.log("AdminTest: No Strava user, redirecting");
      redirect("/");
    }

    // Get user from database to check role
    const dbUser = await getUserFromDatabase(stravaUser.stravaRefreshToken);
    console.log("AdminTest: DbUser result:", !!dbUser, dbUser?.role);

    if (!dbUser) {
      console.log("AdminTest: No database user, redirecting");
      redirect("/");
    }

    if (dbUser.role !== "admin") {
      console.log("AdminTest: Not admin role, redirecting");
      redirect("/");
    }

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Admin Test Page</h1>
        <p>Welcome, {dbUser.username}!</p>
        <p>User ID: {dbUser.id}</p>
        <p>Role: {dbUser.role}</p>
      </div>
    );
  } catch (error) {
    console.error("AdminTest error:", error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>Authentication failed</p>
      </div>
    );
  }
}
