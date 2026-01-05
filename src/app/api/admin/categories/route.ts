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

    // Fetch all categories from Sanity
    const query = `*[_type == "shoeCategory"] | order(name asc) {
      _id,
      name
    }`;

    const categories = await client.fetch(query);

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
