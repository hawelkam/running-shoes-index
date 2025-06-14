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

async function getShoes(
  slug: string,
  page: number = 1,
  filters: FilterParams = {}
): Promise<{ shoes: SanityRunningShoe[]; totalCount: number }> {
  // Base conditions for reviewed shoes
  let baseReviewedConditions: string[];

  if (slug === "all") {
    baseReviewedConditions = [
      '_type == "runningShoe"',
      "defined(slug.current)",
      "defined(review)",
    ];
  } else {
    baseReviewedConditions = [
      '_type == "runningShoe"',
      "defined(slug.current)",
      "defined(review)",
      `((releaseInfo.pl.date > "${slug}-01-00" && releaseInfo.pl.date < "${slug}-12-32") ||
       (releaseInfo.eu.date > "${slug}-01-00" && releaseInfo.eu.date < "${slug}-12-32") ||
       (releaseInfo.us.date > "${slug}-01-00" && releaseInfo.us.date < "${slug}-12-32"))`,
    ];
  }

  // Build filter conditions
  const filterConditions = buildFilterConditions(
    baseReviewedConditions,
    filters
  );
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
      _id, name, slug, shoeType->, category[]->, releaseInfo, specs, image, review
    }`;
    const shoes = await client.fetch<SanityRunningShoe[]>(
      dataQuery,
      {},
      { next: { revalidate: 60 } }
    );

    return { shoes: shoes || [], totalCount };
  } catch (error) {
    console.error("Failed to fetch shoe:", error);
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

  const { shoes, totalCount } = await getShoes(slug, currentPage, filters);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const activeFilters = hasActiveFilters(filters);

  return (
    <Suspense>
      <div className="w-full">
        {/* Header with max width */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Running Shoes Index
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
                  <th className="p-4 font-semibold text-gray-700">Reviewed</th>
                </tr>
              </thead>
              <tbody>
                {shoes.map((shoe) => (
                  <ShoeTableElement key={shoe._id} shoe={shoe} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card view with max width */}
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="card-view grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {shoes.map((shoe) => (
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
