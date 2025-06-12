import { SanityRunningShoe } from "@/_types/RunningShoe";
import { client } from "@/sanity/client";
import Link from "next/link";
import LatestReleases from "./_components/LatestReleases";

async function getData() {
  const query = `*[_type == "runningShoe" && defined(slug.current)]|order(_createdAt desc)[0...3]{_id, name, slug, shoeType->, category[]->, image, releaseInfo}`;

  const data = await client.fetch<SanityRunningShoe[]>(
    query,
    {},
    { next: { revalidate: 30 } }
  );
  return data;
}

export default async function IndexPage() {
  const shoes = await getData();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Running Shoes Index
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your complete directory of running shoes
        </p>
      </header>

      {/* Quick Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link href="/brands" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                  Browse Brands
                </h3>
                <p className="text-sm text-gray-600">Explore all shoe brands</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/shoes/reviewed/2025" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-green-600">
                  2025 Reviews
                </h3>
                <p className="text-sm text-gray-600">Recently reviewed shoes</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href={`/shoes/released/${currentYear}/${currentMonth.toString().padStart(2, "0")}`}
          className="group"
        >
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-purple-600">
                  This Month
                </h3>
                <p className="text-sm text-gray-600">June 2025 releases</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href={`/shoes/released/${currentYear}`} className="group">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600">
                  This Year
                </h3>
                <p className="text-sm text-gray-600">2025 releases</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Latest Releases Section */}
      <LatestReleases shoes={shoes} />

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          Ready to find your perfect running shoe?
        </h2>
        <p className="text-lg mb-6">
          Explore our complete catalog of running shoes with detailed specs and
          reviews.
        </p>
        <Link
          href="/shoes"
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Browse All Shoes
        </Link>
      </div>
    </div>
  );
}
