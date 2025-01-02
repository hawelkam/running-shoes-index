import ListView from "@/_components/ListView";
import { client } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import ShoesListItem from "./_components/ShoesListItem";
import ShoesListHeader from "./_components/ShoesListHeader";

const SHOES_QUERY = `*[
  _type == "runningShoe" && defined(slug.current)
]|order(lower(name) asc)[0...400]{_id, name, slug, releaseDateEU, image}`;

export type SanityRunningShoe = SanityDocument & {
  name: string;
  brand: { name: string };
  shoeType: { name: string };
  pricePln: number;
  priceEur: number;
  priceUsd: number;
  stability: string;
  category?: { name: string }[];
  wideAvailable: boolean;
  waterproofAvailable: boolean;
  weightM: number;
  dropM: number;
  heelStackM: number;
  weightW: number;
  dropW: number;
  heelStackW: number;
  slug: { current: string };
  releaseDatePL: string;
  releaseDateEU: string;
  upper: { name: string }[];
  foam: { name: string }[];
  plate: string;
  outsole?: { name: string }[];
  notes: string;
  image: { url: string };
  previousVersion: { name: string; slug: { current: string } };
  reviewedWeight: number;
  reviewedSize: number;
  ytReviewEN: string;
  ytReviewPL: string;
  igReviewPL: string;
  igReviewEN: string;
  ttReviewPL: string;
  ttReviewEN: string;
};

//TODO: add links to specific shoe types
//TODO: add pagination

export default async function Shoes() {
  const shoes = await client.fetch<SanityRunningShoe[]>(
    SHOES_QUERY,
    {},
    { next: { revalidate: 30 } }
  );

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Running Shoes Index</h1>
      <div className="flex gap-2">
        <button
          type="button"
          className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          All Shoes
        </button>
        <button
          type="button"
          className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          2025
        </button>
        <button
          type="button"
          className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          2024
        </button>
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
  );
}
