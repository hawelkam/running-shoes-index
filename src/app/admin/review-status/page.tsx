import {
  getStravaUser,
  getUserFromDatabase,
} from "@/_utils/auth/stravaAuthServer";
import { redirect } from "next/navigation";
import { client } from "@/sanity/client";
import { SanityRunningShoeReview } from "@/_types/RunningShoeReview";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import { CACHE_OPTIONS } from "@/_utils/cache";
import Link from "next/link";
import Image from "next/image";

type ReviewWithShoe = SanityRunningShoeReview & {
  shoe: SanityRunningShoe;
};

type BrandReviewStatus = {
  _id: string;
  name: string;
  slug: { current: string };
  image?: { url: string };
  totalShoes: number;
  reviewedShoes: number;
  latestReview?: {
    shoe: string;
    date: string;
  };
};

async function getReviewStatusData() {
  const currentYear = new Date().getFullYear();
  const yearStart = `${currentYear}-01-01`;
  const yearEnd = `${currentYear}-12-31`;

  // Get all reviews from this year
  const thisYearReviewsQuery = `*[_type == "runningShoeReview" && reviewDate >= "${yearStart}" && reviewDate <= "${yearEnd}"]|order(reviewDate desc){
    _id,
    reviewDate,
    rating,
    writtenReview,
    plReview,
    enReview,
    shoe->{
      _id,
      name,
      slug,
      brand->{
        _id,
        name,
        slug
      },
      image
    }
  }`;

  // Get all reviews without reviewDate
  const reviewsWithoutDateQuery = `*[_type == "runningShoeReview" && !defined(reviewDate)]|order(_createdAt desc){
    _id,
    _createdAt,
    rating,
    writtenReview,
    plReview,
    enReview,
    shoe->{
      _id,
      name,
      slug,
      brand->{
        _id,
        name,
        slug
      },
      image
    }
  }`;

  // Get all brands with their shoe counts and review status
  const brandsQuery = `*[_type == "brand"]|order(name asc){
    _id,
    name,
    slug,
    image,
    "totalShoes": count(*[_type == "runningShoe" && brand._ref == ^._id && releaseInfo.pl.date >= "${yearStart}" && releaseInfo.pl.date <= "${yearEnd}"]),
    "reviewedShoes": count(*[_type == "runningShoeReview" && shoe->brand._ref == ^._id && reviewDate >= "${yearStart}" && reviewDate <= "${yearEnd}"]),
    "latestReview": *[_type == "runningShoeReview" && shoe->brand._ref == ^._id && reviewDate >= "${yearStart}" && reviewDate <= "${yearEnd}"]|order(reviewDate desc)[0]{
      "shoe": shoe->name,
      "date": reviewDate
    }
  }`;

  try {
    const [thisYearReviews, reviewsWithoutDate, brands] = await Promise.all([
      client.fetch<ReviewWithShoe[]>(
        thisYearReviewsQuery,
        {},
        CACHE_OPTIONS.SHORT
      ),
      client.fetch<ReviewWithShoe[]>(
        reviewsWithoutDateQuery,
        {},
        CACHE_OPTIONS.SHORT
      ),
      client.fetch<BrandReviewStatus[]>(brandsQuery, {}, CACHE_OPTIONS.SHORT),
    ]);

    return {
      thisYearReviews,
      reviewsWithoutDate,
      brands,
      currentYear,
    };
  } catch (error) {
    console.error("Failed to fetch review status data:", error);
    return {
      thisYearReviews: [],
      reviewsWithoutDate: [],
      brands: [],
      currentYear,
    };
  }
}

