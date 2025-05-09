import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";
import BrandsTable from "./_components/BrandsTable";

const BRANDS_QUERY = `*[
  _type == "brand" && defined(slug.current)
]|order(lower(name) asc)[0...30]{_id, slug, name, image}`;

const options = { next: { revalidate: 30 } };

export type SanityBrand = SanityDocument & {
  name: string;
  slug: { current: string };
  image: { url: string };
  country: string;
  usWebsite: string;
  euWebsite: string;
  plWebsite: string;
  usMediaContact: string;
  euMediaContact: string;
  plMediaContact: string;
};

export default async function BrandsPage() {
  const brands = await client.fetch<SanityBrand[]>(BRANDS_QUERY, {}, options);

  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold mb-8">Running Shoe Brands</h1>
      <BrandsTable brands={brands} />
    </main>
  );
}
