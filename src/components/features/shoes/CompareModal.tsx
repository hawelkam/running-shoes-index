"use client";

import { Button, Tag } from "antd";
import Image from "next/image";
import { useState } from "react";

import { ReleaseInfo, SanityRunningShoe } from "@/types/RunningShoe";
import {
  prepareHeightInMM,
  prepareListDividedByComma,
  preparePriceInEUR,
  preparePriceInPLN,
  preparePriceInUSD,
  prepareReleaseDate,
  prepareWeight,
} from "@/utils/helpers";

interface ModalProps {
  shoe: SanityRunningShoe;
}

type CompareResult = "better" | "worse" | "same" | "neutral";

// Helper to determine if a lower numeric value is better (e.g., weight, price)
const compareLowerIsBetter = (
  oldVal: number | undefined,
  newVal: number | undefined
): CompareResult => {
  if (oldVal === undefined || newVal === undefined) return "neutral";
  if (newVal < oldVal) return "better";
  if (newVal > oldVal) return "worse";
  return "same";
};

// Helper to determine if values are different (for text comparisons)
const compareTextChanged = (
  oldVal: string | undefined,
  newVal: string | undefined
): CompareResult => {
  if (!oldVal && !newVal) return "same";
  if (oldVal !== newVal) return "neutral";
  return "same";
};

// Get styling based on comparison result
const getCompareStyles = (result: CompareResult): string => {
  switch (result) {
    case "better":
      return "text-green-600 font-semibold bg-green-50";
    case "worse":
      return "text-red-600 font-semibold bg-red-50";
    case "neutral":
      return "text-blue-600 font-medium bg-blue-50";
    case "same":
    default:
      return "text-gray-600";
  }
};

// Get difference indicator
const getDifferenceIndicator = (
  oldVal: number | undefined,
  newVal: number | undefined,
  unit: string = "",
  lowerIsBetter: boolean = true
): string => {
  if (oldVal === undefined || newVal === undefined) return "";
  const diff = newVal - oldVal;
  if (diff === 0) return "";
  const sign = diff > 0 ? "+" : "";
  const indicator = lowerIsBetter
    ? diff < 0
      ? "↓"
      : "↑"
    : diff > 0
      ? "↑"
      : "↓";
  return ` (${sign}${diff}${unit} ${indicator})`;
};

// Compare price (using USD as primary comparison)
const comparePrices = (
  oldInfo: ReleaseInfo | undefined,
  newInfo: ReleaseInfo | undefined
): CompareResult => {
  const oldPrice =
    oldInfo?.us?.price ?? oldInfo?.eu?.price ?? oldInfo?.pl?.price;
  const newPrice =
    newInfo?.us?.price ?? newInfo?.eu?.price ?? newInfo?.pl?.price;
  return compareLowerIsBetter(oldPrice, newPrice);
};

interface ComparisonRowProps {
  label: string;
  oldValue: React.ReactNode;
  newValue: React.ReactNode;
  compareResult?: CompareResult;
  difference?: string;
}

