import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { SanityBrand } from "../page";
import ListView from "@/_components/ListView";
import { SanityRunningShoe } from "@/app/shoes/page";
import ShoeCard from "@/app/shoes/_components/ShoeCard";

type Params = Promise<{ slug: string }>;
async function getBrand(slug: string): Promise<SanityBrand | null> {
  try {
    const brand = await client.fetch<SanityBrand>(
      `*[_type == "brand" && slug.current == "${slug}"][0]{_id, name, country, officialWebsite, polishWebsite, image, mediaContact, mediaContactPl}`,
      {},
      { next: { revalidate: 60 } }
    );
    if (!brand) return null;

    return brand;
  } catch (error) {
    console.error("Failed to fetch brand:", error);
    return null;
  }
}

async function getShoesByBrand(slug: string): Promise<SanityRunningShoe[]> {
  try {
    const shoes = await client.fetch<SanityRunningShoe[]>(
      `*[
  _type == "runningShoe" && defined(slug.current) && brand->.slug.current == "${slug}"]|order(lower(name) asc)[0...400]{_id, name, slug, shoeType->, category[]->, releaseInfo, image, review}`,
      {},
      { next: { revalidate: 60 } }
    );
    if (!shoes) return [];

    return shoes;
  } catch (error) {
    console.error("Failed to fetch brand shoes:", error);
    return [];
  }
}

const BrandPage = async (props: { params: Params }) => {
  const params = await props.params;
  const slug = params.slug;
  const brand = await getBrand(slug);
  const shoes = await getShoesByBrand(slug);

  if (!brand) {
    notFound(); // Trigger 404 page if the shoe is not found
  }
  return (
    <Suspense>
      <main className="container mx-auto min-h-screen max-w-5xl p-8">
        <h1 className="text-4xl font-bold mb-8">{brand.name}</h1>
        <div className="flex gap-4 items-center">
          <div className="max-w-sm bg-white">
            <img
              className="h-auto rounded-lg"
              src={brand.image.url}
              alt={brand.name}
            />
          </div>

          <div className="py-4 w-full">
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg w-full">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="row" className="px-6 py-3">
                      BRAND INFO
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="odd:bg-white even:bg-gray-50 border-b">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      Country of Origin
                    </th>
                    <td className="px-6 py-4 flex gap-2">{brand.country}</td>
                  </tr>
                  <tr className="odd:bg-white even:bg-gray-50 border-b">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      Official website
                    </th>
                    <td className="px-6 py-4 flex gap-2">
                      {brand.officialWebsite}
                    </td>
                  </tr>
                  <tr className="odd:bg-white even:bg-gray-50 border-b">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      Media contact
                    </th>
                    <td className="px-6 py-4 flex gap-2">
                      {brand.mediaContact}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="p-4">
          <ListView
            listViewItems={shoes.map((shoe) => (
              <ShoeCard shoe={shoe} key={shoe._id} />
            ))}
          />
        </div>
      </main>
    </Suspense>
  );
};

export async function generateStaticParams() {
  try {
    const brands = await client.fetch<SanityBrand[]>(
      `*[_type == "brand"]{ slug }`,
      {}
    );

    return brands.map((brand) => ({ slug: brand.slug.current }));
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    return [];
  }
}

export default BrandPage;
