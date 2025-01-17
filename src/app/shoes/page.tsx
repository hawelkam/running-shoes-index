import { client } from "@/sanity/client";
import Link from "next/link";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import ShoesTable from "./_components/ShoesTable";
import { mapToRunningShoe } from "@/_utils/runningShoeMapper";

async function getData() {
  const query = `*[_type == "runningShoe" && defined(slug.current)]|order(lower(name) asc)[0...400]{_id, name, slug, shoeType->, category[]->, releaseInfo, image, review}`;

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
      <main>
        <h1 className="text-4xl font-bold mb-8">Running Shoes Index</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            All Shoes
          </button>
          <Link href="/shoes/released/eu/2025">
            <button
              type="button"
              className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              2025
            </button>
          </Link>
          <Link href="/shoes/released/eu/2024">
            <button
              type="button"
              className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              2024
            </button>
          </Link>
          <button
            type="button"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            This month
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-8">All items</h2>
        <ShoesTable shoes={shoes.map((shoe) => mapToRunningShoe(shoe))} />
      </main>
    </Suspense>
  );
}
