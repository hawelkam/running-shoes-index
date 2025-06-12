import React from "react";

const Filters = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        <div className="flex flex-wrap gap-3">
          <button
            id="clearFilters"
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Clear Filters
          </button>
          <button
            id="toggleFilters"
            className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            Show/Hide Filters
          </button>
        </div>
      </div>

      <div
        id="filterOptions"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select className="filter-select w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Categories</option>
            <option value="Road">Road</option>
            <option value="Trail">Trail</option>
            <option value="Racing">Racing</option>
            <option value="Daily Trainer">Daily Trainer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range (PLN)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (g)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Drop (mm)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reviewed
          </label>
          <select className="filter-select w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All</option>
            <option value="yes">Reviewed</option>
            <option value="no">Not Reviewed</option>
          </select>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
