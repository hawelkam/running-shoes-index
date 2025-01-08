import ListView from "@/_components/ListView";
import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "../../page";
import ShoesListHeader from "../../_components/ShoesListHeader";
import ShoesListItem from "../../_components/ShoesListItem";

type Params = Promise<{ slug: string[] }>;

async function getShoes(slug: string[]): Promise<SanityRunningShoe[]> {
  try {
    const shoes = await client.fetch<SanityRunningShoe[]>(
      `*[
  _type == "runningShoe" && defined(slug.current) && releaseInfo.${slug[0] || "eu"}.date > "${slug[1]}-${slug[2] || "01"}-00" && releaseInfo.${slug[0] || "eu"}.date < "${slug[1]}-${slug[2] || "12"}-32"
]|order(lower(name) asc)[0...400]{_id, name, slug, releaseInfo, image}`,
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

const ReleasesOfDate = async (props: { params: Params }) => {
  const params = await props.params;
  const slug = params.slug;
  const shoes = await getShoes(slug);

  return (
    <Suspense>
      <main className="container mx-auto min-h-screen max-w-3xl p-8">
        <h1 className="text-4xl font-bold mb-8">Running Shoes Index</h1>
        <h2 className="text-2xl font-bold mb-8">Shoes of {slug[0]}</h2>
        <ListView
          listViewHeader={<ShoesListHeader />}
          listViewItems={shoes.map((shoe) => (
            <ShoesListItem shoe={shoe} key={shoe._id} />
          ))}
        />
      </main>
    </Suspense>
  );
};

export async function generateStaticParams() {
  try {
    return [
      ["eu", "2024"],
      ["eu", "2025"],
    ].map((year) => ({ slug: year }));
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    return [];
  }
}

export default ReleasesOfDate;
