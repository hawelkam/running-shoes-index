import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import Filters from "./_components/Filters";
import ResultsCount from "./_components/ResultsCount";
import ShoeTableElement from "./_components/ShoeTableElement";
import ShoeTableCard from "./_components/ShoeTableCard";
import GenericPagination from "@/_components/GenericPagination";
import Link from "next/link";
import { getCategories } from "./_actions/getCategories";
import {
  FilterParams,
  buildFilterConditions,
  hasActiveFilters,
} from "@/_utils/filterUtils";
import { CACHE_OPTIONS } from "@/_utils/cache";

interface ShoesPageProps {
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

const ITEMS_PER_PAGE = 20;

async function getData(page: number = 1, filters: FilterParams = {}) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE - 1;

  // Build filter conditions using the utility function
  const baseConditions = ['_type == "runningShoe"', "defined(slug.current)"];
  const filterConditions = buildFilterConditions(baseConditions, filters);
  const whereClause = filterConditions.join(" && ");

  // Get total count
  const countQuery = `count(*[${whereClause}])`;
  const totalCount = await client.fetch<number>(
    countQuery,
    {},
    CACHE_OPTIONS.SHORT // Frequently changing data
  );

  // Get paginated data
  const query = `*[${whereClause}]|order(lower(name) asc)[${start}...${end + 1}]{_id, name, slug, purpose, categories[], releaseInfo, specs, image, review}`;

  const data = await client.fetch<SanityRunningShoe[]>(
    query,
    {},
    CACHE_OPTIONS.SHORT // Frequently changing data
  );

  return {
    shoes: data,
    totalCount,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
  };
}

export default async function Shoes(props: ShoesPageProps) {
  const searchParams = await props.searchParams;
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

  // Fetch categories and shoes data in parallel
  const [categories, { shoes, totalCount, totalPages }] = await Promise.all([
    getCategories(),
    getData(currentPage, filters),
  ]);

  // Check if any filters are active
  const activeFilters = hasActiveFilters(filters);

  return (
    <Suspense>
      <div className="w-full">
        {/* Header and controls with max width */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Running Shoe Catalog
              </h1>
              <p className="text-gray-600">
                Find your perfect running companion
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href="/shoes/compare"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
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
                Compare Shoes
              </Link>
            </div>
          </header>

          <Filters categories={categories} />

          <ResultsCount
            totalCount={totalCount}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            showingCount={shoes.length}
            hasFilters={activeFilters}
          />
        </div>

        {/* Table with same width as filters */}
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

        {/* Card view and pagination with max width */}
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="card-view grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {shoes.map((shoe) => (
              <ShoeTableCard key={shoe._id} shoe={shoe} />
            ))}
          </div>

          <GenericPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={ITEMS_PER_PAGE}
            basePath="/shoes"
          />
        </div>
      </div>
    </Suspense>
  );
}
