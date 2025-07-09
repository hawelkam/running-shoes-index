# Debug Admin Authentication Issue

The extensive logging has been added to help debug why admin users are being redirected. Here's what the logging will show:

## Admin Page Logging (`/src/app/admin/page.tsx`):
- ✅ Admin page access attempt
- ✅ Strava user cookie verification results
- ✅ Database user lookup results
- ✅ Role verification

## Strava Auth Server Logging (`/src/utils/auth/stravaAuthServer.ts`):
- ✅ Cookie store access
- ✅ JWT token verification 
- ✅ Database user search by access token

## Database Repository Logging (`/src/utils/database.ts`):
- ✅ Database query execution
- ✅ Query results

## To Debug:

1. **Check Environment Variables**:
   ```bash
   # Make sure these are set in .env.local:
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

2. **Check the Server Logs**:
   - Open browser dev tools (Network/Console)
   - Navigate to `/admin`
   - Check the server console for detailed logs with emojis:
     - 🚀 AdminPage: Starting admin page access check
     - 🍪 getStravaUser: Cookie information
     - 🗄️ getUserFromDatabase: Database lookup
     - ✅/❌ Success or failure indicators

3. **Verify Database State**:
   ```sql
   SELECT id, username, role, 
          LEFT(accesstoken, 10) as token_prefix,
          created_at 
   FROM users 
   WHERE role = 'admin';
   ```

4. **Check Authentication Flow**:
   - Verify user is logged in via Strava
   - Check if JWT cookie `strava_auth` exists
   - Verify user exists in database with correct access token
   - Confirm user role is set to 'admin'

The logging will pinpoint exactly where the authentication is failing:
- Missing/invalid cookie
- JWT verification failure  
- Database user not found
- User role not 'admin'

## Expected Log Flow:
```
🚀 AdminPage: Starting admin page access check
🍪 getStravaUser: Getting cookie store
🔍 getStravaUser: Looking for strava_auth cookie
🍪 getStravaUser: Cookie check result: { hasCookie: true, hasValue: true, cookieValueLength: 245 }
🔑 getStravaUser: Getting JWT secret
🔓 getStravaUser: Attempting to verify JWT token
✅ getStravaUser: JWT verification successful: { userId: 12345, firstName: "John", ... }
👤 AdminPage: Strava user result: { hasUser: true, userId: 12345, ... }
🔍 AdminPage: Attempting to get user from database using refresh token: abc123...
🗄️ getUserFromDatabase: Searching for user with refresh token: { refreshTokenLength: 40, ... }
🔍 UserRepository.getUserByAccessToken: Querying database for accessToken: { accessTokenLength: 40, ... }
🗄️ UserRepository.getUserByAccessToken: Query result: { resultCount: 1, hasFirstResult: true, ... }
🗄️ getUserFromDatabase: Database query result: { foundUser: true, userId: 1, username: "john_doe", role: "admin", ... }
🗄️ AdminPage: Database user result: { hasDbUser: true, userId: 1, username: "john_doe", role: "admin", ... }
✅ AdminPage: Admin access granted, rendering AdminClient
```
