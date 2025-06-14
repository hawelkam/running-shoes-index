import { client } from "@/sanity/client";
import { Suspense } from "react";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import Filters from "./_components/Filters";
import ResultsCount from "./_components/ResultsCount";
import ShoeTableElement from "./_components/ShoeTableElement";
import ShoeTableCard from "./_components/ShoeTableCard";
import GenericPagination from "@/_components/GenericPagination";

interface ShoesPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    priceMin?: string;
    priceMax?: string;
    weightMin?: string;
    weightMax?: string;
    dropMin?: string;
    dropMax?: string;
    reviewed?: string;
    search?: string;
  }>;
}

const ITEMS_PER_PAGE = 20;

interface FilterParams {
  category?: string;
  priceMin?: string;
  priceMax?: string;
  weightMin?: string;
  weightMax?: string;
  dropMin?: string;
  dropMax?: string;
  reviewed?: string;
  search?: string;
}

async function getData(page: number = 1, filters: FilterParams = {}) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE - 1;

  // Build filter conditions
  const filterConditions = ['_type == "runningShoe"', "defined(slug.current)"];

  // Category filter
  if (filters.category) {
    filterConditions.push(`category[]->name match "*${filters.category}*"`);
  }

  // Price filter (PLN)
  if (filters.priceMin || filters.priceMax) {
    let priceCondition = "";
    if (filters.priceMin && filters.priceMax) {
      priceCondition = `(releaseInfo.pl.price >= ${filters.priceMin} && releaseInfo.pl.price <= ${filters.priceMax})`;
    } else if (filters.priceMin) {
      priceCondition = `releaseInfo.pl.price >= ${filters.priceMin}`;
    } else if (filters.priceMax) {
      priceCondition = `releaseInfo.pl.price <= ${filters.priceMax}`;
    }
    if (priceCondition) {
      filterConditions.push(priceCondition);
    }
  }

  // Weight filter (g) - men's weight
  if (filters.weightMin || filters.weightMax) {
    let weightCondition = "";
    if (filters.weightMin && filters.weightMax) {
      weightCondition = `(specs.m.weight >= ${filters.weightMin} && specs.m.weight <= ${filters.weightMax})`;
    } else if (filters.weightMin) {
      weightCondition = `specs.m.weight >= ${filters.weightMin}`;
    } else if (filters.weightMax) {
      weightCondition = `specs.m.weight <= ${filters.weightMax}`;
    }
    if (weightCondition) {
      filterConditions.push(weightCondition);
    }
  }

  // Drop filter (mm)
  if (filters.dropMin || filters.dropMax) {
    let dropCondition = "";
    if (filters.dropMin && filters.dropMax) {
      dropCondition = `(specs.m.drop >= ${filters.dropMin} && specs.m.drop <= ${filters.dropMax})`;
    } else if (filters.dropMin) {
      dropCondition = `specs.m.drop >= ${filters.dropMin}`;
    } else if (filters.dropMax) {
      dropCondition = `specs.m.drop <= ${filters.dropMax}`;
    }
    if (dropCondition) {
      filterConditions.push(dropCondition);
    }
  }

  // Reviewed filter
  if (filters.reviewed) {
    if (filters.reviewed === "yes") {
      filterConditions.push("defined(review)");
    } else if (filters.reviewed === "no") {
      filterConditions.push("!defined(review)");
    }
  }

  // Search filter
  if (filters.search) {
    filterConditions.push(`name match "*${filters.search}*"`);
  }

  const whereClause = filterConditions.join(" && ");

  // Get total count
  const countQuery = `count(*[${whereClause}])`;
  const totalCount = await client.fetch<number>(
    countQuery,
    {},
    { next: { revalidate: 30 } }
  );

  // Get paginated data
  const query = `*[${whereClause}]|order(lower(name) asc)[${start}...${end + 1}]{_id, name, slug, shoeType->, category[]->, releaseInfo, specs, image, review}`;

  const data = await client.fetch<SanityRunningShoe[]>(
    query,
    {},
    { next: { revalidate: 30 } }
  );

  return {
    shoes: data,
    totalCount,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
  };
}

export default async function Shoes(props: ShoesPageProps) {
  const searchParams = await props.searchParams;
  const currentPage = parseInt(searchParams.page || "1", 10);

  const filters: FilterParams = {
    category: searchParams.category,
    priceMin: searchParams.priceMin,
    priceMax: searchParams.priceMax,
    weightMin: searchParams.weightMin,
    weightMax: searchParams.weightMax,
    dropMin: searchParams.dropMin,
    dropMax: searchParams.dropMax,
    reviewed: searchParams.reviewed,
    search: searchParams.search,
  };

  const { shoes, totalCount, totalPages } = await getData(currentPage, filters);

  // Check if any filters are active
  const hasFilters = Object.values(filters).some(
    (value) => value && value.trim() !== ""
  );

  return (
    <Suspense>
      <div className="w-full">
        {/* Header and controls with max width */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Running Shoe Catalog
            </h1>
            <p className="text-gray-600">Find your perfect running companion</p>
          </header>

          <Filters />

          <ResultsCount
            totalCount={totalCount}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            showingCount={shoes.length}
            hasFilters={hasFilters}
          />
        </div>

        {/* Table with same width as filters */}
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

        {/* Card view and pagination with max width */}
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="card-view grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {shoes.map((shoe) => (
              <ShoeTableCard key={shoe._id} shoe={shoe} />
            ))}
          </div>

          <GenericPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            itemsPerPage={ITEMS_PER_PAGE}
            basePath="/shoes"
          />
        </div>
      </div>
    </Suspense>
  );
}
