import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import React from "react";
import { SanityRunningShoe } from "../page";

type Params = Promise<{ slug: string }>;

async function getShoe(slug: string): Promise<SanityRunningShoe | null> {
  try {
    const shoe = await client.fetch<SanityRunningShoe>(
      `*[_type == "runningShoe" && slug.current == "${slug}"][0]{_id, name, brand->, shoeType->, pricePln, priceEur, priceUsd, category, stability, weightM, dropM, heelStackM, weightW, dropW, heelStackW, releaseDatePL, releaseDateEU, foam, plate, outsole, notes, previousVersion->, image, reviewedWeight, reviewedSize, ytReviewPL, ytReviewEN, igReviewPL, igReviewEN, ttReviewPL, ttReviewEN}`,
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
    <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
      <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
        <img
          className="w-full"
          alt="image of running shoe"
          src={shoe.image.url}
        />
      </div>
      <div className="md:hidden">
        <img
          className="w-full"
          alt="image of running shoe"
          src={shoe.image.url}
        />
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
        <div className="py-4 border-b border-gray-200 flex items-center justify-between">
          <p className="text-base leading-4 text-gray-800">Price</p>
          <div className="flex items-center justify-center">
            <p className="text-sm leading-none text-gray-600 ">
              {shoe.pricePln}zł | {shoe.priceEur}€ | {shoe.priceUsd}$
            </p>
          </div>
        </div>
        {shoe.category && (
          <div className="py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-base leading-4 text-gray-800 ">Category</p>
            <div className="flex gap-2 items-center justify-center">
              {shoe.category.map((cat, index) => (
                <div
                  className="center relative inline-block select-none whitespace-nowrap rounded-lg bg-blue-500 py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white"
                  key={`${shoe.name}-category-${index}`}
                >
                  <div className="mt-px">{cat}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="py-4 border-b border-gray-200">
          <p className="text-base leading-4 text-gray-800">Specification</p>
          <p className="text-base leading-4 mt-7 text-gray-600">
            Men&apos;s weight: {shoe.weightM}g
          </p>
          <p className="text-base leading-4 mt-4 text-gray-600">
            Men&apos;s drop: {shoe.dropM}mm
          </p>
          <p className="text-base leading-4 mt-4 text-gray-600">
            Men&apos;s stack height: {shoe.heelStackM}mm -{" "}
            {shoe.heelStackM - shoe.dropM}mm
          </p>
          <p className="text-base leading-4 mt-7 text-gray-600">
            Women&apos;s weight: {shoe.weightW}g
          </p>
          <p className="text-base leading-4 mt-4 text-gray-600">
            Women&apos;s drop: {shoe.dropW}mm
          </p>
          <p className="text-base leading-4 mt-4 text-gray-600">
            Women&apos;s stack height: {shoe.heelStackW}mm -{" "}
            {shoe.heelStackW - shoe.dropW}mm
          </p>
          <p className="text-base leading-4 mt-7 text-gray-600">
            Foam: {shoe.foam}
          </p>
          <p className="text-base leading-4 text-gray-600 mt-4">
            Plate: {shoe.plate}
          </p>
          <p className="text-base leading-4 text-gray-600 mt-4">
            Outsole: {shoe.outsole}
          </p>
          <p className="text-base leading-4 text-gray-600 mt-4">
            Notes: {shoe.notes}
          </p>
        </div>
        <div>
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
        <div>
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
        <button className="focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none">
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
