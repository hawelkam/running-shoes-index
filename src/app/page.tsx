import Link from "next/link";
import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";

const SHOES_QUERY = `*[
  _type == "runningShoe" && defined(slug.current)
]|order(releaseDate desc)[0...12]{_id, name, slug, releaseDate}`;

const options = { next: { revalidate: 30 } };

type SanityRunningShoe = SanityDocument & {
  name: string;
  version: number;
  releaseDate: Date;
};

export default async function IndexPage() {
  const shoes = await client.fetch<SanityRunningShoe[]>(
    SHOES_QUERY,
    {},
    options
  );

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Running Shoes</h1>
      <ul className="flex flex-col gap-y-4">
        {shoes.map((shoe) => (
          <li className="hover:underline" key={shoe._id}>
            <Link href={`/${shoe.slug.current}`}>
              <h2 className="text-xl font-semibold">{shoe.name}</h2>
              <p>{new Date(shoe.releaseDate).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