function getRatingColor(rating?: string): string {
  switch (rating) {
    case "S":
      return "bg-purple-100 text-purple-800";
    case "A":
      return "bg-green-100 text-green-800";
    case "B":
      return "bg-blue-100 text-blue-800";
    case "C":
      return "bg-yellow-100 text-yellow-800";
    case "D":
      return "bg-orange-100 text-orange-800";
    case "E":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getReviewCompleteness(review: ReviewWithShoe): {
  score: number;
  missing: string[];
} {
  const missing: string[] = [];
  let score = 0;

  if (review.rating) score += 20;
  else missing.push("Rating");

  if (review.writtenReview) score += 30;
  else missing.push("Written Review");

  if (review.reviewDate) score += 10;
  else missing.push("Review Date");

  if (review.plReview?.youtube || review.enReview?.youtube) score += 25;
  else missing.push("YouTube Video");

  if (review.plReview?.instagram || review.enReview?.instagram) score += 10;
  else missing.push("Instagram");

  if (review.plReview?.tiktok || review.enReview?.tiktok) score += 5;
  else missing.push("TikTok");

  return { score, missing };
}

export default async function ReviewStatusPage() {
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

  const { thisYearReviews, reviewsWithoutDate, brands, currentYear } =
    await getReviewStatusData();

  // Filter brands without reviews this year
  const brandsWithoutReviews = brands.filter(
    (brand) => brand.reviewedShoes === 0 && brand.totalShoes > 0
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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
            <span className="text-gray-800">Review Status</span>
          </div>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Review Status Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Overview of review completion and brand coverage for {currentYear}
        </p>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">
            {thisYearReviews.length}
          </div>
          <div className="text-sm text-gray-600">Reviews This Year</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-orange-600">
            {reviewsWithoutDate.length}
          </div>
          <div className="text-sm text-gray-600">Reviews Without Date</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">
            {brands.filter((b) => b.reviewedShoes > 0).length}
          </div>
          <div className="text-sm text-gray-600">Brands Reviewed</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-red-600">
            {brandsWithoutReviews.length}
          </div>
          <div className="text-sm text-gray-600">Brands Without Reviews</div>
        </div>
      </div>

      {/* Reviews This Year */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Reviews from {currentYear}
        </h2>

        {thisYearReviews.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No reviews found for {currentYear}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {thisYearReviews.map((review) => {
              const { score, missing } = getReviewCompleteness(review);
              return (
                <div
                  key={review._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={review.shoe.image?.url || "/placeholder-shoe.jpg"}
                        alt={review.shoe.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-contain"
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link
                            href={`/reviews/${review.shoe.slug.current}`}
                            className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                          >
                            {review.shoe.name}
                          </Link>
                          <div className="text-sm text-gray-600">
                            {review.shoe.brand?.name} • {review.reviewDate}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {review.rating && (
                            <span
                              className={`px-2 py-1 rounded text-sm font-medium ${getRatingColor(review.rating)}`}
                            >
                              {review.rating}
                            </span>
                          )}
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              Completeness
                            </div>
                            <div
                              className={`text-lg font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"}`}
                            >
                              {score}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {missing.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {missing.map((item) => (
                            <span
                              key={item}
                              className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                            >
                              Missing: {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reviews Without Date */}
      {reviewsWithoutDate.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Reviews Without Date
          </h2>

          <div className="space-y-4">
            {reviewsWithoutDate.map((review) => {
              const { score, missing } = getReviewCompleteness(review);
              return (
                <div
                  key={review._id}
                  className="bg-white rounded-lg border border-red-200 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={review.shoe.image?.url || "/placeholder-shoe.jpg"}
                        alt={review.shoe.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-contain"
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link
                            href={`/reviews/${review.shoe.slug.current}`}
                            className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                          >
                            {review.shoe.name}
                          </Link>
                          <div className="text-sm text-gray-600">
                            {review.shoe.brand?.name} • Created:{" "}
                            {new Date(review._createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {review.rating && (
                            <span
                              className={`px-2 py-1 rounded text-sm font-medium ${getRatingColor(review.rating)}`}
                            >
                              {review.rating}
                            </span>
                          )}
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              Completeness
                            </div>
                            <div
                              className={`text-lg font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"}`}
                            >
                              {score}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {missing.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {missing.map((item) => (
                            <span
                              key={item}
                              className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                            >
                              Missing: {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Brands Without Reviews */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Brands Without Reviews This Year
        </h2>

        {brandsWithoutReviews.length === 0 ? (
          <div className="bg-green-50 rounded-lg p-8 text-center">
            <p className="text-green-600">
              🎉 All brands with shoes have been reviewed this year!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandsWithoutReviews.map((brand) => (
              <div
                key={brand._id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={brand.image?.url || "/placeholder-brand.jpg"}
                      alt={brand.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-contain"
                    />
                  </div>

                  <div className="flex-grow">
                    <Link
                      href={`/brands/${brand.slug.current}`}
                      className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                    >
                      {brand.name}
                    </Link>
                    <div className="text-sm text-gray-600 mt-1">
                      {brand.totalShoes} shoe{brand.totalShoes !== 1 ? "s" : ""}{" "}
                      in catalog
                    </div>
                    <div className="text-sm text-red-600 mt-1">
                      No reviews in {currentYear}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Brands Status */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          All Brands Review Status
        </h2>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviewed {currentYear}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latest Review
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brands.map((brand) => {
                  const coverage =
                    brand.totalShoes > 0
                      ? (brand.reviewedShoes / brand.totalShoes) * 100
                      : 0;
                  return (
                    <tr key={brand._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image
                              src={brand.image?.url || "/placeholder-brand.jpg"}
                              alt={brand.name}
                              width={40}
                              height={40}
                              className="rounded-full object-contain"
                            />
                          </div>
                          <div className="ml-4">
                            <Link
                              href={`/brands/${brand.slug.current}`}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600"
                            >
                              {brand.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {brand.reviewedShoes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {brand.latestReview ? (
                          <div>
                            <div className="font-medium">
                              {brand.latestReview.shoe}
                            </div>
                            <div>{brand.latestReview.date}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No reviews</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="text-center space-x-4">
        <Link
          href="/admin"
          className="inline-block bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Back to Admin
        </Link>
        <Link
          href="/reviews"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Browse All Reviews
        </Link>
      </div>
    </div>
  );
}
