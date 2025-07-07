import { NextResponse } from "next/server";

import { client } from "@/sanity/client";
import { SanityRunningShoe } from "@/types/RunningShoe";

export async function GET() {
  try {
    const query = `*[_type == "runningShoe" && defined(slug.current)]|order(lower(name) asc){
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
