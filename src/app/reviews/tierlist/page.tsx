import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { SanityRunningShoe } from "@/types/RunningShoe";

interface ReviewWithShoe {
  _id: string;
  reviewDate: string;
  rating: "S" | "A" | "B" | "C" | "D" | "E";
  shoe: SanityRunningShoe;
}

interface TierListData {
  [key: string]: ReviewWithShoe[];
}

async function getReviewsByTier(): Promise<TierListData> {
  const query = `*[_type == "runningShoeReview" && defined(rating)]|order(reviewDate desc){
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
  }`;

  try {
    const reviews = await client.fetch<ReviewWithShoe[]>(
      query,
      {},
      { next: { revalidate: 60 } }
    );

    // Group reviews by rating
    const tierList: TierListData = {
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
    };

    reviews.forEach((review) => {
      if (review.rating && tierList[review.rating.toUpperCase()]) {
        tierList[review.rating.toUpperCase()].push(review);
      }
    });

    return tierList;
  } catch (error) {
    console.error("Failed to fetch reviews for tier list:", error);
    return { S: [], A: [], B: [], C: [], D: [], E: [] };
  }
}

function getTierInfo(tier: string) {
  switch (tier) {
    case "S":
      return {
        label: "S - Exceptional",
        color: "bg-purple-600",
        textColor: "text-purple-600",
        borderColor: "border-purple-600",
      };
    case "A":
      return {
        label: "A - Excellent",
        color: "bg-green-600",
        textColor: "text-green-600",
        borderColor: "border-green-600",
      };
    case "B":
      return {
        label: "B - Good",
        color: "bg-blue-600",
        textColor: "text-blue-600",
        borderColor: "border-blue-600",
      };
    case "C":
      return {
        label: "C - Average",
        color: "bg-yellow-600",
        textColor: "text-yellow-600",
        borderColor: "border-yellow-600",
      };
    case "D":
      return {
        label: "D - Below Average",
        color: "bg-orange-600",
        textColor: "text-orange-600",
        borderColor: "border-orange-600",
      };
    case "E":
      return {
        label: "E - Poor",
        color: "bg-red-600",
        textColor: "text-red-600",
        borderColor: "border-red-600",
      };
    default:
      return {
        label: "Unknown",
        color: "bg-gray-600",
        textColor: "text-gray-600",
        borderColor: "border-gray-600",
      };
  }
}

export default async function TierListPage() {
  const tierList = await getReviewsByTier();
  const tiers = ["S", "A", "B", "C", "D", "E"];

  const totalReviews = Object.values(tierList).reduce(
    (total, reviews) => total + reviews.length,
    0
  );

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
            <Link href="/reviews" className="hover:text-blue-600">
              Reviews
            </Link>
            <span>&gt;</span>
            <span className="text-gray-800">Tier List</span>
          </div>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Running Shoes Tier List
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          All reviewed running shoes ranked by grade from S (Exceptional) to E
          (Poor)
        </p>
        <p className="text-sm text-gray-500">Total reviews: {totalReviews}</p>
      </header>

      {/* Tier List */}
      <div className="space-y-8">
        {tiers.map((tier) => {
          const tierInfo = getTierInfo(tier);
          const reviews = tierList[tier] || [];

          return (
            <div
              key={tier}
              className={`border-2 ${tierInfo.borderColor} rounded-lg overflow-hidden`}
            >
              {/* Tier Header */}
              <div
                className={`${tierInfo.color} text-white p-4 flex items-center justify-between`}
              >
                <h2 className="text-xl font-bold">{tierInfo.label}</h2>
                <span className="text-sm opacity-90">
                  {reviews.length} shoe{reviews.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Tier Content */}
              <div className="bg-gray-50 p-4">
                {reviews.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No shoes in this tier yet
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {reviews.map((review) => (
                      <Link
                        key={review._id}
                        href={`/reviews/${review.shoe.slug.current}`}
                        className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Shoe Image */}
                        <div className="aspect-square overflow-hidden bg-white">
                          <Image
                            src={
                              review.shoe.image?.url || "/placeholder-shoe.jpg"
                            }
                            alt={review.shoe.name}
                            width={200}
                            height={200}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Shoe Info */}
                        <div className="p-3">
                          <h3 className="font-medium text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {review.shoe.name}
                          </h3>

                          {/* Categories */}
                          {review.shoe.categories &&
                            review.shoe.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {review.shoe.categories
                                  .slice(0, 2)
                                  .map((cat, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                    >
                                      {cat}
                                    </span>
                                  ))}
                                {review.shoe.categories.length > 2 && (
                                  <span className="text-xs text-gray-500">
                                    +{review.shoe.categories.length - 2}
                                  </span>
                                )}
                              </div>
                            )}

                          {/* Purpose */}
                          {review.shoe.purpose && (
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                              {review.shoe.purpose}
                            </div>
                          )}

                          {/* Review Date */}
                          <div className="text-xs text-gray-400">
                            Reviewed:{" "}
                            {new Date(review.reviewDate).toLocaleDateString()}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="mt-12 text-center">
        <Link
          href="/reviews"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          View All Reviews
        </Link>
      </div>
    </div>
  );
}
