import { redirect } from "next/navigation";

// import AdminClient from "@/components/features/admin/AdminClient";
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

    // Temporarily return a simple div instead of AdminClient to test
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p>Welcome, {dbUser.username}!</p>
        <p>Role: {dbUser.role}</p>
        <p>User ID: {dbUser.id}</p>
      </div>
    );

    // return <AdminClient user={dbUser} />;
  } catch (error) {
    console.error("AdminPage error:", error);
    redirect("/");
  }
}
