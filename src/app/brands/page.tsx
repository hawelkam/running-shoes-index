import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";
import BrandsTable from "./_components/BrandsTable";

const BRANDS_QUERY = `*[
  _type == "brand" && defined(slug.current)
]|order(releaseDate desc)[0...12]{_id, slug, name, image}`;

const options = { next: { revalidate: 30 } };

export type SanityBrand = SanityDocument & {
  name: string;
};

export default async function BrandsPage() {
  const brands = await client.fetch<SanityBrand[]>(BRANDS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-5xl p-8">
      <h1 className="text-4xl font-bold mb-8">Running Shoe Brands</h1>
      <BrandsTable brands={brands} />
    </main>
  );
}
