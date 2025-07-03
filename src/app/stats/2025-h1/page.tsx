import { client } from "@/sanity/client";
import Link from "next/link";
import { SanityRunningShoe } from "@/_types/RunningShoe";

interface ShoeStats {
  count: number;
  averageDrop: number;
  averageWeight: number;
  averageHeelStack: number;
  averagePricePLN: number;
  averagePriceEUR: number;
}

interface StatsData {
  allShoes: ShoeStats;
  dailyTrainers: ShoeStats;
  rawShoes: SanityRunningShoe[];
}

async function getFirstHalf2025Stats(): Promise<StatsData> {
  const query = `*[
    _type == "runningShoe" &&
    defined(releaseInfo.pl.date) &&
    releaseInfo.pl.date >= "2025-01-01" &&
    releaseInfo.pl.date <= "2025-06-30"
  ]{
    _id,
    name,
    slug,
    categories[],
    specs,
    releaseInfo
  }`;

  try {
    const shoes = await client.fetch<SanityRunningShoe[]>(
      query,
      {},
      { next: { revalidate: 3600 } }
    );

    // Calculate stats for all shoes
    const allShoes = calculateStats(shoes);

    // Filter and calculate stats for daily trainers
    const dailyTrainerShoes = shoes.filter((shoe) =>
      shoe.categories?.some(
        (cat) =>
          cat.toLowerCase().includes("daily trainer") ||
          cat.toLowerCase().includes("daily")
      )
    );
    const dailyTrainers = calculateStats(dailyTrainerShoes);

    return {
      allShoes,
      dailyTrainers,
      rawShoes: shoes,
    };
  } catch (error) {
    console.error("Failed to fetch 2025 H1 stats:", error);
    return {
      allShoes: {
        count: 0,
        averageDrop: 0,
        averageWeight: 0,
        averageHeelStack: 0,
        averagePricePLN: 0,
        averagePriceEUR: 0,
      },
      dailyTrainers: {
        count: 0,
        averageDrop: 0,
        averageWeight: 0,
        averageHeelStack: 0,
        averagePricePLN: 0,
        averagePriceEUR: 0,
      },
      rawShoes: [],
    };
  }
}

function calculateStats(shoes: SanityRunningShoe[]): ShoeStats {
  if (shoes.length === 0) {
    return {
      count: 0,
      averageDrop: 0,
      averageWeight: 0,
      averageHeelStack: 0,
      averagePricePLN: 0,
      averagePriceEUR: 0,
    };
  }

  let totalDrop = 0;
  let totalWeight = 0;
  let totalHeelStack = 0;
  let totalPricePLN = 0;
  let totalPriceEUR = 0;
  let dropCount = 0;
  let weightCount = 0;
  let heelStackCount = 0;
  let priceCountPLN = 0;
  let priceCountEUR = 0;

  shoes.forEach((shoe) => {
    // Drop calculation (men's drop)
    if (shoe.specs?.m?.drop) {
      totalDrop += shoe.specs.m.drop;
      dropCount++;
    }

    // Weight calculation (men's weight)
    if (shoe.specs?.m?.weight) {
      totalWeight += shoe.specs.m.weight;
      weightCount++;
    }

    // Heel stack calculation (men's heel stack)
    if (shoe.specs?.m?.heelStack) {
      totalHeelStack += shoe.specs.m.heelStack;
      heelStackCount++;
    }

    // Price PLN calculation
    if (shoe.releaseInfo?.pl?.price) {
      totalPricePLN += shoe.releaseInfo.pl.price;
      priceCountPLN++;
    }

    // Price EUR calculation
    if (shoe.releaseInfo?.eu?.price) {
      totalPriceEUR += shoe.releaseInfo.eu.price;
      priceCountEUR++;
    }
  });

  return {
    count: shoes.length,
    averageDrop:
      dropCount > 0 ? Math.round((totalDrop / dropCount) * 10) / 10 : 0,
    averageWeight:
      weightCount > 0 ? Math.round((totalWeight / weightCount) * 10) / 10 : 0,
    averageHeelStack:
      heelStackCount > 0
        ? Math.round((totalHeelStack / heelStackCount) * 10) / 10
        : 0,
    averagePricePLN:
      priceCountPLN > 0
        ? Math.round((totalPricePLN / priceCountPLN) * 100) / 100
        : 0,
    averagePriceEUR:
      priceCountEUR > 0
        ? Math.round((totalPriceEUR / priceCountEUR) * 100) / 100
        : 0,
  };
}

