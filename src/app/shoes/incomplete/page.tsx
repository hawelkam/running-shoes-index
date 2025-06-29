import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import ShoeTableElement from "../_components/ShoeTableElement";
import ShoeTableCard from "../_components/ShoeTableCard";
import GenericPagination from "@/_components/GenericPagination";
import GenericFilters from "../_components/GenericFilters";
import ResultsCount from "../_components/ResultsCount";
import {
  FilterParams,
  buildFilterConditions,
  hasActiveFilters,
} from "@/_utils/filterUtils";
import { getCategories } from "../_actions/getCategories";

const ITEMS_PER_PAGE = 10;

interface IncompletePageProps {
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

async function getData(
  page: number = 1,
  filters: FilterParams = {}
): Promise<{ shoes: SanityRunningShoe[]; totalCount: number }> {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE - 1;

  // Base conditions for incomplete shoes
  const baseIncompleteConditions = [
    '_type == "runningShoe"',
    `(
      !defined(releaseInfo)
      || !defined(releaseInfo.pl)
      || !defined(releaseInfo.eu)
      || !defined(releaseInfo.us)
      || !defined(releaseInfo.pl.date)
      || !defined(releaseInfo.eu.date)
      || !defined(releaseInfo.us.date)
      || !defined(releaseInfo.pl.price)
      || !defined(releaseInfo.eu.price)
      || !defined(releaseInfo.us.price)
      || !defined(category)
      || !defined(image)
      || !defined(specs)
      || !defined(specs.m)
      || !defined(specs.w)
      || !defined(specs.m.weight)
      || !defined(specs.w.weight)
      || !defined(specs.m.drop)
      || !defined(specs.w.drop)
      || !defined(specs.m.heelStack)
      || !defined(specs.w.heelStack)
      || !defined(specs.upper)
      || !defined(specs.foam)
      || !defined(specs.plate)
      || !defined(specs.outsole)
    )`,
  ];

  // Build filter conditions
  const filterConditions = buildFilterConditions(
    baseIncompleteConditions,
    filters
  );
  const whereClause = filterConditions.join(" && ");

  // Get total count
  const countQuery = `count(*[${whereClause}])`;
  const totalCount = await client.fetch<number>(
    countQuery,
    {},
    { next: { revalidate: 30 } }
  );

  // Get paginated data
  const query = `*[${whereClause}]|order(lower(name) asc)[${start}...${end + 1}]{_id, name, slug, purpose, category[]->, releaseInfo, image, review, specs}`;
  const data = await client.fetch<SanityRunningShoe[]>(
    query,
    {},
    { next: { revalidate: 30 } }
  );

  return { shoes: data || [], totalCount };
}

export default async function Shoes(props: IncompletePageProps) {
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
  const [categories, { shoes, totalCount }] = await Promise.all([
    getCategories(),
    getData(currentPage, filters),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const activeFilters = hasActiveFilters(filters);

  return (
    <Suspense>
      <div className="w-full">
        {/* Header with max width */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Incomplete Shoes Data
            </h1>
            <p className="text-gray-600">
              Shoes missing important information ({totalCount} total)
            </p>
          </header>

          <GenericFilters
            basePath="/shoes/incomplete"
            title="Filter Incomplete Shoes"
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
              basePath="/shoes/incomplete"
            />
          )}
        </div>
      </div>
    </Suspense>
  );
}
