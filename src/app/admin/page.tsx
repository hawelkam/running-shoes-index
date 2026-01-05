import { redirect } from "next/navigation";

import AdminDashboardClient from "@/components/features/admin/AdminDashboardClient";
import {
  getStravaUser,
  getUserFromDatabase,
} from "@/utils/auth/stravaAuthServer";

export default async function AdminPage() {
  try {
    // Get authenticated user
    const stravaUser = await getStravaUser();

    if (!stravaUser) {
      console.log("AdminPage: No Strava user found, redirecting");
      redirect("/");
    }

    // Get user from database to check role
    const dbUser = await getUserFromDatabase(stravaUser.stravaRefreshToken);

    if (!dbUser) {
      console.log("AdminPage: No database user found, redirecting");
      redirect("/");
    }

    if (dbUser.role !== "admin") {
      console.log(
        `AdminPage: User role '${dbUser.role}' is not admin, redirecting`
      );
      redirect("/");
    }

    console.log("AdminPage: Admin access granted");

    return (
      <AdminDashboardClient
        user={{
          id: dbUser.id ?? 0,
          username: dbUser.username,
          role: dbUser.role,
        }}
      />
    );
  } catch (error) {
    console.error("AdminPage error:", error);
    redirect("/");
  }
}
