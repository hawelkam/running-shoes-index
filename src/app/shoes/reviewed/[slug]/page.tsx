import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import ShoesTable from "../../_components/ShoesTable";
import { mapToRunningShoe } from "@/_utils/runningShoeMapper";

type Params = Promise<{ slug: string }>;

async function getShoes(slug: string): Promise<SanityRunningShoe[]> {
  let query = `*[
  _type == "runningShoe" && defined(slug.current) && defined(review) && ((releaseInfo.pl.date > "${slug}-01-00" && releaseInfo.pl.date < "${slug}-12-32") || (releaseInfo.eu.date > "${slug}-01-00" && releaseInfo.eu.date < "${slug}-12-32") || (releaseInfo.us.date > "${slug}-01-00" && releaseInfo.us.date < "${slug}-12-32"))
]|order(lower(name) asc)[0...400]{_id, name, slug, shoeType->, category[]->, releaseInfo, image, review}`;
  if (slug === "all") {
    query = `*[_type == "runningShoe" && defined(slug.current) && defined(review)]|order(lower(name) asc)[0...400]{_id, name, slug, shoeType->, category[]->, releaseInfo, image, review}`;
  }
  try {
    const shoes = await client.fetch<SanityRunningShoe[]>(
      query,
      {},
      { next: { revalidate: 60 } }
    );
    if (!shoes) return [];

    return shoes;
  } catch (error) {
    console.error("Failed to fetch shoe:", error);
    return [];
  }
}

const ReviewedInYear = async (props: { params: Params }) => {
  const params = await props.params;
  const slug = params.slug;
  const shoes = await getShoes(slug);

  return (
    <Suspense>
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8">Running Shoes Index</h1>
        <h2 className="text-2xl font-bold mb-8">
          Shoes of {slug} reviewed by me
        </h2>
        <ShoesTable shoes={shoes.map((shoe) => mapToRunningShoe(shoe))} />
      </main>
    </Suspense>
  );
};

export async function generateStaticParams() {
  try {
    return ["2024", "2025"].map((year) => ({ slug: year }));
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    return [];
  }
}

export default ReviewedInYear;
