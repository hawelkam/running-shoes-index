import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import Filters from "./_components/Filters";
import ResultsCount from "./_components/ResultsCount";
import ShoeTableElement from "./_components/ShoeTableElement";
import ShoeTableCard from "./_components/ShoeTableCard";

async function getData() {
  const query = `*[_type == "runningShoe" && defined(slug.current)]|order(lower(name) asc)[0...400]{_id, name, slug, shoeType->, category[]->, releaseInfo, specs, image, review}`;

  const data = await client.fetch<SanityRunningShoe[]>(
    query,
    {},
    { next: { revalidate: 30 } }
  );
  return data;
}

export default async function Shoes() {
  const shoes = await getData();

  return (
    <Suspense>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Running Shoe Catalog
          </h1>
          <p className="text-gray-600">Find your perfect running companion</p>
        </header>

        <Filters />

        <ResultsCount />

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
        <div className="card-view grid grid-cols-1 sm:grid-cols-2 gap-6">
          {shoes.map((shoe) => (
            <ShoeTableCard key={shoe._id} shoe={shoe} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-1">
            <a
              href="#"
              className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <a href="#" className="px-3 py-2 rounded-md bg-blue-600 text-white">
              1
            </a>
            <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-100">
              2
            </a>
            <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-100">
              3
            </a>
            <span className="px-3 py-2">...</span>
            <a href="#" className="px-3 py-2 rounded-md hover:bg-gray-100">
              8
            </a>
            <a
              href="#"
              className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </Suspense>
  );
}
