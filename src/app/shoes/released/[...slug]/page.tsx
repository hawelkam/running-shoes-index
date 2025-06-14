import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import ShoeTableElement from "../../_components/ShoeTableElement";
import ShoeTableCard from "../../_components/ShoeTableCard";

type Params = Promise<{ slug: string[] }>;

async function getShoes(slug: string[]): Promise<SanityRunningShoe[]> {
  try {
    const shoes = await client.fetch<SanityRunningShoe[]>(
      `*[
  _type == "runningShoe" && defined(slug.current) && ((releaseInfo.pl.date > "${slug[0]}-${slug[1] || "01"}-00" && releaseInfo.pl.date < "${slug[0]}-${slug[1] || "12"}-32") || (releaseInfo.eu.date > "${slug[0]}-${slug[1] || "01"}-00" && releaseInfo.eu.date < "${slug[0]}-${slug[1] || "12"}-32") || (releaseInfo.us.date > "${slug[0]}-${slug[1] || "01"}-00" && releaseInfo.us.date < "${slug[0]}-${slug[1] || "12"}-32"))
]|order(lower(name) asc)[0...400]{_id, name, slug, shoeType->, category[]->, releaseInfo, image, review}`,
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
      <div className="w-full">
        {/* Header with max width */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Running Shoes Index
            </h1>
            <h2 className="text-xl text-gray-600">Shoes of {slug[0]}</h2>
          </header>
        </div>

        {/* Table with same width as header */}
        <div className="container mx-auto px-4 mb-8 max-w-7xl">
          <div className="overflow-x-auto table-view">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 font-semibold text-gray-700">Image</th>
                  <th className="p-4 font-semibold text-gray-700">Name</th>
                  <th className="p-4 font-semibold text-gray-700">Category</th>
                  <th className="p-4 font-semibold text-gray-700">Price</th>
                  <th className="p-4 font-semibold text-gray-700">Weight</th>
                  <th className="p-4 font-semibold text-gray-700">Drop</th>
                  <th className="p-4 font-semibold text-gray-700">Reviewed</th>
                </tr>
              </thead>
              <tbody>
                {shoes.map((shoe) => (
                  <ShoeTableElement key={shoe._id} shoe={shoe} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card view with max width */}
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="card-view grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {shoes.map((shoe) => (
              <ShoeTableCard key={shoe._id} shoe={shoe} />
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export async function generateStaticParams() {
  try {
    return [["2024"], ["2025"]].map((year) => ({ slug: year }));
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    return [];
  }
}

export default ReleasesOfDate;
