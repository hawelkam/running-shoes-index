import { client } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import { notFound } from "next/navigation";
import React from "react";

type SanityRunningShoe = SanityDocument & {
  name: string;
  pricePln: number;
  stability: string;
  wideAvailable: boolean;
  waterproofAvailable: boolean;
  slug: { current: string };
  releaseDatePL: string;
  image: { url: string };
};
//TODO: display info
type Params = Promise<{ slug: string }>;

async function getShoe(slug: string): Promise<SanityRunningShoe | null> {
  try {
    const shoe = await client.fetch<SanityRunningShoe>(
      `*[_type == "runningShoe" && slug.current == "${slug}"][0]{_id, name, pricePln, stability, releaseDatePL, image}`,
      {},
      { next: { revalidate: 60 } }
    );
    if (!shoe) return null;

    return shoe;
  } catch (error) {
    console.error("Failed to fetch shoe:", error);
    return null;
  }
}

const ShoePage = async (props: { params: Params }) => {
  const params = await props.params;
  const slug = params.slug;
  const shoe = await getShoe(slug);

  if (!shoe) {
    notFound(); // Trigger 404 page if the shoe is not found
  }
  return (
    <main className="container mx-auto min-h-screen max-w-5xl p-8">
      <h1 className="text-4xl font-bold mb-8">{shoe.name}</h1>
      <img
        className="h-auto max-w-lg rounded-lg"
        src={shoe.image.url}
        alt={shoe.name}
      />
      <div>
        <h2>Technical details</h2>
        <ul>
          <li>Stability: {shoe.stability}</li>
        </ul>
      </div>
      <div>
        <h2>Pricing</h2>
        <ul>
          <li>Price PLN: {shoe.pricePln}zł</li>
          <li>Price EUR:</li>
          <li>Price USD:</li>
        </ul>
      </div>
      <div>
        <h2>Release dates</h2>
        <ul>
          <li>Europe: </li>
          <li>Poland: {shoe.releaseDatePL}</li>
        </ul>
      </div>
      <div>
        <h2>Reviewer&apos;s note</h2>
        <ul>
          <li>Weight: </li>
          <li>Shoe size: </li>
          <li>YouTube review PL</li>
          <li>IG review PL</li>
          <li>TikTok review PL</li>
          <li>YT review EN</li>
          <li>IG review EN</li>
          <li>TT review EN</li>
        </ul>
      </div>
    </main>
  );
};

export async function generateStaticParams() {
  try {
    const shoes = await client.fetch<SanityRunningShoe[]>(
      `*[_type == "runningShoe"]{ slug }`,
      {}
    );

    return shoes.map((shoe) => ({ slug: shoe.slug.current }));
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    return [];
  }
}

export default ShoePage;
