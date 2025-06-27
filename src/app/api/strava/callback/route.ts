import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserRepository } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // Handle OAuth errors (user denied access, etc.)
    if (error) {
      console.error("Strava OAuth error:", error);
      return NextResponse.redirect(
        new URL("/?error=strava_auth_denied", request.url)
      );
    }

    // Check if we have the authorization code
    if (!code) {
      console.error("No authorization code received");
      return NextResponse.redirect(
        new URL("/?error=no_auth_code", request.url)
      );
    }

    console.log("Exchanging code for token:", code);

    // Exchange the authorization code for an access token
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Failed to exchange code for token:", tokenResponse.status);
      return NextResponse.redirect(
        new URL("/?error=token_exchange_failed", request.url)
      );
    }

    const stravaToken = await tokenResponse.json();

    if (!stravaToken?.athlete?.id) {
      console.error("Invalid token response from Strava");
      return NextResponse.redirect(
        new URL("/?error=invalid_token", request.url)
      );
    }

    console.log(
      "Successfully received token for athlete:",
      stravaToken.athlete.id
    );

    // Save user to database
    try {
      const username =
        `${stravaToken.athlete.firstname?.toLowerCase() || ""}_${stravaToken.athlete.lastname?.toLowerCase() || ""}_${stravaToken.athlete.id}`.replace(
          /\s+/g,
          ""
        );

      await UserRepository.upsertUser({
        username: username,
        accesstoken: stravaToken.access_token,
        role: "user",
      });

      console.log(`User saved to database: ${username}`);
    } catch (dbError) {
      console.error("Error saving user to database:", dbError);
      // Continue with authentication even if database save fails
    }

    // Create a JWT token for our application
    const jwtSecret = process.env.JWT_SECRET || "your-jwt-secret-key";
    const appToken = jwt.sign(
      {
        id: stravaToken.athlete.id,
        firstName: stravaToken.athlete.firstname,
        lastName: stravaToken.athlete.lastname,
        profilePicture: stravaToken.athlete.profile,
        stravaAccessToken: stravaToken.access_token,
        stravaRefreshToken: stravaToken.refresh_token,
        stravaExpiresAt: stravaToken.expires_at,
      },
      jwtSecret,
      { expiresIn: "30d" } // JWT expires in 30 days
    );

    // Store user info for client-side access
    const userInfo = {
      id: stravaToken.athlete.id,
      firstName: stravaToken.athlete.firstname,
      lastName: stravaToken.athlete.lastname,
      profilePicture: stravaToken.athlete.profile,
    };

    // Create response with redirect
    const response = NextResponse.redirect(
      new URL("/?auth=success", request.url)
    );

    // Set cookies on the response
    response.cookies.set("strava_auth", appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
    });

    response.cookies.set("strava_user", JSON.stringify(userInfo), {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error in Strava callback:", error);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }
}
