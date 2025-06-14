import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import ShoeTableElement from "../_components/ShoeTableElement";
import ShoeTableCard from "../_components/ShoeTableCard";

async function getData() {
  const query = `*[_type == "runningShoe"
    && (
        !defined(releaseInfo)
        || !defined(releaseInfo.pl)
        || !defined(releaseInfo.eu)
        || !defined(releaseInfo.us)
        || !defined(releaseInfo.pl.date)
        || !defined(releaseInfo.eu.date)
        || !defined(releaseInfo.us.date)
        || !defined(releaseInfo.pl.price)
        || !defined(releaseInfo.eu.price)
        || !defined(releaseInfo.us.price)
        || !defined(category)
        || !defined(image)
        || !defined(specs)
        || !defined(specs.m)
        || !defined(specs.w)
        || !defined(specs.m.weight)
        || !defined(specs.w.weight)
        || !defined(specs.m.drop)
        || !defined(specs.w.drop)
        || !defined(specs.m.heelStack)
        || !defined(specs.w.heelStack)
        || !defined(specs.upper)
        || !defined(specs.foam)
        || !defined(specs.plate)
        || !defined(specs.outsole))
        ]|order(lower(name) asc)[0...400]{_id, name, slug, shoeType->, category[]->, releaseInfo, image, review, specs}`;

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
      <div className="w-full">
        {/* Header with max width */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Incomplete Shoes Data
            </h1>
            <p className="text-gray-600">Shoes missing important information</p>
          </header>
        </div>

        {/* Table with same width as header */}
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

        {/* Card view with max width */}
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="card-view grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {shoes.map((shoe) => (
              <ShoeTableCard key={shoe._id} shoe={shoe} />
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
