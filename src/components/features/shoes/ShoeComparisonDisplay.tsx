"use client";

import { Tag } from "antd";
import Image from "next/image";
import Link from "next/link";

import { SanityRunningShoe } from "@/types/RunningShoe";
import {
  prepareHeightInMM,
  prepareListDividedByComma,
  preparePriceInEUR,
  preparePriceInPLN,
  preparePriceInUSD,
  prepareReleaseDate,
  prepareWeight,
} from "@/utils/helpers";

interface ShoeComparisonDisplayProps {
  shoe1: SanityRunningShoe;
  shoe2: SanityRunningShoe;
}

type CompareResult = "shoe1-better" | "shoe2-better" | "same" | "different";

// Helper to compare numeric values where lower is better
const compareLowerIsBetter = (
  val1: number | undefined,
  val2: number | undefined
): CompareResult => {
  if (val1 === undefined || val2 === undefined) return "same";
  if (val1 < val2) return "shoe1-better";
  if (val2 < val1) return "shoe2-better";
  return "same";
};

// Helper to compare text values (just checks if different)
const compareText = (
  val1: string | undefined,
  val2: string | undefined
): CompareResult => {
  if (!val1 && !val2) return "same";
  if (val1 !== val2) return "different";
  return "same";
};

// Get styling for shoe1 based on comparison
const getShoe1Styles = (result: CompareResult): string => {
  switch (result) {
    case "shoe1-better":
      return "text-green-600 font-semibold bg-green-50";
    case "shoe2-better":
      return "text-red-600 font-semibold bg-red-50";
    case "different":
      return "text-blue-600 font-medium bg-blue-50";
    case "same":
    default:
      return "text-gray-600";
  }
};

// Get styling for shoe2 based on comparison
const getShoe2Styles = (result: CompareResult): string => {
  switch (result) {
    case "shoe2-better":
      return "text-green-600 font-semibold bg-green-50";
    case "shoe1-better":
      return "text-red-600 font-semibold bg-red-50";
    case "different":
      return "text-blue-600 font-medium bg-blue-50";
    case "same":
    default:
      return "text-gray-600";
  }
};

// Get difference indicator
const getDifferenceIndicator = (
  val1: number | undefined,
  val2: number | undefined,
  unit: string = "",
  lowerIsBetter: boolean = true
): { shoe1Diff: string; shoe2Diff: string } => {
  if (val1 === undefined || val2 === undefined)
    return { shoe1Diff: "", shoe2Diff: "" };
  const diff = val2 - val1;
  if (diff === 0) return { shoe1Diff: "", shoe2Diff: "" };

  const absDiff = Math.abs(diff);
  const shoe1Better = lowerIsBetter ? val1 < val2 : val1 > val2;

  return {
    shoe1Diff: shoe1Better ? ` (${absDiff}${unit} better)` : "",
    shoe2Diff: !shoe1Better ? ` (${absDiff}${unit} better)` : "",
  };
};

interface ComparisonRowProps {
  label: string;
  value1: React.ReactNode;
  value2: React.ReactNode;
  compareResult?: CompareResult;
  shoe1Diff?: string;
  shoe2Diff?: string;
}

const ComparisonRow = ({
  label,
  value1,
  value2,
  compareResult = "same",
  shoe1Diff = "",
  shoe2Diff = "",
}: ComparisonRowProps) => (
  <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 items-center">
    <div className="font-medium text-gray-700">{label}</div>
    <div
      className={`text-center rounded-md py-1 ${getShoe1Styles(compareResult)}`}
    >
      {value1}
      {shoe1Diff && (
        <span className="text-xs ml-1 opacity-75">{shoe1Diff}</span>
      )}
    </div>
    <div
      className={`text-center rounded-md py-1 ${getShoe2Styles(compareResult)}`}
    >
      {value2}
      {shoe2Diff && (
        <span className="text-xs ml-1 opacity-75">{shoe2Diff}</span>
      )}
    </div>
  </div>
);

interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => (
  <div className="bg-gray-100 py-2 px-4 rounded-lg mt-6 mb-2">
    <h4 className="font-semibold text-gray-800">{title}</h4>
  </div>
);

