import ListView from "@/_components/ListView";
import { client } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import ShoesListItem from "./_components/ShoesListItem";
import ShoesListHeader from "./_components/ShoesListHeader";

const SHOES_QUERY = `*[
  _type == "runningShoe" && defined(slug.current)
]|order(lower(name) asc)[0...50]{_id, name, slug, releaseDatePL, image}`;

export type SanityRunningShoe = SanityDocument & {
  name: string;
  brand: { name: string };
  shoeType: { name: string };
  pricePln: number;
  priceEur: number;
  priceUsd: number;
  stability: string;
  category: string[];
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
  foam: string[];
  plate: string;
  outsole: string[];
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
      <ListView
        listViewHeader={<ShoesListHeader />}
        listViewItems={shoes.map((shoe) => (
          <ShoesListItem shoe={shoe} key={shoe._id} />
        ))}
      />
    </main>
  );
}
