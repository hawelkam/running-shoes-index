import { client } from "@/sanity/client";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import GenericPagination from "@/_components/GenericPagination";
import { SanityRunningShoe } from "@/_types/RunningShoe";

const ITEMS_PER_PAGE = 12;

interface ReviewsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

interface ReviewWithShoe {
  _id: string;
  reviewDate: string;
  rating?: "S" | "A" | "B" | "C" | "D" | "E";
  shoe: SanityRunningShoe;
}

async function getReviews(
  page: number = 1,
  searchTerm?: string
): Promise<{ reviews: ReviewWithShoe[]; total: number }> {
  const offset = (page - 1) * ITEMS_PER_PAGE;

  let searchFilter = "";
  if (searchTerm) {
    searchFilter = `&& shoe->name match "*${searchTerm}*"`;
  }

  const query = `{
    "reviews": *[_type == "runningShoeReview" ${searchFilter}]|order(reviewDate asc)[${offset}...${offset + ITEMS_PER_PAGE}]{
      _id,
      reviewDate,
      rating,
      shoe->{
        _id,
        name,
        slug,
        purpose,
        categories[],
        image,
        releaseInfo
      }
    },
    "total": count(*[_type == "runningShoeReview" ${searchFilter}])
  }`;

  try {
    const result = await client.fetch<{
      reviews: ReviewWithShoe[];
      total: number;
    }>(query, {}, { next: { revalidate: 60 } });

    return {
      reviews: result.reviews || [],
      total: result.total || 0,
    };
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return { reviews: [], total: 0 };
  }
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const searchTerm = resolvedSearchParams.search;

  const { reviews, total } = await getReviews(currentPage, searchTerm);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">All Reviews</h1>
        <p className="text-lg text-gray-600 mb-4">
          Browse all reviewed running shoes with detailed analysis and ratings
        </p>
        <div className="flex gap-4">
          <Link
            href="/reviews/tierlist"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                d="M9 19V6l3 2 3-2v13M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
              />
            </svg>
            View Tier List
          </Link>
        </div>
      </header>

      {/* Search */}
      <div className="mb-8">
        <form method="GET" className="flex gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search reviews by shoe name..."
            defaultValue={searchTerm}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {reviews.length} of {total} reviews
          {searchTerm && (
            <>
              {" "}
              for &ldquo;<span className="font-medium">{searchTerm}</span>
              &rdquo;
            </>
          )}
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {reviews.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            {searchTerm
              ? "No reviews found for your search."
              : "No reviews available at the moment."}
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <div className="h-48 overflow-hidden relative">
                <Image
                  alt={review.shoe.name}
                  src={review.shoe.image?.url || "/placeholder-shoe.jpg"}
                  width={300}
                  height={200}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Reviewed
                  </span>
                </div>
                {review.rating && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-black text-white px-2 py-1 rounded text-xs font-bold">
                      {review.rating.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <Link
                  href={`/reviews/${review.shoe.slug.current}`}
                  className="text-black hover:text-blue-600 transition-colors"
                >
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {review.shoe.name}
                  </h3>
                </Link>

                {review.shoe.purpose && (
                  <div className="text-xs uppercase text-gray-500 mb-2">
                    {review.shoe.purpose}
                  </div>
                )}

                <div className="text-xs text-gray-500 mb-3">
                  Reviewed: {new Date(review.reviewDate).toLocaleDateString()}
                </div>

                {review.shoe.categories &&
                  review.shoe.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {review.shoe.categories.slice(0, 2).map((cat, idx) => (
                        <span
                          key={idx}
                          className="bg-black text-white text-xs px-2 py-1 rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                <Link
                  href={`/reviews/${review.shoe.slug.current}`}
                  className="inline-block w-full text-center px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black border border-black transition"
                >
                  Read Review
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Suspense fallback={<div>Loading pagination...</div>}>
          <GenericPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={ITEMS_PER_PAGE}
            basePath="/reviews"
          />
        </Suspense>
      )}
    </div>
  );
}
