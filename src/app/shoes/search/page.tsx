import SearchResults from "@/_components/SearchResults";
import React, { Suspense } from "react";

const SearchResultsPage = () => {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
};

export default SearchResultsPage;
