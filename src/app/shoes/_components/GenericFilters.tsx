"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "../_actions/getCategories";

interface FilterState {
  category: string;
  priceMin: string;
  priceMax: string;
  weightMin: string;
  weightMax: string;
  dropMin: string;
  dropMax: string;
  reviewed: string;
  search: string;
}

interface GenericFiltersProps {
  basePath: string;
  title?: string;
  hideFilters?: string[]; // Array of filter names to hide
  categories?: Category[]; // Categories from server
}

const GenericFilters = ({
  basePath,
  title = "Filters",
  hideFilters = [],
  categories = [],
}: GenericFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    priceMin: "",
    priceMax: "",
    weightMin: "",
    weightMax: "",
    dropMin: "",
    dropMax: "",
    reviewed: "",
    search: "",
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    setFilters({
      category: searchParams.get("category") || "",
      priceMin: searchParams.get("priceMin") || "",
      priceMax: searchParams.get("priceMax") || "",
      weightMin: searchParams.get("weightMin") || "",
      weightMax: searchParams.get("weightMax") || "",
      dropMin: searchParams.get("dropMin") || "",
      dropMax: searchParams.get("dropMax") || "",
      reviewed: searchParams.get("reviewed") || "",
      search: searchParams.get("search") || "",
    });
  }, [searchParams]);

  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());

    // Add non-empty filter values to URL
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (Array.from(params.keys()).some((key) => key !== "page")) {
      params.set("page", "1");
    }

    const newURL = params.toString()
      ? `${basePath}?${params.toString()}`
      : basePath;

    router.push(newURL);
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      category: "",
      priceMin: "",
      priceMax: "",
      weightMin: "",
      weightMax: "",
      dropMin: "",
      dropMax: "",
      reviewed: "",
      search: "",
    };
    setFilters(emptyFilters);
    router.push(basePath);
  };

  const toggleFilters = () => {
    setIsVisible(!isVisible);
  };

  const shouldShowFilter = (filterName: string) => {
    return !hideFilters.includes(filterName);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={toggleFilters}
            className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            {isVisible ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {isVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Search Filter */}
          {shouldShowFilter("search") && (
            <div className="md:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name
              </label>
              <input
                type="text"
                placeholder="Search shoes..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* Category Filter */}
          {shouldShowFilter("category") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price Filter */}
          {shouldShowFilter("price") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range (PLN)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) =>
                    handleFilterChange("priceMin", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) =>
                    handleFilterChange("priceMax", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Weight Filter */}
          {shouldShowFilter("weight") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (g)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.weightMin}
                  onChange={(e) =>
                    handleFilterChange("weightMin", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.weightMax}
                  onChange={(e) =>
                    handleFilterChange("weightMax", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Drop Filter */}
          {shouldShowFilter("drop") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Drop (mm)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.dropMin}
                  onChange={(e) =>
                    handleFilterChange("dropMin", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.dropMax}
                  onChange={(e) =>
                    handleFilterChange("dropMax", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Reviewed Filter */}
          {shouldShowFilter("reviewed") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reviewed Status
              </label>
              <select
                value={filters.reviewed}
                onChange={(e) => handleFilterChange("reviewed", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Shoes</option>
                <option value="yes">Reviewed</option>
                <option value="no">Not Reviewed</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenericFilters;
