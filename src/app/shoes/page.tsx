import ListView from "@/_components/ListView";
import { client } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import ShoesListItem from "./_components/ShoesListItem";
import ShoesListHeader from "./_components/ShoesListHeader";
import Link from "next/link";
import { Suspense } from "react";

export type SanityRunningShoe = SanityDocument & {
  name: string;
  brand: { name: string };
  shoeType: { name: string };
  releaseInfo: {
    pl: { date: string; price: number };
    eu: { date: string; price: number };
    us: { date: string; price: number };
  };
  stability: string;
  category?: { name: string }[];
  wideAvailable: boolean;
  waterproofAvailable: boolean;
  specs: {
    m?: { weight?: number; drop?: number; heelStack?: number };
    w?: { weight?: number; drop?: number; heelStack?: number };
    upper?: { name: string }[];
    foam?: { name: string }[];
    plate: string;
    outsole?: { name: string }[];
  };
  slug: { current: string };
  notes: string;
  image: { url: string };
  previousVersion: {
    name: string;
    slug: { current: string };
    releaseInfo: {
      pl: { date: string; price: number };
      eu: { date: string; price: number };
      us: { date: string; price: number };
    };
    image: { url: string };
  };
  review: {
    shoeInfo: { weight: number; sizeUS: number; sizeEU: number };
    plReview: { youtube: string; instagram: string; tiktok: string };
    enReview: { youtube: string; instagram: string; tiktok: string };
  };
};

async function getData(lastPageNum: number = 1) {
  const query = `*[_type == "runningShoe" && defined(slug.current)]|order(lower(name) asc)[${lastPageNum * 10}...${lastPageNum * 10 + 10}]{_id, name, slug, image}`;

  const data = await client.fetch<SanityRunningShoe[]>(
    query,
    { lastId: lastPageNum },
    { next: { revalidate: 30 } }
  );
  return data;
}

export default async function Shoes({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const page = Number((await searchParams)?.page ?? 0);
  const shoes = await getData(page);

  return (
    <Suspense>
      <main className="container mx-auto min-h-screen max-w-3xl p-8">
        <h1 className="text-4xl font-bold mb-8">Running Shoes Index</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            All Shoes
          </button>
          <Link href="/shoes/2025">
            <button
              type="button"
              className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              2025
            </button>
          </Link>
          <Link href="/shoes/2024">
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
        <ListView
          listViewHeader={<ShoesListHeader />}
          listViewItems={shoes.map((shoe) => (
            <ShoesListItem shoe={shoe} key={shoe._id} />
          ))}
        />
      </main>
    </Suspense>
  );
}
