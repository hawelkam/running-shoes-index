import React from "react";

const ResultsCount = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <p className="text-gray-600 mb-2 sm:mb-0">
        <span id="resultCount">6</span> shoes found
      </p>
      <div className="flex items-center">
        <label htmlFor="sort" className="mr-2 text-gray-600">
          Sort by:
        </label>
        <select
          id="sort"
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
