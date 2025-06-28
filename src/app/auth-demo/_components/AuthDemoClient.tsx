"use client";

import { useState } from "react";
import AuthStatus from "@/_components/AuthStatus";
import type { User } from "@/_utils/database";

interface StravaUser {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  stravaAccessToken: string;
  stravaRefreshToken: string;
  stravaExpiresAt: number;
}

interface AuthDemoClientProps {
  user: StravaUser | null;
  initialDbUser: User | null;
}

export default function AuthDemoClient({
  user,
  initialDbUser,
}: AuthDemoClientProps) {
  const [dbUser, setDbUser] = useState<User | null>(initialDbUser);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const initializeDatabase = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/db/init", { method: "POST" });
      const result = await response.json();

      if (result.success) {
        setMessage("✅ Database tables initialized successfully!");
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshDbUser = async () => {
    if (!user?.stravaAccessToken) {
      setMessage("❌ No access token available");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/info");
      if (response.ok) {
        const userData = await response.json();
        setDbUser(userData.user);
        setMessage("✅ Database user data refreshed!");
      } else {
        setMessage("❌ Failed to fetch user data from database");
      }
    } catch (error) {
      setMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Strava Authentication Demo</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Client-side Auth Status:</h2>
        <AuthStatus />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Server-side User Data:</h2>
        {user ? (
          <div className="bg-gray-100 p-4 rounded">
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Access Token:</strong>{" "}
              {user.stravaAccessToken ? "✓ Present" : "✗ Missing"}
            </p>
            <p>
              <strong>Token Expires:</strong>{" "}
              {new Date(user.stravaExpiresAt * 1000).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">No user logged in (server-side check)</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Database User Data:</h2>
        {dbUser ? (
          <div className="bg-blue-100 p-4 rounded">
            <p>
              <strong>Database ID:</strong> {dbUser.id}
            </p>
            <p>
              <strong>Username:</strong> {dbUser.username}
            </p>
            <p>
              <strong>Role:</strong> {dbUser.role}
            </p>
            <p>
              <strong>Access Token:</strong>{" "}
              {dbUser.accesstoken ? "✓ Stored" : "✗ Missing"}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {dbUser.created_at
                ? new Date(dbUser.created_at).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Updated:</strong>{" "}
              {dbUser.updated_at
                ? new Date(dbUser.updated_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">No user found in database</p>
        )}

        <div className="mt-4">
          <button
            onClick={refreshDbUser}
            disabled={loading || !user?.stravaAccessToken}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Refresh Database User"}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Database Management:</h2>
        <div className="space-y-2">
          <button
            onClick={initializeDatabase}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Initialize Database Tables"}
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded bg-gray-50 border">{message}</div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">
          How to use in your components:
        </h2>
        <div className="bg-gray-100 p-4 rounded font-mono text-sm">
          <p className="mb-2">{`// Client component:`}</p>
          <p className="mb-2">{`import AuthStatus from "@/components/AuthStatus";`}</p>
          <p className="mb-4">{`<AuthStatus />`}</p>

          <p className="mb-2">{`// Server component:`}</p>
          <p className="mb-2">{`import {getStravaUser} from "@/utils/auth/stravaAuthServer";`}</p>
          <p>{`const user = await getStravaUser();`}</p>
        </div>
      </div>
    </div>
  );
}
