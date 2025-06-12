import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";
import BrandsWithSearch from "./_components/BrandsWithSearch";

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Running Shoe Brands
        </h1>
        <p className="text-gray-600">
          Discover the world&apos;s leading running shoe manufacturers
        </p>
      </header>

      <BrandsWithSearch brands={brands} />
    </div>
  );
}
