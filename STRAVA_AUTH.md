# Strava OAuth Authentication

This application includes a complete Strava OAuth authentication system.

## Setup

1. **Environment Variables**: Make sure these are set in your `.env.development.local`:

   ```
   NEXT_PUBLIC_STRAVA_CLIENT_ID=your_strava_app_client_id
   NEXT_PUBLIC_STRAVA_REDIRECT_URI="http://localhost:3000/api/strava/callback"
   STRAVA_CLIENT_SECRET=your_strava_app_client_secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

2. **Strava App Setup**:
   - Create a Strava app at https://www.strava.com/settings/api
   - Set the redirect URI to: `http://localhost:3000/api/strava/callback`
   - Copy the Client ID and Client Secret to your environment variables

## Features

- ✅ Complete OAuth flow with Strava
- ✅ JWT token-based authentication
- ✅ Secure HTTP-only cookies for auth tokens
- ✅ Client-side user info for UI display
- ✅ Server-side authentication for API access
- ✅ Automatic token refresh (if needed)
- ✅ Logout functionality
- ✅ Route protection middleware
- ✅ Responsive UI with Ant Design

## Usage

### Client Components

```tsx
import AuthStatus from "@/components/AuthStatus";
import { getStravaUserInfo, clearStravaAuth } from "@/utils/auth/stravaAuth";

// Simple auth status component
<AuthStatus />;

// Custom implementation
const user = getStravaUserInfo();
if (user) {
  // User is logged in
  console.log(user.firstName, user.lastName);
}
```

### Server Components

```tsx
import { getStravaUser } from "@/utils/auth/stravaAuthServer";

export default async function MyPage() {
  const user = await getStravaUser();

  if (!user) {
    return <div>Please log in</div>;
  }

  // Access full user data including Strava tokens
  console.log(user.stravaAccessToken);

  return <div>Welcome {user.firstName}!</div>;
}
```

### API Routes

```tsx
import { getStravaUser } from "@/utils/auth/stravaAuthServer";

export async function GET() {
  const user = await getStravaUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use user.stravaAccessToken to make Strava API calls
  return NextResponse.json({ user });
}
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/logout/route.ts       # Logout endpoint
│   │   └── strava/callback/route.ts   # OAuth callback
│   └── auth-demo/page.tsx             # Demo page
├── components/
│   └── AuthStatus.tsx                 # Reusable auth component
└── utils/auth/
    ├── getStravaAuthUrl.ts            # OAuth URL generator
    ├── stravaAuth.ts                  # Client-side auth utils
    └── stravaAuthServer.ts            # Server-side auth utils
```

## Authentication Flow

1. User clicks "Sign in with Strava"
2. Redirected to Strava OAuth page
3. User authorizes the app
4. Strava redirects back to `/api/strava/callback`
5. Server exchanges code for tokens
6. Server creates JWT and sets cookies
7. User is redirected back to app (logged in)

## Testing

Visit `/auth-demo` to see the authentication system in action with both client-side and server-side examples.
