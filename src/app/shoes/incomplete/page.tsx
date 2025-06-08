import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import { prepareMissingDataList } from "@/_utils/helpers";

async function getData() {
  const query = `*[_type == "runningShoe"
    && (
        !defined(releaseInfo)
        || !defined(releaseInfo.pl)
        || !defined(releaseInfo.eu)
        || !defined(releaseInfo.us)
        || !defined(releaseInfo.pl.date)
        || !defined(releaseInfo.eu.date)
        || !defined(releaseInfo.us.date)
        || !defined(releaseInfo.pl.price)
        || !defined(releaseInfo.eu.price)
        || !defined(releaseInfo.us.price)
        || !defined(category)
        || !defined(image)
        || !defined(specs)
        || !defined(specs.m)
        || !defined(specs.w)
        || !defined(specs.m.weight)
        || !defined(specs.w.weight)
        || !defined(specs.m.drop)
        || !defined(specs.w.drop)
        || !defined(specs.m.heelStack)
        || !defined(specs.w.heelStack)
        || !defined(specs.upper)
        || !defined(specs.foam)
        || !defined(specs.plate)
        || !defined(specs.outsole))
        ]|order(lower(name) asc)[0...400]{_id, name, slug, shoeType->, category[]->, releaseInfo, image, review, specs}`;

  const data = await client.fetch<SanityRunningShoe[]>(
    query,
    {},
    { next: { revalidate: 30 } }
  );
  return data;
}

export default async function Shoes() {
  const shoes = await getData();

  return (
    <Suspense>
      <main>
        <h2 className="text-2xl font-bold mb-8">Shoes with incomplete data</h2>
        <ul>
          {shoes.map((shoe) => (
            <li key={shoe.slug.current} className="mb-4">
              {shoe.name}: {prepareMissingDataList(shoe)}
            </li>
          ))}
        </ul>
      </main>
    </Suspense>
  );
}