function formatCurrency(amount: number, currency: string): string {
  if (amount === 0) return "N/A";

  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function StatCard({ title, stats }: { title: string; stats: ShoeStats }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats.count}
          </div>
          <div className="text-sm text-gray-600">Total Shoes</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {stats.averageDrop > 0 ? `${stats.averageDrop}mm` : "N/A"}
          </div>
          <div className="text-sm text-gray-600">Avg. Drop (Men)</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {stats.averageWeight > 0 ? `${stats.averageWeight}g` : "N/A"}
          </div>
          <div className="text-sm text-gray-600">Avg. Weight (Men)</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-600 mb-2">
            {stats.averageHeelStack > 0 ? `${stats.averageHeelStack}mm` : "N/A"}
          </div>
          <div className="text-sm text-gray-600">Avg. Heel Stack (Men)</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {formatCurrency(stats.averagePricePLN, "PLN")}
          </div>
          <div className="text-sm text-gray-600">Avg. Price (PLN)</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {formatCurrency(stats.averagePriceEUR, "EUR")}
          </div>
          <div className="text-sm text-gray-600">Avg. Price (EUR)</div>
        </div>
      </div>
    </div>
  );
}

export default async function Stats2025H1Page() {
  const { allShoes, dailyTrainers, rawShoes } = await getFirstHalf2025Stats();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <nav className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-gray-800">2025 H1 Statistics</span>
          </div>
        </nav>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          2025 First Half Statistics
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Statistics for running shoes released in Poland between January and
          June 2025
        </p>
        <p className="text-sm text-gray-500">
          Data period: January 1, 2025 - June 30, 2025
        </p>
      </header>

      {/* Statistics Cards */}
      <div className="space-y-8">
        {/* All Shoes Statistics */}
        <StatCard title="All Shoes Released in 2025 H1" stats={allShoes} />

        {/* Daily Trainers Statistics */}
        <StatCard
          title="Daily Trainers Released in 2025 H1"
          stats={dailyTrainers}
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Methodology
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Data Sources</h3>
            <ul className="space-y-1">
              <li>• Release dates: Polish market (PL) release dates only</li>
              <li>• Specifications: Men&apos;s sizing data when available</li>
              <li>• Pricing: Both PLN and EUR market prices</li>
              <li>
                • Categories: Shoes tagged with &ldquo;Daily trainer&rdquo; or
                &ldquo;Daily&rdquo;
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Calculations</h3>
            <ul className="space-y-1">
              <li>• Averages exclude shoes with missing data</li>
              <li>
                • Drop, weight, and heel stack use men&apos;s specifications
              </li>
              <li>• Prices are averaged from available market data</li>
              <li>• All values rounded to 1 decimal place</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sample Data */}
      {rawShoes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Sample Shoes ({rawShoes.length} total)
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-3 border-b">Name</th>
                    <th className="text-left p-3 border-b">Categories</th>
                    <th className="text-left p-3 border-b">
                      Release Date (PL)
                    </th>
                    <th className="text-left p-3 border-b">Drop</th>
                    <th className="text-left p-3 border-b">Weight</th>
                    <th className="text-left p-3 border-b">Heel Stack</th>
                    <th className="text-left p-3 border-b">Price PLN</th>
                  </tr>
                </thead>
                <tbody>
                  {rawShoes.map((shoe) => (
                    <tr key={shoe._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <Link
                          href={`/shoes/${shoe.slug.current}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {shoe.name}
                        </Link>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {shoe.categories?.slice(0, 2).map((cat, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {cat}
                            </span>
                          ))}
                          {shoe.categories && shoe.categories.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{shoe.categories.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        {shoe.releaseInfo?.pl?.date
                          ? new Date(
                              shoe.releaseInfo.pl.date
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        {shoe.specs?.m?.drop ? `${shoe.specs.m.drop}mm` : "N/A"}
                      </td>
                      <td className="p-3">
                        {shoe.specs?.m?.weight
                          ? `${shoe.specs.m.weight}g`
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        {shoe.specs?.m?.heelStack
                          ? `${shoe.specs.m.heelStack}mm`
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        {shoe.releaseInfo?.pl?.price
                          ? formatCurrency(shoe.releaseInfo.pl.price, "PLN")
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-12 text-center">
        <Link
          href="/shoes"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Browse All Shoes
        </Link>
      </div>
    </div>
  );
}