const ComparisonRow = ({
  label,
  oldValue,
  newValue,
  compareResult = "neutral",
  difference = "",
}: ComparisonRowProps) => (
  <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 items-center">
    <div className="font-medium text-gray-700">{label}</div>
    <div className="text-center text-gray-500">{oldValue}</div>
    <div
      className={`text-center rounded-md py-1 ${getCompareStyles(compareResult)}`}
    >
      {newValue}
      {difference && (
        <span className="text-xs ml-1 opacity-75">{difference}</span>
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

const CompareModal = ({ shoe }: ModalProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const prev = shoe.previousVersion;

  if (!prev) return null;

  // Compute comparison results
  const mWeightResult = compareLowerIsBetter(
    prev.specs.m?.weight,
    shoe.specs.m?.weight
  );
  const wWeightResult = compareLowerIsBetter(
    prev.specs.w?.weight,
    shoe.specs.w?.weight
  );
  const mStackResult = compareTextChanged(
    prev.specs.m?.heelStack?.toString(),
    shoe.specs.m?.heelStack?.toString()
  );
  const wStackResult = compareTextChanged(
    prev.specs.w?.heelStack?.toString(),
    shoe.specs.w?.heelStack?.toString()
  );
  const mDropResult = compareTextChanged(
    prev.specs.m?.drop?.toString(),
    shoe.specs.m?.drop?.toString()
  );
  const wDropResult = compareTextChanged(
    prev.specs.w?.drop?.toString(),
    shoe.specs.w?.drop?.toString()
  );
  const upperResult = compareTextChanged(prev.specs.upper, shoe.specs.upper);
  const foamResult = compareTextChanged(prev.specs.foam, shoe.specs.foam);
  const plateResult = compareTextChanged(prev.specs.plate, shoe.specs.plate);
  const outsoleResult = compareTextChanged(
    prev.specs.outsole,
    shoe.specs.outsole
  );
  const priceResult = comparePrices(prev.releaseInfo, shoe.releaseInfo);
  const purposeResult = compareTextChanged(prev.purpose, shoe.purpose);
  const stabilityResult = compareTextChanged(prev.stability, shoe.stability);

  return (
    <>
      <Button type="primary" onClick={() => setIsOpened(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="m320-160-56-57 103-103H80v-80h287L264-503l56-57 200 200-200 200Zm320-240L440-600l200-200 56 57-103 103h287v80H593l103 103-56 57Z" />
        </svg>
        Compare with {prev.name}
      </Button>
      <div
        id="comparisonModal"
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpened ? "flex" : "hidden"} items-center justify-center p-4`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpened(false);
        }}
      >
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <div>
              <h3 className="text-xl font-bold">Model Comparison</h3>
              <p className="text-sm text-gray-500 mt-1">
                Comparing {prev.name} → {shoe.name}
              </p>
            </div>
            <button
              id="closeModal"
              className="text-gray-400 hover:text-gray-500 p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsOpened(false)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Legend */}
          <div className="px-6 pt-4 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500"></span>
              <span>Better/Improved</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500"></span>
              <span>Worse</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-500"></span>
              <span>Changed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gray-400"></span>
              <span>Unchanged</span>
            </div>
          </div>

          <div className="p-6">
            {/* Header Row with Images */}
            <div className="grid grid-cols-3 gap-4 pb-4 border-b-2 border-gray-200">
              <div className="col-span-1"></div>
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-3">
                  {prev.image ? (
                    <Image
                      src={prev.image.url}
                      alt={prev.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="128px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <div className="font-bold text-lg text-gray-500">
                  {prev.name}
                </div>
                <div className="text-xs text-gray-400">Previous Version</div>
              </div>
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-3">
                  {shoe.image ? (
                    <Image
                      src={shoe.image.url}
                      alt={shoe.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="128px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <div className="font-bold text-lg text-blue-600">
                  {shoe.name}
                </div>
                <div className="text-xs text-gray-400">Current Version</div>
              </div>
            </div>

            {/* General Info Section */}
            <SectionHeader title="General Information" />

            <ComparisonRow
              label="Purpose"
              oldValue={prev.purpose || "-"}
              newValue={shoe.purpose || "-"}
              compareResult={purposeResult}
            />

            <ComparisonRow
              label="Stability"
              oldValue={prev.stability || "-"}
              newValue={shoe.stability || "-"}
              compareResult={stabilityResult}
            />

            <ComparisonRow
              label="Categories"
              oldValue={
                prev.categories?.length ? (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {prev.categories.map((cat) => (
                      <Tag key={cat} className="text-xs">
                        {cat}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  "-"
                )
              }
              newValue={
                shoe.categories?.length ? (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {shoe.categories.map((cat) => (
                      <Tag key={cat} color="blue" className="text-xs">
                        {cat}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  "-"
                )
              }
              compareResult={
                JSON.stringify(prev.categories) !==
                JSON.stringify(shoe.categories)
                  ? "neutral"
                  : "same"
              }
            />

            <ComparisonRow
              label="Wide Available"
              oldValue={prev.wideAvailable ? "✓ Yes" : "✗ No"}
              newValue={shoe.wideAvailable ? "✓ Yes" : "✗ No"}
              compareResult={
                shoe.wideAvailable && !prev.wideAvailable
                  ? "better"
                  : !shoe.wideAvailable && prev.wideAvailable
                    ? "worse"
                    : "same"
              }
            />

            <ComparisonRow
              label="Waterproof Available"
              oldValue={prev.waterproofAvailable ? "✓ Yes" : "✗ No"}
              newValue={shoe.waterproofAvailable ? "✓ Yes" : "✗ No"}
              compareResult={
                shoe.waterproofAvailable && !prev.waterproofAvailable
                  ? "better"
                  : !shoe.waterproofAvailable && prev.waterproofAvailable
                    ? "worse"
                    : "same"
              }
            />

            {/* Men's Specs Section */}
            <SectionHeader title="Men's Specifications" />

            <ComparisonRow
              label="Weight"
              oldValue={prepareWeight(prev.specs.m?.weight)}
              newValue={prepareWeight(shoe.specs.m?.weight)}
              compareResult={mWeightResult}
              difference={getDifferenceIndicator(
                prev.specs.m?.weight,
                shoe.specs.m?.weight,
                "g",
                true
              )}
            />

            <ComparisonRow
              label="Heel Stack Height"
              oldValue={prepareHeightInMM(prev.specs.m?.heelStack)}
              newValue={prepareHeightInMM(shoe.specs.m?.heelStack)}
              compareResult={mStackResult}
              difference={getDifferenceIndicator(
                prev.specs.m?.heelStack,
                shoe.specs.m?.heelStack,
                "mm",
                false
              )}
            />

            <ComparisonRow
              label="Drop"
              oldValue={prepareHeightInMM(prev.specs.m?.drop)}
              newValue={prepareHeightInMM(shoe.specs.m?.drop)}
              compareResult={mDropResult}
              difference={getDifferenceIndicator(
                prev.specs.m?.drop,
                shoe.specs.m?.drop,
                "mm",
                false
              )}
            />

            {/* Women's Specs Section */}
            <SectionHeader title="Women's Specifications" />

            <ComparisonRow
              label="Weight"
              oldValue={prepareWeight(prev.specs.w?.weight)}
              newValue={prepareWeight(shoe.specs.w?.weight)}
              compareResult={wWeightResult}
              difference={getDifferenceIndicator(
                prev.specs.w?.weight,
                shoe.specs.w?.weight,
                "g",
                true
              )}
            />

            <ComparisonRow
              label="Heel Stack Height"
              oldValue={prepareHeightInMM(prev.specs.w?.heelStack)}
              newValue={prepareHeightInMM(shoe.specs.w?.heelStack)}
              compareResult={wStackResult}
              difference={getDifferenceIndicator(
                prev.specs.w?.heelStack,
                shoe.specs.w?.heelStack,
                "mm",
                false
              )}
            />

            <ComparisonRow
              label="Drop"
              oldValue={prepareHeightInMM(prev.specs.w?.drop)}
              newValue={prepareHeightInMM(shoe.specs.w?.drop)}
              compareResult={wDropResult}
              difference={getDifferenceIndicator(
                prev.specs.w?.drop,
                shoe.specs.w?.drop,
                "mm",
                false
              )}
            />

            {/* Materials Section */}
            <SectionHeader title="Materials & Construction" />

            <ComparisonRow
              label="Upper"
              oldValue={prepareListDividedByComma(prev.specs.upper)}
              newValue={prepareListDividedByComma(shoe.specs.upper)}
              compareResult={upperResult}
            />

            <ComparisonRow
              label="Foam"
              oldValue={prepareListDividedByComma(prev.specs.foam)}
              newValue={prepareListDividedByComma(shoe.specs.foam)}
              compareResult={foamResult}
            />

            <ComparisonRow
              label="Plate"
              oldValue={prev.specs.plate ?? "-"}
              newValue={shoe.specs.plate ?? "-"}
              compareResult={plateResult}
            />

            <ComparisonRow
              label="Outsole"
              oldValue={prepareListDividedByComma(prev.specs.outsole)}
              newValue={prepareListDividedByComma(shoe.specs.outsole)}
              compareResult={outsoleResult}
            />

            {/* Pricing & Availability Section */}
            <SectionHeader title="Pricing & Release" />

            <ComparisonRow
              label="US Price"
              oldValue={preparePriceInUSD(prev.releaseInfo)}
              newValue={preparePriceInUSD(shoe.releaseInfo)}
              compareResult={compareLowerIsBetter(
                prev.releaseInfo?.us?.price,
                shoe.releaseInfo?.us?.price
              )}
              difference={getDifferenceIndicator(
                prev.releaseInfo?.us?.price,
                shoe.releaseInfo?.us?.price,
                "$",
                true
              )}
            />

            <ComparisonRow
              label="EU Price"
              oldValue={preparePriceInEUR(prev.releaseInfo)}
              newValue={preparePriceInEUR(shoe.releaseInfo)}
              compareResult={compareLowerIsBetter(
                prev.releaseInfo?.eu?.price,
                shoe.releaseInfo?.eu?.price
              )}
              difference={getDifferenceIndicator(
                prev.releaseInfo?.eu?.price,
                shoe.releaseInfo?.eu?.price,
                "€",
                true
              )}
            />

            <ComparisonRow
              label="PL Price"
              oldValue={preparePriceInPLN(prev.releaseInfo)}
              newValue={preparePriceInPLN(shoe.releaseInfo)}
              compareResult={compareLowerIsBetter(
                prev.releaseInfo?.pl?.price,
                shoe.releaseInfo?.pl?.price
              )}
              difference={getDifferenceIndicator(
                prev.releaseInfo?.pl?.price,
                shoe.releaseInfo?.pl?.price,
                "zł",
                true
              )}
            />

            <ComparisonRow
              label="US Release Date"
              oldValue={prepareReleaseDate(prev.releaseInfo?.us?.date)}
              newValue={prepareReleaseDate(shoe.releaseInfo?.us?.date)}
              compareResult="neutral"
            />

            <ComparisonRow
              label="EU Release Date"
              oldValue={prepareReleaseDate(prev.releaseInfo?.eu?.date)}
              newValue={prepareReleaseDate(shoe.releaseInfo?.eu?.date)}
              compareResult="neutral"
            />

            {/* Summary Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">
                Key Changes Summary
              </h4>
              <div className="space-y-2 text-sm">
                {mWeightResult === "better" && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✓</span>
                    <span>
                      Lighter men&apos;s weight (
                      {getDifferenceIndicator(
                        prev.specs.m?.weight,
                        shoe.specs.m?.weight,
                        "g",
                        true
                      ).trim()}
                      )
                    </span>
                  </div>
                )}
                {mWeightResult === "worse" && (
                  <div className="flex items-center gap-2 text-red-600">
                    <span>✗</span>
                    <span>
                      Heavier men&apos;s weight (
                      {getDifferenceIndicator(
                        prev.specs.m?.weight,
                        shoe.specs.m?.weight,
                        "g",
                        true
                      ).trim()}
                      )
                    </span>
                  </div>
                )}
                {wWeightResult === "better" && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✓</span>
                    <span>
                      Lighter women&apos;s weight (
                      {getDifferenceIndicator(
                        prev.specs.w?.weight,
                        shoe.specs.w?.weight,
                        "g",
                        true
                      ).trim()}
                      )
                    </span>
                  </div>
                )}
                {wWeightResult === "worse" && (
                  <div className="flex items-center gap-2 text-red-600">
                    <span>✗</span>
                    <span>
                      Heavier women&apos;s weight (
                      {getDifferenceIndicator(
                        prev.specs.w?.weight,
                        shoe.specs.w?.weight,
                        "g",
                        true
                      ).trim()}
                      )
                    </span>
                  </div>
                )}
                {foamResult === "neutral" && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <span>↔</span>
                    <span>
                      Updated foam: {prev.specs.foam} → {shoe.specs.foam}
                    </span>
                  </div>
                )}
                {upperResult === "neutral" && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <span>↔</span>
                    <span>Updated upper material</span>
                  </div>
                )}
                {outsoleResult === "neutral" && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <span>↔</span>
                    <span>Updated outsole</span>
                  </div>
                )}
                {plateResult === "neutral" && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <span>↔</span>
                    <span>
                      Updated plate: {prev.specs.plate ?? "None"} →{" "}
                      {shoe.specs.plate ?? "None"}
                    </span>
                  </div>
                )}
                {priceResult === "better" && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✓</span>
                    <span>Lower price point</span>
                  </div>
                )}
                {priceResult === "worse" && (
                  <div className="flex items-center gap-2 text-red-600">
                    <span>✗</span>
                    <span>Higher price point</span>
                  </div>
                )}
                {shoe.wideAvailable && !prev.wideAvailable && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✓</span>
                    <span>Wide option now available</span>
                  </div>
                )}
                {shoe.waterproofAvailable && !prev.waterproofAvailable && (
                  <div className="flex items-center gap-2 text-green-600">
                    <span>✓</span>
                    <span>Waterproof option now available</span>
                  </div>
                )}
                {mWeightResult === "same" &&
                  wWeightResult === "same" &&
                  foamResult === "same" &&
                  upperResult === "same" &&
                  outsoleResult === "same" &&
                  plateResult === "same" &&
                  priceResult === "same" && (
                    <div className="text-gray-500">
                      No significant changes detected between versions.
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareModal;
