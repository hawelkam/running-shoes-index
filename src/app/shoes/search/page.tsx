import { getCategories } from "@/actions/getCategories";
import SearchResults from "@/components/layout/SearchResults";
import React, { Suspense } from "react";

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

const SearchResultsPage = async ({ searchParams }: SearchPageProps) => {
  const resolvedSearchParams = await searchParams;
  console.log("Search Params:", resolvedSearchParams);

  // Fetch categories on the server side
  const categories = await getCategories();

  return (
    <Suspense>
      <SearchResults categories={categories} />
    </Suspense>
  );
};

export default SearchResultsPage;
