import Link from "next/link";

import { SanityRunningShoe } from "@/types/RunningShoe";
import { client } from "@/sanity/client";
import QuickNavigationLink from "@/components/common/QuickNavigationLink";
import LatestReleases from "@/components/layout/LatestReleases";
import LatestReviews from "@/components/layout/LatestReviews";

interface ReviewWithShoe {
  _id: string;
  reviewDate: string;
  shoe: SanityRunningShoe;
  plReview?: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
  };
  enReview?: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
  };
}

async function getData() {
  const query = `*[_type == "runningShoe" && defined(slug.current)]|order(_createdAt desc)[0...3]{_id, name, slug, purpose, categories[], image, releaseInfo}`;

  const data = await client.fetch<SanityRunningShoe[]>(
    query,
    {},
    { next: { revalidate: 30 } }
  );
  return data;
}

async function getLatestReviews() {
  const query = `*[
    _type == "runningShoeReview" &&
    defined(reviewDate) &&
    (
      defined(plReview.youtube) ||
      defined(plReview.instagram) ||
      defined(plReview.tiktok) ||
      defined(enReview.youtube) ||
      defined(enReview.instagram) ||
      defined(enReview.tiktok)
    )
  ]|order(reviewDate desc)[0...3]{
    _id,
    reviewDate,
    plReview,
    enReview,
    shoe->{
      _id,
      name,
      slug,
      purpose,
      categories[],
      image,
      releaseInfo
    }
  }`;

  const data = await client.fetch<ReviewWithShoe[]>(
    query,
    {},
    { next: { revalidate: 30 } }
  );
  return data.reverse();
}

export default async function IndexPage() {
  const shoes = await getData();
  const reviews = await getLatestReviews();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Stride Lab</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your complete directory of running shoes
        </p>
      </header>

      {/* Quick Navigation Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <QuickNavigationLink
          href="/brands"
          title="Browse Brands"
          description="Explore all shoe brands"
          icon={
            <svg
              className="w-6 h-6 text-black"
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
          }
        />

        <QuickNavigationLink
          href="/shoes/reviewed/2025"
          title="2025 Reviews"
          description="Recently reviewed shoes"
          icon={
            <svg
              className="w-6 h-6 text-black"
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
          }
        />

        <QuickNavigationLink
          href={`/shoes/released/${currentYear}/${currentMonth.toString().padStart(2, "0")}`}
          title="This Month"
          description={`${new Date().toLocaleString("default", { month: "long" })} ${currentYear} releases`}
          icon={
            <svg
              className="w-6 h-6 text-black"
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
          }
        />

        <QuickNavigationLink
          href={`/shoes/released/${currentYear}`}
          title="This Year"
          description={`${currentYear} releases`}
          icon={
            <svg
              className="w-6 h-6 text-black"
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
          }
        />

        <QuickNavigationLink
          href="/shoes/compare"
          title="Compare Shoes"
          description="Side-by-side comparison"
          icon={
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />
      </div>

      {/* Latest Releases Section */}
      <LatestReleases shoes={shoes} />

      {/* Latest Reviews Section */}
      <LatestReviews reviews={reviews.reverse()} />

      {/* Shop by Type Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Browse by Type
          </h2>
          <p className="text-lg text-gray-600">
            Find the perfect running shoes for your specific needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickNavigationLink
            href="/shoes/road"
            title="Road Running"
            description="Pavement & street running"
            icon={
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
          />

          <QuickNavigationLink
            href="/shoes/trail"
            title="Trail Running"
            description="Off-road & mountain trails"
            icon={
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            }
          />

          <QuickNavigationLink
            href="/shoes/track"
            title="Track & Field"
            description="Speed & competition"
            icon={
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
          />

          <QuickNavigationLink
            href="/shoes/gravel"
            title="Gravel Running"
            description="Mixed terrain versatility"
            icon={
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            }
          />

          <QuickNavigationLink
            href="/shoes/gym-treadmill"
            title="Gym & Treadmill"
            description="Indoor training & fitness"
            icon={
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            }
          />

          <QuickNavigationLink
            href="/shoes"
            title="All Shoes"
            description="Browse complete catalog"
            icon={
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            }
          />
        </div>
      </section>

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
