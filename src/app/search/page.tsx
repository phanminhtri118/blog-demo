import { Suspense } from "react";
import SearchPageClient from "@/features/search/components/search-page-client";

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageClient />
    </Suspense>
  );
};

export default SearchPage;
