import ListView from "@/_components/ListView";
import { client } from "@/sanity/client";
import { SanityRunningShoe } from "../page";
import ShoesListHeader from "../_components/ShoesListHeader";
import ShoesListItem from "../_components/ShoesListItem";
import { Suspense } from "react";

const SHOES_QUERY = `*[
  _type == "runningShoe" && defined(slug.current) && releaseInfo.eu.date > "2023-12-31" && releaseInfo.eu.date < "2025-01-01"
]|order(lower(name) asc)[0...400]{_id, name, slug, releaseInfo, image}`;

export default async function Shoes2025() {
  const shoes = await client.fetch<SanityRunningShoe[]>(
    SHOES_QUERY,
    {},
    { next: { revalidate: 30 } }
  );

  return (
    <Suspense>
      {" "}
      <main className="container mx-auto min-h-screen max-w-3xl p-8">
        <h1 className="text-4xl font-bold mb-8">Running Shoes Index</h1>
        <h2 className="text-2xl font-bold mb-8">Shoes of 2024</h2>
        <ListView
          listViewHeader={<ShoesListHeader />}
          listViewItems={shoes.map((shoe) => (
            <ShoesListItem shoe={shoe} key={shoe._id} />
          ))}
        />
      </main>
    </Suspense>
  );
}
