import { client } from "@/sanity/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import {
  getStravaUser,
  getUserFromDatabase,
} from "@/_utils/auth/stravaAuthServer";

interface IncompleteShoe extends SanityRunningShoe {
  missingFields: string[];
}

async function getIncompleteShoesData(): Promise<IncompleteShoe[]> {
  const query = `*[_type == "runningShoe"]{
    _id,
    name,
    brand->,
    slug,
    image,
    releaseInfo,
    specs,
    _createdAt
  }`;

  try {
    const shoes = await client.fetch<SanityRunningShoe[]>(
      query,
      {},
      { next: { revalidate: 300 } }
    );

    // Analyze each shoe for missing data
    const incompleteShoes: IncompleteShoe[] = shoes
      .map((shoe) => {
        const missingFields: string[] = [];

        // Check release dates
        if (!shoe.releaseInfo?.pl?.date) missingFields.push("PL Release Date");
        if (!shoe.releaseInfo?.eu?.date) missingFields.push("EU Release Date");
        if (!shoe.releaseInfo?.us?.date) missingFields.push("US Release Date");

        // Check prices
        if (!shoe.releaseInfo?.pl?.price) missingFields.push("PL Price");
        if (!shoe.releaseInfo?.eu?.price) missingFields.push("EU Price");
        if (!shoe.releaseInfo?.us?.price) missingFields.push("US Price");

        // Check materials
        if (!shoe.specs?.foam || shoe.specs.foam.length === 0)
          missingFields.push("Foam");
        if (!shoe.specs?.upper || shoe.specs.upper.length === 0)
          missingFields.push("Upper");
        if (!shoe.specs?.outsole || shoe.specs.outsole.length === 0)
          missingFields.push("Outsole");
        if (!shoe.specs?.plate) missingFields.push("Plate");

        // Check men's specs
        const menSpecs = shoe.specs?.m;
        if (
          !menSpecs ||
          (!menSpecs.weight && !menSpecs.drop && !menSpecs.heelStack)
        ) {
          missingFields.push("Men's Specifications");
        } else {
          if (!menSpecs.weight) missingFields.push("Men's Weight");
          if (!menSpecs.drop && menSpecs.drop !== 0)
            missingFields.push("Men's Drop");
          if (!menSpecs.heelStack) missingFields.push("Men's Heel Stack");
        }

        // Check women's specs
        const womenSpecs = shoe.specs?.w;
        if (
          !womenSpecs ||
          (!womenSpecs.weight && !womenSpecs.drop && !womenSpecs.heelStack)
        ) {
          missingFields.push("Women's Specifications");
        } else {
          if (!womenSpecs.weight) missingFields.push("Women's Weight");
          if (!womenSpecs.drop && womenSpecs.drop !== 0)
            missingFields.push("Women's Drop");
          if (!womenSpecs.heelStack) missingFields.push("Women's Heel Stack");
        }

        return {
          ...shoe,
          missingFields,
        };
      })
      .filter((shoe) => shoe.missingFields.length > 0)
      .sort((a, b) => b.missingFields.length - a.missingFields.length); // Sort by most missing fields first

    return incompleteShoes;
  } catch (error) {
    console.error("Failed to fetch incomplete shoes:", error);
    return [];
  }
}

function getMissingFieldColor(field: string): string {
  if (field.includes("Release Date")) return "bg-red-100 text-red-800";
  if (field.includes("Price")) return "bg-orange-100 text-orange-800";
  if (
    field.includes("Foam") ||
    field.includes("Upper") ||
    field.includes("Outsole") ||
    field.includes("Plate")
  ) {
    return "bg-purple-100 text-purple-800";
  }
  if (field.includes("Men's")) return "bg-blue-100 text-blue-800";
  if (field.includes("Women's")) return "bg-pink-100 text-pink-800";
  return "bg-gray-100 text-gray-800";
}

export default async function IncompleteShoesPage() {
  // Get authenticated user
  const stravaUser = await getStravaUser();

  if (!stravaUser) {
    redirect("/");
  }

  // Get user from database to check role
  const dbUser = await getUserFromDatabase(stravaUser.stravaAccessToken);

  if (!dbUser || dbUser.role !== "admin") {
    redirect("/");
  }

  const incompleteShoes = await getIncompleteShoesData();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <nav className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>&gt;</span>
            <Link href="/admin" className="hover:text-blue-600">
              Admin
            </Link>
            <span>&gt;</span>
            <span className="text-gray-800">Incomplete Shoes</span>
          </div>
        </nav>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Incomplete Shoes Data
            </h1>
            <p className="text-lg text-gray-600">
              Shoes missing crucial data points that need to be completed
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">
              {incompleteShoes.length}
            </div>
            <div className="text-sm text-red-800">Shoes Need Attention</div>
          </div>
        </div>
      </header>

      {/* Legend */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">
          Missing Data Categories:
        </h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
            Release Dates
          </span>
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
            Prices
          </span>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
            Materials
          </span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Men&apos;s Specs
          </span>
          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded">
            Women&apos;s Specs
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-800">
            {
              incompleteShoes.filter((shoe) =>
                shoe.missingFields.some((field) =>
                  field.includes("Release Date")
                )
              ).length
            }
          </div>
          <div className="text-sm text-gray-600">Missing Release Dates</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-800">
            {
              incompleteShoes.filter((shoe) =>
                shoe.missingFields.some((field) => field.includes("Price"))
              ).length
            }
          </div>
          <div className="text-sm text-gray-600">Missing Prices</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-800">
            {
              incompleteShoes.filter((shoe) =>
                shoe.missingFields.some(
                  (field) =>
                    field.includes("Foam") ||
                    field.includes("Upper") ||
                    field.includes("Outsole") ||
                    field.includes("Plate")
                )
              ).length
            }
          </div>
          <div className="text-sm text-gray-600">Missing Materials</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-800">
            {
              incompleteShoes.filter((shoe) =>
                shoe.missingFields.some(
                  (field) =>
                    field.includes("Men's") || field.includes("Women's")
                )
              ).length
            }
          </div>
          <div className="text-sm text-gray-600">Missing Specifications</div>
        </div>
      </div>

      {/* Shoes List */}
      {incompleteShoes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            All shoes are complete!
          </h2>
          <p className="text-gray-600">
            Every shoe in the database has all required data.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {incompleteShoes.map((shoe) => (
            <div
              key={shoe._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-6">
                {/* Shoe Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={shoe.image?.url || "/placeholder-shoe.jpg"}
                      alt={shoe.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Shoe Details */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link
                        href={`/shoes/${shoe.slug.current}`}
                        className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        {shoe.name}
                      </Link>
                      <div className="text-sm text-gray-600 mt-1">
                        Brand: {shoe.brand?.name || "Unknown"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Missing Fields
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        {shoe.missingFields.length}
                      </div>
                    </div>
                  </div>

                  {/* Missing Fields Chips */}
                  <div className="flex flex-wrap gap-2">
                    {shoe.missingFields.map((field, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getMissingFieldColor(field)}`}
                      >
                        {field}
                      </span>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      href={`/shoes/${shoe.slug.current}`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Shoe Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-12 text-center space-x-4">
        <Link
          href="/admin"
          className="inline-block bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Back to Admin
        </Link>
        <Link
          href="/shoes"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Browse All Shoes
        </Link>
      </div>
    </div>
  );
}
