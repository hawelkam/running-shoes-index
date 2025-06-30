"use client";

import { SanityRunningShoe } from "@/_types/RunningShoe";
import Link from "next/link";
import Image from "next/image";

interface ReviewWithShoe {
  _id: string;
  reviewDate: string;
  shoe: SanityRunningShoe;
}

interface LatestReviewsProps {
  reviews: ReviewWithShoe[];
}

export default function LatestReviews({ reviews }: LatestReviewsProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Latest Reviews</h2>
        <Link
          href="/shoes/reviewed"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View All Reviews →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500">
            No latest reviews available at the moment.
          </div>
        ) : (
          reviews.slice(0, 3).map((review) => (
            <div
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white"
              key={review._id}
            >
              <div className="h-64 overflow-hidden relative">
                <Image
                  alt={review.shoe.name}
                  src={review.shoe.image?.url || "/placeholder-shoe.jpg"}
                  width={400}
                  height={300}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                    Reviewed
                  </span>
                </div>
              </div>

              <div className="p-6">
                <Link
                  href={`/reviews/${review.shoe.slug.current}`}
                  className="text-black"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {review.shoe.name}
                  </h3>
                </Link>
                {review.shoe.purpose && (
                  <div className="text-xs uppercase text-gray-500 mb-1">
                    {review.shoe.purpose}
                  </div>
                )}
                <div className="text-xs text-gray-500 mb-3">
                  Reviewed: {new Date(review.reviewDate).toLocaleDateString()}
                </div>
                {review.shoe.categories &&
                  review.shoe.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-sm text-white mb-4">
                      {review.shoe.categories
                        .slice(0, 2)
                        .map((cat, idx: number) => (
                          <span
                            key={idx}
                            className="bg-black px-2 py-1 rounded"
                          >
                            {cat}
                          </span>
                        ))}
                    </div>
                  )}
                <Link
                  href={`/reviews/${review.shoe.slug.current}`}
                  key={`${review.shoe.slug.current}-details`}
                  className="inline-block mt-2 px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black border border-black transition"
                >
                  Read Review
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
