import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import ShoeTableElement from "../../_components/ShoeTableElement";
import ShoeTableCard from "../../_components/ShoeTableCard";
import GenericPagination from "@/_components/GenericPagination";
import GenericFilters from "../../_components/GenericFilters";
import ResultsCount from "../../_components/ResultsCount";
import {
  FilterParams,
  buildFilterConditions,
  hasActiveFilters,
} from "@/_utils/filterUtils";

const ITEMS_PER_PAGE = 10;

interface ReviewedPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    category?: string;
    priceMin?: string;
    priceMax?: string;
    weightMin?: string;
    weightMax?: string;
    dropMin?: string;
    dropMax?: string;
    reviewed?: string;
    search?: string;
  }>;
}

interface Review {
  _id: string;
  reviewDate: string;
  shoe: {
    _id: string;
    name: string;
    slug: { current: string };
    image?: { url: string };
  };
}

async function getReviews(slug: string): Promise<Review[]> {
  // If slug is "all", get all reviews
  if (slug === "all") {
    const query = `*[
      _type == "runningShoeReview"
    ]{
      _id,
      reviewDate,
      shoe->{_id, name, slug, image}
    }`;

    try {
      const reviews = await client.fetch<Review[]>(
        query,
        {},
        { next: { revalidate: 60 } }
      );
      return reviews || [];
    } catch (error) {
      console.error("Failed to fetch all reviews:", error);
      return [];
    }
  }

  // If slug is not a 4-digit year, return empty array
  if (!/^\d{4}$/.test(slug)) return [];

  const startDate = `${slug}-01-01`;
  const endDate = `${slug}-12-31`;

  const query = `*[
    _type == "runningShoeReview" &&
    reviewDate >= "${startDate}" &&
    reviewDate <= "${endDate}"
  ]{
    _id,
    reviewDate,
    shoe->{_id, name, slug, image}
  }`;

  try {
    const reviews = await client.fetch<Review[]>(
      query,
      {},
      { next: { revalidate: 60 } }
    );
    return reviews || [];
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
}

async function getShoesFromReviews(
  slug: string,
  page: number = 1,
  filters: FilterParams = {}
): Promise<{ shoes: SanityRunningShoe[]; totalCount: number }> {
  // Get reviews first
  const reviews = await getReviews(slug);

  if (reviews.length === 0) {
    return { shoes: [], totalCount: 0 };
  }

  // Extract shoe IDs from reviews
  const shoeIds = reviews.map((review: Review) => review.shoe._id);

  // Build base conditions for shoes that have reviews
  const baseConditions = [
    '_type == "runningShoe"',
    "defined(slug.current)",
    `_id in [${shoeIds.map((id: string) => `"${id}"`).join(", ")}]`,
  ];

  // Build filter conditions
  const filterConditions = buildFilterConditions(baseConditions, filters);
  const whereClause = filterConditions.join(" && ");

  try {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    // Get total count
    const countQuery = `count(*[${whereClause}])`;
    const totalCount = await client.fetch<number>(
      countQuery,
      {},
      { next: { revalidate: 60 } }
    );

    // Get paginated data
    const dataQuery = `*[${whereClause}]|order(lower(name) asc)[${start}...${end + 1}]{
      _id, name, slug, purpose, categories[], releaseInfo, specs, image
    }`;
    const shoes = await client.fetch<SanityRunningShoe[]>(
      dataQuery,
      {},
      { next: { revalidate: 60 } }
    );

    return { shoes: shoes || [], totalCount };
  } catch (error) {
    console.error("Failed to fetch shoes:", error);
    return { shoes: [], totalCount: 0 };
  }
}

const ReviewedInYear = async (props: ReviewedPageProps) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;
  const currentPage = parseInt(searchParams.page || "1", 10);

  const filters: FilterParams = {
    category: searchParams.category,
    priceMin: searchParams.priceMin,
    priceMax: searchParams.priceMax,
    weightMin: searchParams.weightMin,
    weightMax: searchParams.weightMax,
    dropMin: searchParams.dropMin,
    dropMax: searchParams.dropMax,
    reviewed: searchParams.reviewed,
    search: searchParams.search,
  };

  const { shoes, totalCount } = await getShoesFromReviews(
    slug,
    currentPage,
    filters
  );
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const activeFilters = hasActiveFilters(filters);

  return (
    <Suspense>
      <div className="w-full">
        {/* Header with max width */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Stride Lab
            </h1>
            <h2 className="text-xl text-gray-600">
              Shoes of {slug} reviewed by me ({totalCount} total)
            </h2>
          </header>

          <GenericFilters
            basePath={`/shoes/reviewed/${slug}`}
            title="Filter Reviewed Shoes"
            hideFilters={["reviewed"]} // Hide reviewed filter since all are reviewed
          />

          <ResultsCount
            totalCount={totalCount}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            showingCount={shoes.length}
            hasFilters={activeFilters}
          />
        </div>

        {/* Table with same width as header */}
        <div className="container mx-auto px-4 mb-8 max-w-7xl">
          <div className="overflow-x-auto table-view">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 font-semibold text-gray-700">Image</th>
                  <th className="p-4 font-semibold text-gray-700">Name</th>
                  <th className="p-4 font-semibold text-gray-700">Category</th>
                  <th className="p-4 font-semibold text-gray-700">Price</th>
                  <th className="p-4 font-semibold text-gray-700">Weight</th>
                  <th className="p-4 font-semibold text-gray-700">Drop</th>
                </tr>
              </thead>
              <tbody>
                {shoes.map((shoe: SanityRunningShoe) => (
                  <ShoeTableElement key={shoe._id} shoe={shoe} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card view with max width */}
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="card-view grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {shoes.map((shoe: SanityRunningShoe) => (
              <ShoeTableCard key={shoe._id} shoe={shoe} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <GenericPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={ITEMS_PER_PAGE}
              basePath={`/shoes/reviewed/${slug}`}
            />
          )}
        </div>
      </div>
    </Suspense>
  );
};

export async function generateStaticParams() {
  try {
    return ["2024", "2025"].map((year) => ({ slug: year }));
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    return [];
  }
}

export default ReviewedInYear;
