export const getStravaAuthUrl = () => {
  // Only run this on the client side to avoid SSR issues
  if (typeof window === "undefined") {
    return "#"; // Return a placeholder during SSR/build
  }

  const clientId = process.env["NEXT_PUBLIC_STRAVA_CLIENT_ID"];
  const redirectUri = process.env["NEXT_PUBLIC_STRAVA_REDIRECT_URI"];

  if (!clientId || !redirectUri) {
    console.warn(
      "Strava client ID and redirect URI must be set in environment variables."
    );
    return "#"; // Return a placeholder instead of throwing
  }

  const scope = "activity:read_all,profile:read_all";

  return `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
};
