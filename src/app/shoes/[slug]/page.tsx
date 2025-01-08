import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import React from "react";
import { SanityRunningShoe } from "../page";
import Link from "next/link";

type Params = Promise<{ slug: string }>;

async function getShoe(slug: string): Promise<SanityRunningShoe | null> {
  try {
    const shoe = await client.fetch<SanityRunningShoe>(
      `*[_type == "runningShoe" && slug.current == "${slug}"][0]{_id, name, brand->, shoeType->, releaseInfo, category[]->, stability, specs { m, w, upper[]->, foam[]->, plate, outsole[]->}, notes, previousVersion->, image, review}`,
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
                    <tr className="odd:bg-white even:bg-gray-50 border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Reviewed shoe specs
                      </th>
                      <td className="px-6 py-4 flex gap-2">
                        {shoe.review.shoeInfo &&
                          `${shoe.review.shoeInfo.weight}g | ${shoe.review.shoeInfo.sizeEU}EU | ${shoe.review.shoeInfo.sizeUS}US`}
                      </td>
                    </tr>
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
              <button className="focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="m320-160-56-57 103-103H80v-80h287L264-503l56-57 200 200-200 200Zm320-240L440-600l200-200 56 57-103 103h287v80H593l103 103-56 57Z" />
                </svg>
                Compare with previous version
              </button>
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
        <div className="md:hidden">
          <div className="border-t border-b py-4 mt-7 border-gray-200">
            <div
              data-menu
              className="flex justify-between items-center cursor-pointer"
            >
              <p className="text-base leading-4 text-gray-800">Review</p>
            </div>
            <div
              className="hidden pt-4 text-base leading-normal pr-12 mt-4 text-gray-600"
              id="sect"
            >
              You will be responsible for paying for your own shipping costs for
              returning your item. Shipping costs are nonrefundable
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <div className="border-b py-4 border-gray-200">
            <div
              data-menu
              className="flex justify-between items-center cursor-pointer"
            >
              <p className="text-base leading-4 text-gray-800">
                Previous version
              </p>
            </div>
            <div
              className="pt-4 text-base leading-normal pr-12 mt-4 text-gray-600"
              id="sect"
            >
              If you have any questions on how to return your item to us,
              contact us.
            </div>
          </div>
        </div>
        <button className="md:hidden focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none">
          <svg
            className="mr-3 text-white"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.02301 7.18999C7.48929 6.72386 7.80685 6.12992 7.93555 5.48329C8.06425 4.83666 7.9983 4.16638 7.74604 3.55724C7.49377 2.94809 7.06653 2.42744 6.51835 2.06112C5.97016 1.6948 5.32566 1.49928 4.66634 1.49928C4.00703 1.49928 3.36252 1.6948 2.81434 2.06112C2.26615 2.42744 1.83891 2.94809 1.58665 3.55724C1.33439 4.16638 1.26843 4.83666 1.39713 5.48329C1.52583 6.12992 1.8434 6.72386 2.30968 7.18999L4.66634 9.54749L7.02301 7.18999Z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.66699 4.83333V4.84166"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.69 13.8567C14.1563 13.3905 14.4738 12.7966 14.6025 12.15C14.7312 11.5033 14.6653 10.8331 14.413 10.2239C14.1608 9.61476 13.7335 9.09411 13.1853 8.72779C12.6372 8.36148 11.9926 8.16595 11.3333 8.16595C10.674 8.16595 10.0295 8.36148 9.48133 8.72779C8.93314 9.09411 8.5059 9.61476 8.25364 10.2239C8.00138 10.8331 7.93543 11.5033 8.06412 12.15C8.19282 12.7966 8.51039 13.3905 8.97667 13.8567L11.3333 16.2142L13.69 13.8567Z"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.333 11.5V11.5083"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Check availability in store
        </button>
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
