import { getStravaUser } from "@/utils/auth/stravaAuthServer";
import AuthStatus from "@/components/AuthStatus";

export default async function AuthDemo() {
  const user = await getStravaUser();

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
