import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { SanityBrand } from "../page";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import ShoeTableElement from "@/app/shoes/_components/ShoeTableElement";
import ShoeTableCard from "@/app/shoes/_components/ShoeTableCard";
import GenericPagination from "@/_components/GenericPagination";
import Image from "next/image";

const ITEMS_PER_PAGE = 10;

interface BrandPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}
async function getBrand(slug: string): Promise<SanityBrand | null> {
  try {
    const brand = await client.fetch<SanityBrand>(
      `*[_type == "brand" && slug.current == "${slug}"][0]{
        _id,
        name,
        country,
        usWebsite,
        euWebsite,
        plWebsite,
        image,
        usMediaContact,
        euMediaContact,
        plMediaContact
      }`,
      {},
      { next: { revalidate: 60 } }
    );
    if (!brand) return null;

    return brand;
  } catch (error) {
    console.error("Failed to fetch brand:", error);
    return null;
  }
}

async function getShoesByBrand(
  slug: string,
  page: number = 1
): Promise<{ shoes: SanityRunningShoe[]; totalCount: number }> {
  try {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE - 1;

    // Get total count
    const countQuery = `count(*[
        _type == "runningShoe" &&
        defined(slug.current) &&
        brand->.slug.current == "${slug}"
      ])`;

    const totalCount = await client.fetch<number>(
      countQuery,
      {},
      { next: { revalidate: 60 } }
    );

    // Get paginated data
    const shoes = await client.fetch<SanityRunningShoe[]>(
      `*[
        _type == "runningShoe" &&
        defined(slug.current) &&
        brand->.slug.current == "${slug}"
      ]|order(lower(name) asc)[${start}...${end + 1}]{
        _id,
        name,
        slug,
        shoeType->,
        category[]-> {_id, name},
        releaseInfo,
        specs,
        image,
        review,
        brand-> {_id, name, slug}
      }`,
      {},
      { next: { revalidate: 60 } }
    );

    return { shoes: shoes || [], totalCount };
  } catch (error) {
    console.error("Failed to fetch brand shoes:", error);
    return { shoes: [], totalCount: 0 };
  }
}

const BrandPage = async (props: BrandPageProps) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;
  const currentPage = parseInt(searchParams.page || "1", 10);
  const brand = await getBrand(slug);
  const { shoes, totalCount } = await getShoesByBrand(slug, currentPage);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (!brand) {
    notFound(); // Trigger 404 page if the brand is not found
  }
  return (
    <Suspense>
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8">{brand.name}</h1>
        <div className="flex gap-2 md:gap-4 items-center flex-col md:flex-row">
          <div className="max-w-sm bg-white rounded-lg shadow-sm">
            {brand.image?.url ? (
              <Image
                className="h-auto rounded-lg"
                src={brand.image.url}
                alt={brand.name}
                width={400}
                height={300}
                priority
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-lg font-medium">
                  {brand.name}
                </span>
              </div>
            )}
          </div>

          <div className="py-4 w-full">
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg w-full">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="row" className="px-6 py-3">
                      BRAND INFO
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="odd:bg-white even:bg-gray-50 border-b">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      Country of Origin
                    </th>
                    <td className="px-6 py-4">
                      {brand.country || "Not specified"}
                    </td>
                  </tr>
                  <tr className="odd:bg-white even:bg-gray-50 border-b">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      Official website
                    </th>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {brand.usWebsite && (
                          <a
                            href={brand.usWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            US
                          </a>
                        )}
                        {brand.euWebsite && (
                          <a
                            href={brand.euWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            EU
                          </a>
                        )}
                        {brand.plWebsite && (
                          <a
                            href={brand.plWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            PL
                          </a>
                        )}
                        {!brand.usWebsite &&
                          !brand.euWebsite &&
                          !brand.plWebsite && (
                            <span className="text-gray-500">Not available</span>
                          )}
                      </div>
                    </td>
                  </tr>
                  <tr className="odd:bg-white even:bg-gray-50 border-b">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      Media contact
                    </th>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {brand.usMediaContact && (
                          <a
                            href={`mailto:${brand.usMediaContact}`}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            US
                          </a>
                        )}
                        {brand.euMediaContact && (
                          <a
                            href={`mailto:${brand.euMediaContact}`}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            EU
                          </a>
                        )}
                        {brand.plMediaContact && (
                          <a
                            href={`mailto:${brand.plMediaContact}`}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            PL
                          </a>
                        )}
                        {!brand.usMediaContact &&
                          !brand.euMediaContact &&
                          !brand.plMediaContact && (
                            <span className="text-gray-500">Not available</span>
                          )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Shoes Table Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Shoes from {brand.name} ({totalCount} total)
          </h3>

          {shoes.length > 0 ? (
            <>
              {/* Table view for desktop */}
              <div className="overflow-x-auto table-view">
                <table className="w-full bg-white rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-4 font-semibold text-gray-700">Image</th>
                      <th className="p-4 font-semibold text-gray-700">Name</th>
                      <th className="p-4 font-semibold text-gray-700">
                        Category
                      </th>
                      <th className="p-4 font-semibold text-gray-700">Price</th>
                      <th className="p-4 font-semibold text-gray-700">
                        Weight
                      </th>
                      <th className="p-4 font-semibold text-gray-700">Drop</th>
                      <th className="p-4 font-semibold text-gray-700">
                        Reviewed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoes.map((shoe) => (
                      <ShoeTableElement key={shoe._id} shoe={shoe} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card view for mobile */}
              <div className="card-view grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                {shoes.map((shoe) => (
                  <ShoeTableCard key={shoe._id} shoe={shoe} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <GenericPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  itemsPerPage={ITEMS_PER_PAGE}
                  basePath={`/brands/${slug}`}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">
                No shoes found for {brand.name}
              </p>
              <p className="text-gray-500 mt-2">
                Check back later for new releases!
              </p>
            </div>
          )}
        </div>
      </main>
    </Suspense>
  );
};

export async function generateStaticParams() {
  try {
    const brands = await client.fetch<SanityBrand[]>(
      `*[_type == "brand"]{ slug }`,
      {}
    );

    return brands.map((brand) => ({ slug: brand.slug.current }));
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    return [];
  }
}

export default BrandPage;
