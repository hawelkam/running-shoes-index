import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import React from "react";
import CompareModal from "../_components/CompareModal";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import { Image, Tabs } from "antd";
import {
  isCurrentYearRelease,
  prepareHeightInMM,
  preparePriceInEUR,
  preparePriceInPLN,
  preparePriceInUSD,
  preparePurposeSlug,
  prepareReleaseDate,
  prepareWeight,
} from "@/_utils/helpers";
import Link from "next/link";

type Params = Promise<{ slug: string }>;

async function getShoe(slug: string): Promise<SanityRunningShoe | null> {
  try {
    const shoe = await client.fetch<SanityRunningShoe>(
      `*[_type == "runningShoe" && slug.current == "${slug}"][0]{_id, name, brand->, purpose, releaseInfo, category[]->, stability, specs { m, w, upper[]->, foam[]->, plate, outsole[]->}, notes, previousVersion-> { name, releaseInfo, category[]->, slug, image, specs { m, w, upper[]->, foam[]->, plate, outsole[]->}, stability, notes}, image, review}`,
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

  const tabsItems = shoe && [
    {
      label: (
        <button
          className="tab-btn whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm "
          data-tab="specs"
        >
          Detailed Specs
        </button>
      ),
      key: "specs",
      children: (
        <div id="general-info" className="tab-content">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  Men&apos;s Specifications
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight</span>
                    <span>{prepareWeight(shoe.specs.m?.weight) || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drop</span>
                    <span className="font-medium">
                      {prepareHeightInMM(shoe.specs.m?.drop)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stack Height</span>
                    <span className="font-medium">
                      {prepareHeightInMM(shoe.specs.m?.heelStack)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-pink-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  Women&apos;s Specifications
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight</span>
                    <span>{prepareWeight(shoe.specs.w?.weight)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drop</span>
                    <span className="font-medium">
                      {prepareHeightInMM(shoe.specs.w?.drop)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stack Height</span>
                    <span className="font-medium">
                      {prepareHeightInMM(shoe.specs.w?.heelStack)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Notes</h3>
                <p className="text-gray-700">
                  {shoe.notes || "No additional notes available for this shoe."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: (
        <button
          className="tab-btn whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          data-tab="general-info"
        >
          General Info
        </button>
      ),
      key: "general-info",
      children: (
        <div id="general-info" className="tab-content">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-6">
              Pricing &amp; Release Information
            </h3>

            <div className="mb-8">
              <h4 className="text-lg font-medium mb-3 text-gray-800">Price</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">USD</div>
                  <div className="text-xl font-bold">
                    {preparePriceInUSD(shoe.releaseInfo)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">EUR</div>
                  <div className="text-xl font-bold">
                    {preparePriceInEUR(shoe.releaseInfo)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">PLN</div>
                  <div className="text-xl font-bold">
                    {preparePriceInPLN(shoe.releaseInfo)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-3 text-gray-800">
                Release Dates
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">United States</div>
                  <div className="font-medium">
                    {prepareReleaseDate(shoe.releaseInfo.us?.date)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">European Union</div>
                  <div className="font-medium">
                    {prepareReleaseDate(shoe.releaseInfo.eu?.date)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Poland</div>
                  <div className="font-medium">
                    {prepareReleaseDate(shoe.releaseInfo.pl?.date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    shoe.previousVersion && {
      label: (
        <button
          className="tab-btn whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          data-tab="previous-version"
        >
          Previous Version
        </button>
      ),
      key: "previous-version",
      children: (
        <div id="previous-tab" className="tab-content">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  <Link href={`/shoes/${shoe.previousVersion.slug.current}`}>
                    {shoe.previousVersion?.name}
                  </Link>
                </h3>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-32">US Release:</span>
                    <span>
                      {prepareReleaseDate(
                        shoe.previousVersion.releaseInfo.us?.date
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-32">EU Release:</span>
                    <span>
                      {prepareReleaseDate(
                        shoe.previousVersion.releaseInfo.eu?.date
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-32">PL Release:</span>
                    <span>
                      {prepareReleaseDate(
                        shoe.previousVersion.releaseInfo.pl?.date
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <Image
                src={shoe.previousVersion.image?.url || ""}
                alt={shoe.previousVersion.name}
                className="w-full md:w-64 h-auto rounded-lg mb-4 md:mb-0"
              />
              {shoe && <CompareModal shoe={shoe} />}
            </div>
          </div>
        </div>
      ),
    },
    shoe.review && {
      label: (
        <button
          className="tab-btn whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm "
          data-tab="my-review"
        >
          My review
        </button>
      ),
      key: "my-review",
      children: (
        <div id="review-tab" className="tab-content">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-6">My Review</h3>

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">
                  Reviewed Shoe Weight - Left
                </div>
                <div className="font-medium">
                  {prepareWeight(shoe.review.shoeInfo.weightL)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">
                  Reviewed Shoe Weight - Right
                </div>
                <div className="font-medium">
                  {prepareWeight(shoe.review.shoeInfo.weightR)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Reviewed Shoe Size</div>
                <div className="font-medium">
                  US Men&apos;s {shoe.review.shoeInfo.sizeUS} / EU{" "}
                  {shoe.review.shoeInfo.sizeEU}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {shoe.review.enReview && (
                <div>
                  <h4 className="text-lg font-medium mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      ></path>
                    </svg>
                    English Reviews
                  </h4>
                  <div className="space-y-3">
                    {shoe.review.enReview.youtube && (
                      <a
                        href={shoe.review.enReview.youtube}
                        className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
                      >
                        <div className="font-medium">YouTube Review</div>
                      </a>
                    )}
                    {shoe.review.enReview.instagram && (
                      <a
                        href={shoe.review.enReview.instagram}
                        className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
                      >
                        <div className="font-medium">Instagram Review</div>
                      </a>
                    )}
                    {shoe.review.enReview.tiktok && (
                      <a
                        href={shoe.review.enReview.tiktok}
                        className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
                      >
                        <div className="font-medium">TikTok Review</div>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {shoe.review.plReview && (
                <div>
                  <h4 className="text-lg font-medium mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      ></path>
                    </svg>
                    Polish Reviews
                  </h4>
                  <div className="space-y-3">
                    {shoe.review.plReview.youtube && (
                      <a
                        href={shoe.review.plReview.youtube}
                        className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
                      >
                        <div className="font-medium">YouTube Review</div>
                      </a>
                    )}
                    {shoe.review.plReview.instagram && (
                      <a
                        href={shoe.review.plReview.instagram}
                        className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
                      >
                        <div className="font-medium">Instagram Review</div>
                      </a>
                    )}
                    {shoe.review.plReview.tiktok && (
                      <a
                        href={shoe.review.plReview.tiktok}
                        className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
                      >
                        <div className="font-medium">TikTok Review</div>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
  ];

  if (!shoe) {
    notFound(); // Trigger 404 page if the shoe is not found
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href={`/shoes/${preparePurposeSlug(shoe.purpose)}`}
              className="text-gray-700 hover:text-blue-600"
            >
              {shoe.purpose || "Running Shoes"}
            </Link>
          </li>
          {shoe.brand && (
            <li>
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  ></path>
                </svg>
                <Link
                  href={`/brands/${shoe.brand.slug.current}`}
                  className="text-gray-700 hover:text-blue-600 ml-1 md:ml-2"
                >
                  {shoe.brand.name}
                </Link>
              </div>
            </li>
          )}
          {shoe.name && (
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  ></path>
                </svg>
                <span className="text-gray-500 ml-1 md:ml-2">{shoe.name}</span>
              </div>
            </li>
          )}
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {shoe.image && <Image src={shoe.image.url} alt="" />}

        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{shoe.name}</h1>
          {isCurrentYearRelease(shoe.releaseInfo.eu?.date) && (
            <div className="bg-blue-600 text-white inline-block px-4 py-1 rounded-full text-sm font-medium mb-6">
              New Release
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Category</span>
                <span className="font-medium">
                  {shoe.category?.map((cat) => cat.name).join(", ")}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Stability</span>
                <span className="font-medium">{shoe.stability}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Upper</span>
                <span className="font-medium">
                  {shoe.specs.upper?.map((upp) => upp.name).join(", ")}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Foam</span>
                <span className="font-medium">
                  {shoe.specs.foam?.map((foam) => foam.name).join(", ")}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Plate</span>
                <span className="font-medium">{shoe.specs.plate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Outsole</span>
                <span className="font-medium">
                  {shoe.specs.outsole
                    ?.map((outsole) => outsole.name)
                    .join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs
          defaultActiveKey="1"
          type="card"
          size={"large"}
          items={tabsItems || []}
        />
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
