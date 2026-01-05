import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

import {
  getStravaUser,
  getUserFromDatabase,
} from "@/utils/auth/stravaAuthServer";

// Create a Sanity client with write permissions
const sanityClient = createClient({
  projectId: "op6a4xkr",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env["SANITY_API_TOKEN"] ?? "",
});

export interface CreateShoeRequest {
  name: string;
  brandId: string;
  purpose: string;
  stability: string;
  categories?: string[];
  wideAvailable: boolean;
  releaseInfo?: {
    pl?: { date: string; price: number };
    eu?: { date: string; price: number };
    us?: { date: string; price: number };
  };
  specs?: {
    m?: {
      weight?: number;
      drop?: number;
      heelStack?: number;
    };
    w?: {
      weight?: number;
      drop?: number;
      heelStack?: number;
    };
    upper?: string;
    foam?: string;
    plate?: string;
    outsole?: string;
  };
  notes?: string;
  previousVersion?: string;
  nextVersion?: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: NextRequest) {
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

    const body = (await request.json()) as CreateShoeRequest;

    // Validate required fields
    if (!body.name || !body.brandId || !body.purpose || !body.stability) {
      return NextResponse.json(
        { error: "Missing required fields: name, brandId, purpose, stability" },
        { status: 400 }
      );
    }

    // Generate slug from shoe name
    const slug = generateSlug(body.name);

    // Check if shoe with same slug already exists
    const existingShoe = await sanityClient.fetch<{ _id: string } | null>(
      `*[_type == "runningShoe" && slug.current == $slug][0]`,
      { slug }
    );

    if (existingShoe) {
      return NextResponse.json(
        { error: "A shoe with this name already exists" },
        { status: 409 }
      );
    }

    // Build the Sanity document
    const shoeDocument = {
      _type: "runningShoe",
      name: body.name,
      brand: {
        _type: "reference",
        _ref: body.brandId,
      },
      slug: {
        _type: "slug",
        current: slug,
      },
      purpose: body.purpose,
      stability: body.stability,
      wideAvailable: body.wideAvailable ?? false,
      // Categories are just string values, not references
      categories: body.categories ?? [],
      releaseInfo: body.releaseInfo ?? {},
      specs: body.specs ?? {},
      notes: body.notes ?? "",
      // Version references (optional)
      ...(body.previousVersion && {
        previousVersion: {
          _type: "reference",
          _ref: body.previousVersion,
        },
      }),
      ...(body.nextVersion && {
        nextVersion: {
          _type: "reference",
          _ref: body.nextVersion,
        },
      }),
    };

    // Create the shoe in Sanity
    const createdShoe = await sanityClient.create(shoeDocument);

    return NextResponse.json(
      {
        success: true,
        shoe: {
          id: createdShoe._id,
          name: createdShoe.name,
          slug: createdShoe.slug.current,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating shoe:", error);
    return NextResponse.json(
      { error: "Failed to create shoe" },
      { status: 500 }
    );
  }
}
