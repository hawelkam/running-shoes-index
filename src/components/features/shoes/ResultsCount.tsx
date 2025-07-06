import React from "react";

interface ResultsCountProps {
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  showingCount: number;
  hasFilters: boolean;
}

const ResultsCount = ({
  totalCount,
  currentPage,
  itemsPerPage,
  showingCount,
  hasFilters,
}: ResultsCountProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <p className="text-gray-600 mb-2 sm:mb-0">
        {hasFilters ? (
          <>
            Showing <span className="font-semibold">{showingCount}</span> of{" "}
            <span className="font-semibold">{totalCount}</span> shoes
            {totalCount > itemsPerPage && (
              <span className="text-sm text-gray-500 ml-1">
                (items {startItem}-{endItem})
              </span>
            )}
          </>
        ) : (
          <>
            <span className="font-semibold">{totalCount}</span> shoes found
            {totalCount > itemsPerPage && (
              <span className="text-sm text-gray-500 ml-1">
                (showing {startItem}-{endItem})
              </span>
            )}
          </>
        )}
      </p>
      <div className="flex items-center">
        <label htmlFor="sort" className="mr-2 text-gray-600">
          Sort by:
        </label>
        <select
          id="sort"
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled
        >
          <option value="name">Name (A-Z)</option>
          <option value="price-low">Price (Low to High)</option>
          <option value="price-high">Price (High to Low)</option>
          <option value="weight-low">Weight (Low to High)</option>
        </select>
      </div>
    </div>
  );
};

export default ResultsCount;