export default function ShoeComparisonDisplay({
  shoe1,
  shoe2,
}: ShoeComparisonDisplayProps) {
  // Compute comparison results
  const mWeightResult = compareLowerIsBetter(
    shoe1.specs.m?.weight,
    shoe2.specs.m?.weight
  );
  const wWeightResult = compareLowerIsBetter(
    shoe1.specs.w?.weight,
    shoe2.specs.w?.weight
  );
  const mStackResult = compareText(
    shoe1.specs.m?.heelStack?.toString(),
    shoe2.specs.m?.heelStack?.toString()
  );
  const wStackResult = compareText(
    shoe1.specs.w?.heelStack?.toString(),
    shoe2.specs.w?.heelStack?.toString()
  );
  const mDropResult = compareText(
    shoe1.specs.m?.drop?.toString(),
    shoe2.specs.m?.drop?.toString()
  );
  const wDropResult = compareText(
    shoe1.specs.w?.drop?.toString(),
    shoe2.specs.w?.drop?.toString()
  );
  const upperResult = compareText(shoe1.specs.upper, shoe2.specs.upper);
  const foamResult = compareText(shoe1.specs.foam, shoe2.specs.foam);
  const plateResult = compareText(shoe1.specs.plate, shoe2.specs.plate);
  const outsoleResult = compareText(shoe1.specs.outsole, shoe2.specs.outsole);
  const purposeResult = compareText(shoe1.purpose, shoe2.purpose);
  const stabilityResult = compareText(shoe1.stability, shoe2.stability);

  // Price comparisons
  const usPriceResult = compareLowerIsBetter(
    shoe1.releaseInfo?.us?.price,
    shoe2.releaseInfo?.us?.price
  );
  const euPriceResult = compareLowerIsBetter(
    shoe1.releaseInfo?.eu?.price,
    shoe2.releaseInfo?.eu?.price
  );
  const plPriceResult = compareLowerIsBetter(
    shoe1.releaseInfo?.pl?.price,
    shoe2.releaseInfo?.pl?.price
  );

  // Difference indicators
  const mWeightDiff = getDifferenceIndicator(
    shoe1.specs.m?.weight,
    shoe2.specs.m?.weight,
    "g",
    true
  );
  const wWeightDiff = getDifferenceIndicator(
    shoe1.specs.w?.weight,
    shoe2.specs.w?.weight,
    "g",
    true
  );
  const mStackDiff = getDifferenceIndicator(
    shoe1.specs.m?.heelStack,
    shoe2.specs.m?.heelStack,
    "mm",
    false
  );
  const wStackDiff = getDifferenceIndicator(
    shoe1.specs.w?.heelStack,
    shoe2.specs.w?.heelStack,
    "mm",
    false
  );
  const mDropDiff = getDifferenceIndicator(
    shoe1.specs.m?.drop,
    shoe2.specs.m?.drop,
    "mm",
    false
  );
  const wDropDiff = getDifferenceIndicator(
    shoe1.specs.w?.drop,
    shoe2.specs.w?.drop,
    "mm",
    false
  );
  const usPriceDiff = getDifferenceIndicator(
    shoe1.releaseInfo?.us?.price,
    shoe2.releaseInfo?.us?.price,
    "$",
    true
  );
  const euPriceDiff = getDifferenceIndicator(
    shoe1.releaseInfo?.eu?.price,
    shoe2.releaseInfo?.eu?.price,
    "€",
    true
  );
  const plPriceDiff = getDifferenceIndicator(
    shoe1.releaseInfo?.pl?.price,
    shoe2.releaseInfo?.pl?.price,
    "zł",
    true
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Shoe Comparison</h2>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-sm justify-center mb-6">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500"></span>
          <span>Better</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500"></span>
          <span>Worse</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-500"></span>
          <span>Different</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-400"></span>
          <span>Same</span>
        </div>
      </div>

      {/* Header with shoe images and names */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-4">
            {shoe1.image ? (
              <Image
                src={shoe1.image.url}
                alt={shoe1.name}
                fill
                className="object-cover rounded-lg"
                sizes="192px"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            <Link
              href={`/shoes/${shoe1.slug.current}`}
              className="hover:text-blue-600 transition-colors"
            >
              {shoe1.name}
            </Link>
          </h3>
          <p className="text-gray-600">{shoe1.brand?.name}</p>
        </div>

        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-4">
            {shoe2.image ? (
              <Image
                src={shoe2.image.url}
                alt={shoe2.name}
                fill
                className="object-cover rounded-lg"
                sizes="192px"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            <Link
              href={`/shoes/${shoe2.slug.current}`}
              className="hover:text-blue-600 transition-colors"
            >
              {shoe2.name}
            </Link>
          </h3>
          <p className="text-gray-600">{shoe2.brand?.name}</p>
        </div>
      </div>

      {/* Comparison Content */}
      <div>
        {/* Header Row */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b-2 border-gray-200">
          <div className="col-span-1"></div>
          <div className="text-center font-bold text-lg text-gray-700">
            {shoe1.name}
          </div>
          <div className="text-center font-bold text-lg text-gray-700">
            {shoe2.name}
          </div>
        </div>

        {/* General Info Section */}
        <SectionHeader title="General Information" />

        <ComparisonRow
          label="Purpose"
          value1={shoe1.purpose || "-"}
          value2={shoe2.purpose || "-"}
          compareResult={purposeResult}
        />

        <ComparisonRow
          label="Stability"
          value1={shoe1.stability || "-"}
          value2={shoe2.stability || "-"}
          compareResult={stabilityResult}
        />

        <ComparisonRow
          label="Categories"
          value1={
            shoe1.categories?.length ? (
              <div className="flex flex-wrap gap-1 justify-center">
                {shoe1.categories.map((cat) => (
                  <Tag key={cat} className="text-xs">
                    {cat}
                  </Tag>
                ))}
              </div>
            ) : (
              "-"
            )
          }
          value2={
            shoe2.categories?.length ? (
              <div className="flex flex-wrap gap-1 justify-center">
                {shoe2.categories.map((cat) => (
                  <Tag key={cat} className="text-xs">
                    {cat}
                  </Tag>
                ))}
              </div>
            ) : (
              "-"
            )
          }
          compareResult={
            JSON.stringify(shoe1.categories) !==
            JSON.stringify(shoe2.categories)
              ? "different"
              : "same"
          }
        />

        <ComparisonRow
          label="Wide Available"
          value1={shoe1.wideAvailable ? "✓ Yes" : "✗ No"}
          value2={shoe2.wideAvailable ? "✓ Yes" : "✗ No"}
          compareResult={
            shoe1.wideAvailable === shoe2.wideAvailable
              ? "same"
              : shoe1.wideAvailable
                ? "shoe1-better"
                : "shoe2-better"
          }
        />

        <ComparisonRow
          label="Waterproof Available"
          value1={shoe1.waterproofAvailable ? "✓ Yes" : "✗ No"}
          value2={shoe2.waterproofAvailable ? "✓ Yes" : "✗ No"}
          compareResult={
            shoe1.waterproofAvailable === shoe2.waterproofAvailable
              ? "same"
              : shoe1.waterproofAvailable
                ? "shoe1-better"
                : "shoe2-better"
          }
        />

        {/* Men's Specs Section */}
        <SectionHeader title="Men's Specifications" />

        <ComparisonRow
          label="Weight"
          value1={prepareWeight(shoe1.specs.m?.weight)}
          value2={prepareWeight(shoe2.specs.m?.weight)}
          compareResult={mWeightResult}
          shoe1Diff={mWeightDiff.shoe1Diff}
          shoe2Diff={mWeightDiff.shoe2Diff}
        />

        <ComparisonRow
          label="Heel Stack Height"
          value1={prepareHeightInMM(shoe1.specs.m?.heelStack)}
          value2={prepareHeightInMM(shoe2.specs.m?.heelStack)}
          compareResult={mStackResult}
          shoe1Diff={mStackDiff.shoe1Diff}
          shoe2Diff={mStackDiff.shoe2Diff}
        />

        <ComparisonRow
          label="Drop"
          value1={prepareHeightInMM(shoe1.specs.m?.drop)}
          value2={prepareHeightInMM(shoe2.specs.m?.drop)}
          compareResult={mDropResult}
          shoe1Diff={mDropDiff.shoe1Diff}
          shoe2Diff={mDropDiff.shoe2Diff}
        />

        {/* Women's Specs Section */}
        <SectionHeader title="Women's Specifications" />

        <ComparisonRow
          label="Weight"
          value1={prepareWeight(shoe1.specs.w?.weight)}
          value2={prepareWeight(shoe2.specs.w?.weight)}
          compareResult={wWeightResult}
          shoe1Diff={wWeightDiff.shoe1Diff}
          shoe2Diff={wWeightDiff.shoe2Diff}
        />

        <ComparisonRow
          label="Heel Stack Height"
          value1={prepareHeightInMM(shoe1.specs.w?.heelStack)}
          value2={prepareHeightInMM(shoe2.specs.w?.heelStack)}
          compareResult={wStackResult}
          shoe1Diff={wStackDiff.shoe1Diff}
          shoe2Diff={wStackDiff.shoe2Diff}
        />

        <ComparisonRow
          label="Drop"
          value1={prepareHeightInMM(shoe1.specs.w?.drop)}
          value2={prepareHeightInMM(shoe2.specs.w?.drop)}
          compareResult={wDropResult}
          shoe1Diff={wDropDiff.shoe1Diff}
          shoe2Diff={wDropDiff.shoe2Diff}
        />

        {/* Materials Section */}
        <SectionHeader title="Materials & Construction" />

        <ComparisonRow
          label="Upper"
          value1={prepareListDividedByComma(shoe1.specs.upper)}
          value2={prepareListDividedByComma(shoe2.specs.upper)}
          compareResult={upperResult}
        />

        <ComparisonRow
          label="Foam"
          value1={prepareListDividedByComma(shoe1.specs.foam)}
          value2={prepareListDividedByComma(shoe2.specs.foam)}
          compareResult={foamResult}
        />

        <ComparisonRow
          label="Plate"
          value1={shoe1.specs.plate ?? "-"}
          value2={shoe2.specs.plate ?? "-"}
          compareResult={plateResult}
        />

        <ComparisonRow
          label="Outsole"
          value1={prepareListDividedByComma(shoe1.specs.outsole)}
          value2={prepareListDividedByComma(shoe2.specs.outsole)}
          compareResult={outsoleResult}
        />

        {/* Pricing & Availability Section */}
        <SectionHeader title="Pricing & Release" />

        <ComparisonRow
          label="US Price"
          value1={preparePriceInUSD(shoe1.releaseInfo)}
          value2={preparePriceInUSD(shoe2.releaseInfo)}
          compareResult={usPriceResult}
          shoe1Diff={usPriceDiff.shoe1Diff}
          shoe2Diff={usPriceDiff.shoe2Diff}
        />

        <ComparisonRow
          label="EU Price"
          value1={preparePriceInEUR(shoe1.releaseInfo)}
          value2={preparePriceInEUR(shoe2.releaseInfo)}
          compareResult={euPriceResult}
          shoe1Diff={euPriceDiff.shoe1Diff}
          shoe2Diff={euPriceDiff.shoe2Diff}
        />

        <ComparisonRow
          label="PL Price"
          value1={preparePriceInPLN(shoe1.releaseInfo)}
          value2={preparePriceInPLN(shoe2.releaseInfo)}
          compareResult={plPriceResult}
          shoe1Diff={plPriceDiff.shoe1Diff}
          shoe2Diff={plPriceDiff.shoe2Diff}
        />

        <ComparisonRow
          label="US Release Date"
          value1={prepareReleaseDate(shoe1.releaseInfo?.us?.date)}
          value2={prepareReleaseDate(shoe2.releaseInfo?.us?.date)}
          compareResult="same"
        />

        <ComparisonRow
          label="EU Release Date"
          value1={prepareReleaseDate(shoe1.releaseInfo?.eu?.date)}
          value2={prepareReleaseDate(shoe2.releaseInfo?.eu?.date)}
          compareResult="same"
        />

        {/* Summary Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">
            Key Differences Summary
          </h4>
          <div className="space-y-2 text-sm">
            {mWeightResult === "shoe1-better" && (
              <div className="flex items-center gap-2 text-green-600">
                <span>✓</span>
                <span>
                  {shoe1.name} is lighter (men&apos;s:{" "}
                  {mWeightDiff.shoe1Diff.trim()})
                </span>
              </div>
            )}
            {mWeightResult === "shoe2-better" && (
              <div className="flex items-center gap-2 text-green-600">
                <span>✓</span>
                <span>
                  {shoe2.name} is lighter (men&apos;s:{" "}
                  {mWeightDiff.shoe2Diff.trim()})
                </span>
              </div>
            )}
            {wWeightResult === "shoe1-better" && (
              <div className="flex items-center gap-2 text-green-600">
                <span>✓</span>
                <span>
                  {shoe1.name} is lighter (women&apos;s:{" "}
                  {wWeightDiff.shoe1Diff.trim()})
                </span>
              </div>
            )}
            {wWeightResult === "shoe2-better" && (
              <div className="flex items-center gap-2 text-green-600">
                <span>✓</span>
                <span>
                  {shoe2.name} is lighter (women&apos;s:{" "}
                  {wWeightDiff.shoe2Diff.trim()})
                </span>
              </div>
            )}
            {foamResult === "different" && (
              <div className="flex items-center gap-2 text-blue-600">
                <span>↔</span>
                <span>
                  Different foam: {shoe1.specs.foam ?? "None"} vs{" "}
                  {shoe2.specs.foam ?? "None"}
                </span>
              </div>
            )}
            {upperResult === "different" && (
              <div className="flex items-center gap-2 text-blue-600">
                <span>↔</span>
                <span>Different upper materials</span>
              </div>
            )}
            {outsoleResult === "different" && (
              <div className="flex items-center gap-2 text-blue-600">
                <span>↔</span>
                <span>Different outsole</span>
              </div>
            )}
            {plateResult === "different" && (
              <div className="flex items-center gap-2 text-blue-600">
                <span>↔</span>
                <span>
                  Different plate: {shoe1.specs.plate ?? "None"} vs{" "}
                  {shoe2.specs.plate ?? "None"}
                </span>
              </div>
            )}
            {usPriceResult === "shoe1-better" && (
              <div className="flex items-center gap-2 text-green-600">
                <span>✓</span>
                <span>{shoe1.name} is more affordable (US)</span>
              </div>
            )}
            {usPriceResult === "shoe2-better" && (
              <div className="flex items-center gap-2 text-green-600">
                <span>✓</span>
                <span>{shoe2.name} is more affordable (US)</span>
              </div>
            )}
            {purposeResult === "different" && (
              <div className="flex items-center gap-2 text-blue-600">
                <span>↔</span>
                <span>
                  Different purpose: {shoe1.purpose} vs {shoe2.purpose}
                </span>
              </div>
            )}
            {shoe1.wideAvailable !== shoe2.wideAvailable && (
              <div className="flex items-center gap-2 text-blue-600">
                <span>↔</span>
                <span>
                  Wide option: {shoe1.wideAvailable ? shoe1.name : shoe2.name}{" "}
                  offers wide fit
                </span>
              </div>
            )}
            {shoe1.waterproofAvailable !== shoe2.waterproofAvailable && (
              <div className="flex items-center gap-2 text-blue-600">
                <span>↔</span>
                <span>
                  Waterproof:{" "}
                  {shoe1.waterproofAvailable ? shoe1.name : shoe2.name} offers
                  waterproof version
                </span>
              </div>
            )}
            {mWeightResult === "same" &&
              wWeightResult === "same" &&
              foamResult === "same" &&
              upperResult === "same" &&
              outsoleResult === "same" &&
              plateResult === "same" &&
              usPriceResult === "same" &&
              purposeResult === "same" && (
                <div className="text-gray-500">
                  These shoes have very similar specifications.
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
