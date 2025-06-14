import SearchResults from "@/_components/SearchResults";
import React, { Suspense } from "react";

interface SearchPageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

const SearchResultsPage = async ({ searchParams }: SearchPageProps) => {
  const resolvedSearchParams = await searchParams;
  console.log("Search Params:", resolvedSearchParams);

  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
};

export default SearchResultsPage;
