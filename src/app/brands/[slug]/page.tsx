import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import React from "react";
import { SanityBrand } from "../page";

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

const BrandPage = async (props: { params: Params }) => {
  const params = await props.params;
  const slug = params.slug;
  const brand = await getBrand(slug);

  if (!brand) {
    notFound(); // Trigger 404 page if the shoe is not found
  }
  return (
    <main className="container mx-auto min-h-screen max-w-5xl p-8">
      <h1 className="text-4xl font-bold mb-8">{brand.name}</h1>
      <img
        className="h-auto max-w-lg rounded-lg"
        src={brand.image.url}
        alt={brand.name}
      />
      <div>
        <h2>Brand info</h2>
        <ul>
          <li>Country of Origin: {brand.country}</li>
          <li>Official website: {brand.officialWebsite}</li>
          <li>Polish website: {brand.polishWebsite}</li>
          <li>Media contact: {brand.mediaContact}</li>
          <li>Media contact for Poland: {brand.mediaContactPl}</li>
        </ul>
      </div>
    </main>
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
