import { NextRequest, NextResponse } from "next/server";

import { client } from "@/sanity/client";
import { SanityRunningShoe } from "@/types/RunningShoe";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const minimal = searchParams.get("minimal") === "true";

    // Minimal query for dropdowns - only fetches _id, name, and brand name
    const minimalQuery = `*[_type == "runningShoe"]|order(lower(name) asc){
      _id,
      name,
      brand->{name}
    }`;

    const fullQuery = `*[_type == "runningShoe" && defined(slug.current)]|order(lower(name) asc){
      _id,
      name,
      slug,
      brand->{name, slug},
      purpose,
      categories[],
      image,
      specs,
      releaseInfo
    }`;

    const query = minimal ? minimalQuery : fullQuery;

    const data = await client.fetch<SanityRunningShoe[]>(
      query,
      {},
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching shoes:", error);
    return NextResponse.json(
      { error: "Failed to fetch shoes" },
      { status: 500 }
    );
  }
}
