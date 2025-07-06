import {
  getStravaUser,
  getUserFromDatabase,
} from "@/_utils/auth/stravaAuthServer";
import AuthDemoClient from "./_components/AuthDemoClient";

export default async function AuthDemo() {
  const user = await getStravaUser();
  let dbUser = null;

  // Try to get user from database if authenticated
  if (user?.stravaRefreshToken) {
    try {
      dbUser = await getUserFromDatabase(user.stravaRefreshToken);
    } catch (error) {
      console.error("Error fetching user from database:", error);
    }
  }

  return <AuthDemoClient user={user} initialDbUser={dbUser} />;
}
