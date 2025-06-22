import { Suspense } from "react";
import ShoeCompareClient from "./_components/ShoeCompareClient";

export default function CompareShoesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Compare Running Shoes
        </h1>
        <p className="text-gray-600">
          Select two shoes to compare their specifications side by side
        </p>
      </header>

      <Suspense fallback={<div>Loading...</div>}>
        <ShoeCompareClient />
      </Suspense>
    </div>
  );
}
