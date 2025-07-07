import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { client } from "@/sanity/client";
import { SanityRunningShoe } from "@/types/RunningShoe";
import { SanityRunningShoeReview } from "@/types/RunningShoeReview";
import { preparePriceInUSD, prepareReleaseDate } from "@/utils/helpers";

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

interface ReviewWithShoe extends SanityRunningShoeReview {
  shoe: SanityRunningShoe;
}

async function getReview(slug: string): Promise<ReviewWithShoe | null> {
  const query = `*[_type == "runningShoeReview" && shoe->slug.current == $slug][0]{
    _id,
    reviewDate,
    rating,
    writtenReview,
    weightL,
    weightR,
    sizeUS,
    sizeEU,
    plReview,
    enReview,
    shoe->{
      _id,
      name,
      slug,
      purpose,
      categories[],
      image,
      releaseInfo,
      specifications,
      previousVersion
    }
  }`;

  try {
    const review = await client.fetch<ReviewWithShoe | null>(
      query,
      { slug },
      { next: { revalidate: 60 } }
    );
    return review;
  } catch (error) {
    console.error("Failed to fetch review:", error);
    return null;
  }
}

function getRatingColor(rating?: string) {
  switch (rating) {
    case "S":
      return "bg-purple-600";
    case "A":
      return "bg-green-600";
    case "B":
      return "bg-blue-600";
    case "C":
      return "bg-yellow-600";
    case "D":
      return "bg-orange-600";
    case "E":
      return "bg-red-600";
    default:
      return "bg-gray-600";
  }
}

function getRatingLabel(rating?: string) {
  switch (rating) {
    case "S":
      return "Exceptional";
    case "A":
      return "Excellent";
    case "B":
      return "Good";
    case "C":
      return "Average";
    case "D":
      return "Below Average";
    case "E":
      return "Poor";
    default:
      return "Not Rated";
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const review = await getReview(slug);

  if (!review) {
    notFound();
  }

  const shoe = review.shoe;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>&gt;</span>
          <Link href="/reviews" className="hover:text-blue-600">
            Reviews
          </Link>
          <span>&gt;</span>
          <span className="text-gray-800">{shoe.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image */}
        <div className="space-y-6">
          <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white">
            <Image
              src={shoe.image?.url || "/placeholder-shoe.jpg"}
              alt={shoe.name}
              width={600}
              height={600}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Right Column - Review Details */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {shoe.name} Review
            </h1>

            {/* Rating Badge */}
            {review.rating && (
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`${getRatingColor(review.rating.toUpperCase())} text-white px-4 py-2 rounded-lg font-bold text-xl`}
                >
                  Grade: {review.rating.toUpperCase()}
                </div>
                <span className="text-lg text-gray-600">
                  {getRatingLabel(review.rating.toUpperCase())}
                </span>
              </div>
            )}

            <div className="text-sm text-gray-600 mb-6">
              Reviewed on:{" "}
              {review.reviewDate
                ? new Date(review.reviewDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Date not available"}
            </div>
          </div>

          {/* Shoe Basic Info */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Shoe Details</h2>
            <div className="space-y-3">
              {shoe.purpose && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Purpose:</span>
                  <span className="font-medium">{shoe.purpose}</span>
                </div>
              )}

              {shoe.categories && shoe.categories.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Categories:</span>
                  <div className="flex flex-wrap gap-2">
                    {shoe.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {shoe.releaseInfo && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">
                      {preparePriceInUSD(shoe.releaseInfo)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Release Date:</span>
                    <span className="font-medium">
                      {prepareReleaseDate(shoe.releaseInfo.us?.date)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Review Specific Info */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Review Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Size Tested:</span>
                <span className="font-medium">
                  US {review.sizeUS} / EU {review.sizeEU}
                </span>
              </div>

              {(review.weightL ?? review.weightR) && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Weight:</span>
                  <span className="font-medium">
                    {review.weightL && review.weightR
                      ? `${review.weightL}g / ${review.weightR}g (L/R)`
                      : `${review.weightL ?? review.weightR}g`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Video Reviews */}
          {(review.enReview ?? review.plReview) && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">Video Reviews</h2>
              <div className="space-y-4">
                {review.enReview && (
                  <div>
                    <h3 className="font-medium mb-2">English Review</h3>
                    <div className="flex flex-wrap gap-3">
                      {review.enReview.youtube && (
                        <a
                          href={review.enReview.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                          YouTube
                        </a>
                      )}
                      {review.enReview.instagram && (
                        <a
                          href={review.enReview.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                          Instagram
                        </a>
                      )}
                      {review.enReview.tiktok && (
                        <a
                          href={review.enReview.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                          </svg>
                          TikTok
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {review.plReview && (
                  <div>
                    <h3 className="font-medium mb-2">Polish Review</h3>
                    <div className="flex flex-wrap gap-3">
                      {review.plReview.youtube && (
                        <a
                          href={review.plReview.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                          YouTube
                        </a>
                      )}
                      {review.plReview.instagram && (
                        <a
                          href={review.plReview.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                          Instagram
                        </a>
                      )}
                      {review.plReview.tiktok && (
                        <a
                          href={review.plReview.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                          </svg>
                          TikTok
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-6 flex gap-4">
            <Link
              href={`/shoes/${shoe.slug.current}`}
              className="flex-1 bg-black text-white text-center py-3 px-6 rounded-lg hover:bg-gray-800 transition font-medium"
            >
              View Shoe Details
            </Link>
            <Link
              href="/reviews"
              className="flex-1 bg-gray-100 text-gray-800 text-center py-3 px-6 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              All Reviews
            </Link>
          </div>
        </div>
      </div>

      {/* Full Width Written Review */}
      {review.writtenReview && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Written Review
          </h2>
          <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {review.writtenReview}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
