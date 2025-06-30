import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import GenericFilters from "./GenericFilters";
import ResultsCount from "./ResultsCount";
import ShoeTableElement from "./ShoeTableElement";
import ShoeTableCard from "./ShoeTableCard";
import GenericPagination from "@/_components/GenericPagination";
import {
  FilterParams,
  buildFilterConditions,
  hasActiveFilters,
} from "@/_utils/filterUtils";
import { getCategories } from "../_actions/getCategories";

interface ShoePurposePageProps {
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
  config: ShoePurposeConfig;
}

interface ShoePurposeConfig {
  purpose: string;
  title: string;
  description: string;
  basePath: string;
}

const ITEMS_PER_PAGE = 20;

async function getData(
  page: number = 1,
  filters: FilterParams = {},
  purpose: string
) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE - 1;

  // Build filter conditions with specific shoe type base condition
  const baseConditions = [
    '_type == "runningShoe"',
    "defined(slug.current)",
    `purpose == "${purpose}"`,
  ];

  const filterConditions = buildFilterConditions(baseConditions, filters);
  const whereClause = filterConditions.join(" && ");

  // Get total count
  const countQuery = `count(*[${whereClause}])`;
  const totalCount = await client.fetch<number>(
    countQuery,
    {},
    { next: { revalidate: 30 } }
  );

  // Get paginated data
  const query = `*[${whereClause}]|order(lower(name) asc)[${start}...${end + 1}]{_id, name, slug, purpose, categories[], releaseInfo, specs, image, review}`;

  const data = await client.fetch<SanityRunningShoe[]>(
    query,
    {},
    { next: { revalidate: 30 } }
  );

  return {
    shoes: data,
    totalCount,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
  };
}

export default async function ShoeTypePageLayout(props: ShoePurposePageProps) {
  const { config } = props;
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
    getData(currentPage, filters, config.purpose),
  ]);

  // Check if any filters are active
  const activeFilters = hasActiveFilters(filters);

  return (
    <Suspense>
      <div className="w-full">
        {/* Header and controls with max width */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {config.title}
            </h1>
            <p className="text-gray-600">{config.description}</p>
          </header>

          <GenericFilters
            basePath={config.basePath}
            title={`Filter ${config.title}`}
            categories={categories}
          />

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
            basePath={config.basePath}
          />
        </div>
      </div>
    </Suspense>
  );
}

export type { ShoePurposePageProps, ShoePurposeConfig };
