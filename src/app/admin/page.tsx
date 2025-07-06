import {
  getStravaUser,
  getUserFromDatabase,
} from "@/_utils/auth/stravaAuthServer";
import { redirect } from "next/navigation";
import AdminClient from "./_components/AdminClient";

export default async function AdminPage() {
  // Get authenticated user
  const stravaUser = await getStravaUser();

  if (!stravaUser) {
    redirect("/");
  }

  // Get user from database to check role
  const dbUser = await getUserFromDatabase(stravaUser.stravaRefreshToken);

  if (!dbUser || dbUser.role !== "admin") {
    redirect("/");
  }

  return <AdminClient user={dbUser} />;
}
