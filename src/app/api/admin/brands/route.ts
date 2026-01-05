import { NextResponse } from "next/server";

import { client } from "@/sanity/client";
import {
  getStravaUser,
  getUserFromDatabase,
} from "@/utils/auth/stravaAuthServer";

export async function GET() {
  try {
    // Verify admin authentication
    const stravaUser = await getStravaUser();
    if (!stravaUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await getUserFromDatabase(stravaUser.stravaRefreshToken);
    if (!dbUser || dbUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all brands from Sanity
    const query = `*[_type == "brand" && defined(slug.current)] | order(lower(name) asc) {
      _id,
      name,
      "slug": slug.current
    }`;

    const brands = await client.fetch(query);

    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
