"use client";

import { useState, useEffect } from "react";

import { SanityRunningShoe } from "@/types/RunningShoe";

import ShoeComparisonDisplay from "./ShoeComparisonDisplay";
import ShoeSelector from "./ShoeSelector";

export default function ShoeCompareClient() {
  const [shoes, setShoes] = useState<SanityRunningShoe[]>([]);
  const [selectedShoe1, setSelectedShoe1] = useState<SanityRunningShoe | null>(
    null
  );
  const [selectedShoe2, setSelectedShoe2] = useState<SanityRunningShoe | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchShoes();
  }, []);

  const fetchShoes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/shoes");
      if (!response.ok) {
        throw new Error("Failed to fetch shoes");
      }
      const data = (await response.json()) as SanityRunningShoe[];
      setShoes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading shoes: {error}</p>
        <button
          onClick={() => {
            void fetchShoes();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Shoe Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Select First Shoe</h2>
          <ShoeSelector
            shoes={shoes}
            selectedShoe={selectedShoe1}
            onShoeSelect={setSelectedShoe1}
            placeholder="Search for first shoe..."
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Select Second Shoe</h2>
          <ShoeSelector
            shoes={shoes}
            selectedShoe={selectedShoe2}
            onShoeSelect={setSelectedShoe2}
            placeholder="Search for second shoe..."
          />
        </div>
      </div>

      {/* Comparison Display */}
      {selectedShoe1 && selectedShoe2 && (
        <ShoeComparisonDisplay shoe1={selectedShoe1} shoe2={selectedShoe2} />
      )}

      {/* Instructions */}
      {(!selectedShoe1 || !selectedShoe2) && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Select two shoes from the dropdowns above to compare their
            specifications
          </p>
        </div>
      )}
    </div>
  );
}
