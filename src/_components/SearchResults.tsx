"use client";

import { SanityRunningShoe } from "@/_types/RunningShoe";
import ShoeTableElement from "@/app/shoes/_components/ShoeTableElement";
import ShoeTableCard from "@/app/shoes/_components/ShoeTableCard";
import GenericPagination from "./GenericPagination";
import { client } from "@/sanity/client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Spin, Empty, Alert } from "antd";

const ITEMS_PER_PAGE = 10;

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [shoes, setShoes] = useState<SanityRunningShoe[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    async function getShoes(searchQuery: string, page: number = 1) {
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

        // Get total count
        const countQuery = `count(*[
            _type == "runningShoe" &&
            defined(slug.current) &&
            (name match "*${searchQuery}*" ||
             shoeType->name match "*${searchQuery}*" ||
             category[]->name match "*${searchQuery}*")
          ])`;

        const totalCount = await client.fetch<number>(
          countQuery,
          {},
          { next: { revalidate: 60 } }
        );
        setTotalCount(totalCount);

        // Get paginated data
        const data = await client.fetch<SanityRunningShoe[]>(
          `*[
            _type == "runningShoe" &&
            defined(slug.current) &&
            (name match "*${searchQuery}*" ||
             shoeType->name match "*${searchQuery}*" ||
             category[]->name match "*${searchQuery}*")
          ]|order(lower(name) asc)[${start}...${end + 1}]{
            _id, name, slug, shoeType->, category[]->, releaseInfo, specs, image, review
          }`,
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

    getShoes(query || "", currentPage);
  }, [query, currentPage]);

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
            ? `Found ${totalCount} shoes matching "${query}" (showing ${shoes.length} on page ${currentPage})`
            : `No shoes found matching "${query}"`}
        </p>
      </header>

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

          {/* Card view for mobile */}
          <div className="card-view grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
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
