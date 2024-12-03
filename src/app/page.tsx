import Link from "next/link";

export default async function IndexPage() {
  return (
    <main className="container mx-auto min-h-screen max-w-5xl p-8">
      <h1 className="text-4xl font-bold mb-8">Running Shoes Index</h1>
      <h3 className="text-2xl font-normal mb-8">
        You directory of all running shoes.
      </h3>
      <div>
        <h4>Browse by:</h4>
        <Link href={`/brands`}>
          <h2 className="text-xl font-semibold">Brand</h2>
        </Link>
        <Link href={`/shoes`}>
          <h2 className="text-xl font-semibold">Shoes</h2>
        </Link>
      </div>
    </main>
  );
}
