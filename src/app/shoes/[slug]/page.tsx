import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import CompareModal from "../_components/CompareModal";
import { SanityRunningShoe } from "@/_types/RunningShoe";

type Params = Promise<{ slug: string }>;

async function getShoe(slug: string): Promise<SanityRunningShoe | null> {
  try {
    const shoe = await client.fetch<SanityRunningShoe>(
      `*[_type == "runningShoe" && slug.current == "${slug}"][0]{_id, name, brand->, shoeType->, releaseInfo, category[]->, stability, specs { m, w, upper[]->, foam[]->, plate, outsole[]->}, notes, previousVersion-> { name, releaseInfo, category[]->, slug, image, specs { m, w, upper[]->, foam[]->, plate, outsole[]->}, stability, notes}, image, review}`,
      {},
      { next: { revalidate: 60 } }
    );
    if (!shoe) return null;

    return shoe;
  } catch (error) {
    console.error("Failed to fetch shoe:", error);
    return null;
  }
}

const ShoePage = async (props: { params: Params }) => {
  const params = await props.params;
  const slug = params.slug;
  const shoe = await getShoe(slug);

  if (!shoe) {
    notFound(); // Trigger 404 page if the shoe is not found
  }
  return (
    <div className="md:flex items-start justify-center py-12 2xl:px-40 md:px-6 px-4">
      <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
        {shoe.image && (
          <img
            className="w-full"
            alt="image of running shoe"
            src={shoe.image.url}
          />
        )}
        {shoe.review && (
          <div>
            <div className="border-t border-b py-4 mt-7 border-gray-200">
              <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg w-full">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="row" className="px-6 py-3">
                        MY REVIEW
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoe.review.shoeInfo.weight && (
                      <tr className="odd:bg-white even:bg-gray-50 border-b">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          Reviewed shoe weight
                        </th>
                        <td className="px-6 py-4 flex gap-2">
                          {`${shoe.review.shoeInfo.weight}g | ${Math.round(shoe.review.shoeInfo.weight * 3.5274) / 100}oz.`}
                        </td>
                      </tr>
                    )}
                    {shoe.review.shoeInfo && (
                      <tr className="odd:bg-white even:bg-gray-50 border-b">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          Reviewed shoe size
                        </th>
                        <td className="px-6 py-4 flex gap-2">
                          {`${shoe.review.shoeInfo.sizeEU}EU | ${shoe.review.shoeInfo.sizeUS}US`}
                        </td>
                      </tr>
                    )}
                    {shoe.review.enReview && (
                      <tr className="odd:bg-white even:bg-gray-50 border-b">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          English review
                        </th>
                        <td className="px-6 py-4 flex gap-2">
                          {shoe.review.enReview.youtube && (
                            <a href={shoe.review.enReview.youtube}>YouTube</a>
                          )}
                          {shoe.review.enReview.instagram && (
                            <a href={shoe.review.enReview.instagram}>
                              Instagram
                            </a>
                          )}
                          {shoe.review.enReview.tiktok && (
                            <a href={shoe.review.enReview.tiktok}>TikTok</a>
                          )}
                        </td>
                      </tr>
                    )}
                    {shoe.review.plReview && (
                      <tr className="odd:bg-white even:bg-gray-50 border-b">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          Polish review
                        </th>
                        <td className="px-6 py-4 flex gap-2">
                          {shoe.review.plReview.youtube && (
                            <a href={shoe.review.plReview.youtube}>YouTube</a>
                          )}
                          {shoe.review.plReview.instagram && (
                            <a href={shoe.review.plReview.instagram}>
                              Instagram
                            </a>
                          )}
                          {shoe.review.plReview.tiktok && (
                            <a href={shoe.review.plReview.tiktok}>TikTok</a>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {shoe.previousVersion && (
          <div>
            <div className="border-b py-4 border-gray-200">
              <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg w-full">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="row" className="px-6 py-3">
                        PREVIOUS VERSION
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
                        Name
                      </th>
                      <td className="px-6 py-4 flex gap-2">
                        <Link
                          href={`/shoes/${shoe.previousVersion.slug.current}`}
                          className="underline"
                        >
                          {shoe.previousVersion.name}
                        </Link>
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-gray-50 border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Release date
                      </th>
                      <td className="px-6 py-4 flex gap-2">
                        {Intl.DateTimeFormat("en-GB", {
                          month: "short",
                          year: "numeric",
                        }).format(
                          new Date(shoe.previousVersion.releaseInfo.eu.date)
                        )}
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-gray-50 border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Image
                      </th>
                      <td className="px-6 py-4 flex gap-2">
                        {shoe.image && (
                          <img
                            className="rounded-lg max-w-52"
                            src={`${shoe.previousVersion.image.url}`}
                            alt=""
                          />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CompareModal shoe={shoe} />
            </div>
          </div>
        )}
      </div>
      <div className="md:hidden">
        {shoe.image && (
          <img
            className="w-full"
            alt="image of running shoe"
            src={shoe.image.url}
          />
        )}
      </div>
      <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm leading-none text-gray-600">
            {shoe.shoeType.name} | {shoe.brand.name}
          </p>
          <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mt-2">
            {shoe.name}
          </h1>
        </div>

        <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg w-full">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="row" className="px-6 py-3">
                  General info
                </th>
                <th>EU</th>
                <th>US</th>
                <th>PL</th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Price
                </th>
                <td className="py-4">{shoe.releaseInfo.eu?.price}€</td>
                <td className="py-4">{shoe.releaseInfo.us?.price}$</td>
                <td className="py-4">{shoe.releaseInfo.pl?.price}zł</td>
              </tr>

              {shoe.releaseInfo && (
                <tr className="odd:bg-white even:bg-gray-50 border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Release date
                  </th>
                  <td className="py-4">
                    {shoe.releaseInfo.eu?.date &&
                      Intl.DateTimeFormat("en-GB", {
                        month: "short",
                        year: "numeric",
                      }).format(new Date(shoe.releaseInfo.eu.date))}
                  </td>
                  <td className="py-4">
                    {shoe.releaseInfo.us?.date &&
                      Intl.DateTimeFormat("en-GB", {
                        month: "short",
                        year: "numeric",
                      }).format(new Date(shoe.releaseInfo.us.date))}
                  </td>
                  <td className="py-4">
                    {shoe.releaseInfo.pl?.date &&
                      Intl.DateTimeFormat("en-GB", {
                        month: "short",
                        year: "numeric",
                      }).format(new Date(shoe.releaseInfo.pl.date))}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg w-full">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="row" className="px-6 py-3">
                  Specification
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shoe.category && (
                <tr className="odd:bg-white even:bg-gray-50 border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Category
                  </th>
                  <td className="px-6 py-4 flex gap-2">
                    {shoe.category.map((cat, index) => (
                      <div
                        className="center relative inline-block select-none whitespace-nowrap rounded-lg bg-blue-500 py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white"
                        key={`${shoe.name}-category-${index}`}
                      >
                        <div className="mt-px">{cat.name}</div>
                      </div>
                    ))}
                  </td>
                </tr>
              )}
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Men&apos;s weight
                </th>
                <td className="px-6 py-4">{shoe.specs.m?.weight}g</td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Men&apos;s drop
                </th>
                <td className="px-6 py-4">{shoe.specs.m?.drop}mm</td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Men&apos;s stack height
                </th>
                <td className="px-6 py-4">
                  {shoe.specs.m?.heelStack &&
                    `${shoe.specs.m?.heelStack}mm - ${shoe.specs.m?.heelStack - shoe.specs.m!.drop!}mm`}
                </td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Women&apos;s weight
                </th>
                <td className="px-6 py-4">{shoe.specs.w?.weight}g</td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Women&apos;s drop
                </th>
                <td className="px-6 py-4">{shoe.specs.w?.drop}mm</td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Women&apos;s stack height
                </th>
                <td className="px-6 py-4">
                  {shoe.specs.w?.heelStack &&
                    `${shoe.specs.w?.heelStack}mm - ${shoe.specs.w?.heelStack - shoe.specs.w!.drop!}mm`}
                </td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Stability
                </th>
                <td className="px-6 py-4">{shoe.stability}</td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Upper
                </th>
                <td className="px-6 py-4">
                  {shoe.specs.upper?.map((f) => f.name).join(", ")}
                </td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Foam
                </th>
                <td className="px-6 py-4">
                  {shoe.specs.foam?.map((f) => f.name).join(", ")}
                </td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Plate
                </th>
                <td className="px-6 py-4">{shoe.specs.plate}</td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Outsole
                </th>
                <td className="px-6 py-4">
                  {shoe.specs.outsole?.map((o) => o.name).join(", ")}
                </td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 border-b">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Notes
                </th>
                <td className="px-6 py-4">{shoe.notes}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {shoe.review && (
          <div className="md:hidden">
            <div className="border-t border-b py-4 mt-7 border-gray-200">
              <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg w-full">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="row" className="px-6 py-3">
                        MY REVIEW
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoe.review.shoeInfo.weight && (
                      <tr className="odd:bg-white even:bg-gray-50 border-b">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          Reviewed shoe weight
                        </th>
                        <td className="px-6 py-4 flex gap-2">
                          {`${shoe.review.shoeInfo.weight}g | ${Math.round(shoe.review.shoeInfo.weight * 3.5274) / 100}oz.`}
                        </td>
                      </tr>
                    )}
                    {shoe.review.shoeInfo && (
                      <tr className="odd:bg-white even:bg-gray-50 border-b">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          Reviewed shoe size
                        </th>
                        <td className="px-6 py-4 flex gap-2">
                          {`${shoe.review.shoeInfo.sizeEU}EU | ${shoe.review.shoeInfo.sizeUS}US`}
                        </td>
                      </tr>
                    )}
                    {shoe.review.enReview && (
                      <tr className="odd:bg-white even:bg-gray-50 border-b">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          English review
                        </th>
                        <td className="px-6 py-4 flex gap-2">
                          {shoe.review.enReview.youtube && (
                            <a href={shoe.review.enReview.youtube}>YouTube</a>
                          )}
                          {shoe.review.enReview.instagram && (
                            <a href={shoe.review.enReview.instagram}>
                              Instagram
                            </a>
                          )}
                          {shoe.review.enReview.tiktok && (
                            <a href={shoe.review.enReview.tiktok}>TikTok</a>
                          )}
                        </td>
                      </tr>
                    )}
                    {shoe.review.plReview && (
                      <tr className="odd:bg-white even:bg-gray-50 border-b">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          Polish review
                        </th>
                        <td className="px-6 py-4 flex gap-2">
                          {shoe.review.plReview.youtube && (
                            <a href={shoe.review.plReview.youtube}>YouTube</a>
                          )}
                          {shoe.review.plReview.instagram && (
                            <a href={shoe.review.plReview.instagram}>
                              Instagram
                            </a>
                          )}
                          {shoe.review.plReview.tiktok && (
                            <a href={shoe.review.plReview.tiktok}>TikTok</a>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {shoe.previousVersion && (
          <div className="md:hidden">
            <div className="border-b py-4 border-gray-200">
              <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg w-full">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="row" className="px-6 py-3">
                        PREVIOUS VERSION
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
                        Name
                      </th>
                      <td className="px-6 py-4 flex gap-2">
                        <Link
                          href={`/shoes/${shoe.previousVersion.slug.current}`}
                          className="underline"
                        >
                          {shoe.previousVersion.name}
                        </Link>
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-gray-50 border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Release date
                      </th>
                      <td className="px-6 py-4 flex gap-2">
                        {Intl.DateTimeFormat("en-GB", {
                          month: "short",
                          year: "numeric",
                        }).format(
                          new Date(shoe.previousVersion.releaseInfo.eu.date)
                        )}
                      </td>
                    </tr>
                    <tr className="odd:bg-white even:bg-gray-50 border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Image
                      </th>
                      <td className="px-6 py-4 flex gap-2">
                        {shoe.image && (
                          <img
                            className="rounded-lg max-w-52"
                            src={`${shoe.previousVersion.image.url}`}
                            alt=""
                          />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CompareModal shoe={shoe} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export async function generateStaticParams() {
  try {
    const shoes = await client.fetch<SanityRunningShoe[]>(
      `*[_type == "runningShoe"]{ slug }`,
      {}
    );

    return shoes.map((shoe) => ({ slug: shoe.slug.current }));
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    return [];
  }
}

export default ShoePage;
