"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

let page = 0;

function PaginationControls() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPage = () => {
    if (page === 20) {
      return;
    } else {
      page = page + 1;
    }
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params}`, { scroll: false });
  };
  const prevPage = () => {
    console.log("page: ", page);
    if (page === 0) {
      return;
    } else {
      page = page - 1;
    }
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params}`, { scroll: false });
  };

  return (
    <div className="flex gap-4 justify-center my-4">
      <button
        type="button"
        className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        onClick={prevPage}
      >
        Previous page
      </button>
      <button
        type="button"
        className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        onClick={nextPage}
      >
        Next page
      </button>
    </div>
  );
}

export default PaginationControls;
