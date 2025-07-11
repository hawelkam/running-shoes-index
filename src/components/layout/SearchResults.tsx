"use client";

import React, { useEffect, useState } from "react";
import { Alert, Empty, Spin } from "antd";
import { useSearchParams } from "next/navigation";

import { SanityRunningShoe } from "@/types/RunningShoe";
import ShoeTableElement from "@/components/features/shoes/ShoeTableElement";
import ShoeTableCard from "@/components/features/shoes/ShoeTableCard";
import GenericFilters from "@/components/features/shoes/GenericFilters";
import ResultsCount from "@/components/features/shoes/ResultsCount";
import { client } from "@/sanity/client";
import {
  FilterParams,
  buildFilterConditions,
  hasActiveFilters,
} from "@/utils/filterUtils";
import { Category } from "@/actions/getCategories";
import GenericPagination from "@/components/common/GenericPagination";

const ITEMS_PER_PAGE = 10;

interface SearchResultsProps {
  categories?: Category[];
}

const SearchResults = ({ categories = [] }: SearchResultsProps) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  // Get filter parameters from URL, memoized to avoid unnecessary re-renders
  const filters: FilterParams = React.useMemo(
    () => ({
      category: searchParams.get("category") ?? "",
      priceMin: searchParams.get("priceMin") ?? "",
      priceMax: searchParams.get("priceMax") ?? "",
      weightMin: searchParams.get("weightMin") ?? "",
      weightMax: searchParams.get("weightMax") ?? "",
      dropMin: searchParams.get("dropMin") ?? "",
      dropMax: searchParams.get("dropMax") ?? "",
      reviewed: searchParams.get("reviewed") ?? "",
      search: query, // Use the main query as search filter
    }),
    [searchParams, query]
  );

  const [shoes, setShoes] = useState<SanityRunningShoe[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const activeFilters = hasActiveFilters(filters);

  useEffect(() => {
    async function getShoes(
      searchQuery: string,
      page: number = 1,
      filters: FilterParams = {}
    ) {
      if (!searchQuery.trim()) {
        setShoes([]);
        setTotalCount(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE - 1;

        // Base search conditions
        const baseSearchConditions = [
          '_type == "runningShoe"',
          "defined(slug.current)",
          `(name match "*${searchQuery}*" ||
           purpose match "*${searchQuery}*" ||
           category[]->name match "*${searchQuery}*")`,
        ];

        // Build filter conditions
        const filterConditions = buildFilterConditions(
          baseSearchConditions,
          filters
        );
        const whereClause = filterConditions.join(" && ");

        // Get total count
        const countQuery = `count(*[${whereClause}])`;
        const totalCount = await client.fetch<number>(
          countQuery,
          {},
          { next: { revalidate: 60 } }
        );
        setTotalCount(totalCount);

        // Get paginated data
        const query = `*[${whereClause}]|order(lower(name) asc)[${start}...${end + 1}]{
          _id, name, slug, purpose, category[]->, releaseInfo, specs, image
        }`;
        const data = await client.fetch<SanityRunningShoe[]>(
          query,
          {},
          { next: { revalidate: 60 } }
        );
        setShoes(data || []);
      } catch (error) {
        console.error("Failed to fetch shoes:", error);
        setError("Failed to search shoes. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    void getShoes(query || "", currentPage, filters);
  }, [query, currentPage, filters]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!query?.trim()) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Empty description="Enter a search term to find shoes" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Search Results
        </h1>
        <p className="text-gray-600">
          {totalCount > 0
            ? `Found ${totalCount} shoes matching "${query}"`
            : `No shoes found matching "${query}"`}
        </p>
      </header>

      <GenericFilters
        basePath="/shoes/search"
        title="Filter Search Results"
        hideFilters={["search"]} // Hide search filter since it's handled by the main search
        categories={categories}
      />

      <ResultsCount
        totalCount={totalCount}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        showingCount={shoes.length}
        hasFilters={activeFilters}
      />

      {shoes.length > 0 ? (
        <>
          {/* Table view for desktop */}
          <div className="overflow-x-auto table-view mb-8">
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

          {/* Card view for mobile */}
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
              basePath={`/search?query=${encodeURIComponent(query || "")}`}
            />
          )}
        </>
      ) : (
        <Empty
          description={`No shoes found matching "${query}"`}
          className="my-12"
        />
      )}
    </div>
  );
};

export default SearchResults;
