import { client } from "@/sanity/client";
import GenericPagination from "@/components/common/GenericPagination";
import BrandsWithSearch from "@/components/features/brands/BrandsWithSearch";
import { SanityBrand } from "@/types/Brand";

interface BrandsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 12;

const options = { next: { revalidate: 30 } };

async function getData(page: number = 1) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE - 1;

  // Get total count
  const countQuery = `count(*[_type == "brand" && defined(slug.current)])`;
  const totalCount = await client.fetch<number>(countQuery, {}, options);

  // Get paginated data
  const query = `*[_type == "brand" && defined(slug.current)]|order(lower(name) asc)[${start}...${end + 1}]{_id, slug, name, image}`;
  const brands = await client.fetch<SanityBrand[]>(query, {}, options);

  return {
    brands,
    totalCount,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
  };
}

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const { brands, totalCount, totalPages } = await getData(currentPage);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Running Shoe Brands
        </h1>
        <p className="text-gray-600">
          Discover the world&apos;s leading running shoe manufacturers
        </p>
      </header>

      <BrandsWithSearch brands={brands} />

      <GenericPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalCount}
        itemsPerPage={ITEMS_PER_PAGE}
        basePath="/brands"
      />
    </div>
  );
}
