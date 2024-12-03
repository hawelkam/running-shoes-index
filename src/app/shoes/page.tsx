import { client } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import Link from "next/link";

const SHOES_QUERY = `*[
  _type == "runningShoe" && defined(slug.current)
]|order(releaseDate desc)[0...12]{_id, name, slug, releaseDatePL}`;

type SanityRunningShoe = SanityDocument & {
  name: string;
  releaseDatePL: Date;
};

//TODO: add links to specific shoe types
//TODO: add pagination

export default async function Shoes() {
  const shoes = await client.fetch<SanityRunningShoe[]>(
    SHOES_QUERY,
    {},
    { next: { revalidate: 30 } }
  );

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Running Shoes Index</h1>
      <ul className="flex flex-col gap-y-4">
        {shoes.map((shoe) => (
          <li className="hover:underline" key={shoe._id}>
            <Link href={`/shoes/${shoe.slug.current}`}>
              <h2 className="text-xl font-semibold">{shoe.name}</h2>
              <p>{new Date(shoe.releaseDatePL).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
