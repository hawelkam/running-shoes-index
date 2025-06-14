import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import Filters from "./_components/Filters";
import ResultsCount from "./_components/ResultsCount";
import ShoeTableElement from "./_components/ShoeTableElement";
import ShoeTableCard from "./_components/ShoeTableCard";
import GenericPagination from "@/_components/GenericPagination";

interface ShoesPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 20;

async function getData(page: number = 1) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE - 1;

  // Get total count
  const countQuery = `count(*[_type == "runningShoe" && defined(slug.current)])`;
  const totalCount = await client.fetch<number>(
    countQuery,
    {},
    { next: { revalidate: 30 } }
  );

  // Get paginated data
  const query = `*[_type == "runningShoe" && defined(slug.current)]|order(lower(name) asc)[${start}...${end + 1}]{_id, name, slug, shoeType->, category[]->, releaseInfo, specs, image, review}`;

  const data = await client.fetch<SanityRunningShoe[]>(
    query,
    {},
    { next: { revalidate: 30 } }
  );

  return {
    shoes: data,
    totalCount,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
  };
}

export default async function Shoes(props: ShoesPageProps) {
  const searchParams = await props.searchParams;
  const currentPage = parseInt(searchParams.page || "1", 10);
  const { shoes, totalCount, totalPages } = await getData(currentPage);

  return (
    <Suspense>
      <div className="w-full">
        {/* Header and controls with max width */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Running Shoe Catalog
            </h1>
            <p className="text-gray-600">Find your perfect running companion</p>
          </header>

          <Filters />

          <ResultsCount />
        </div>

        {/* Table with same width as filters */}
        <div className="container mx-auto px-4 mb-8 max-w-7xl">
          <div className="overflow-x-auto table-view">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 font-semibold text-gray-700">Image</th>
                  <th className="p-4 font-semibold text-gray-700">Name</th>
                  <th className="p-4 font-semibold text-gray-700">Category</th>
                  <th className="p-4 font-semibold text-gray-700">Price</th>
                  <th className="p-4 font-semibold text-gray-700">Weight</th>
                  <th className="p-4 font-semibold text-gray-700">Drop</th>
                  <th className="p-4 font-semibold text-gray-700">Reviewed</th>
                </tr>
              </thead>
              <tbody>
                {shoes.map((shoe) => (
                  <ShoeTableElement key={shoe._id} shoe={shoe} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card view and pagination with max width */}
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="card-view grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {shoes.map((shoe) => (
              <ShoeTableCard key={shoe._id} shoe={shoe} />
            ))}
          </div>

          <GenericPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={ITEMS_PER_PAGE}
            basePath="/shoes"
          />
        </div>
      </div>
    </Suspense>
  );
}
