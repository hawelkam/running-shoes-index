"use client";

import { SanityRunningShoe } from "@/_types/RunningShoe";
import Image from "next/image";
import Link from "next/link";

interface ShoeComparisonDisplayProps {
  shoe1: SanityRunningShoe;
  shoe2: SanityRunningShoe;
}

export default function ShoeComparisonDisplay({
  shoe1,
  shoe2,
}: ShoeComparisonDisplayProps) {
  const getSpecValue = (shoe: SanityRunningShoe, specKey: string): string => {
    if (!shoe.specs) return "N/A";

    switch (specKey) {
      case "price":
        const prices = shoe.releaseInfo;
        if (prices?.us?.price) return `$${prices.us.price}`;
        if (prices?.eu?.price) return `€${prices.eu.price}`;
        if (prices?.pl?.price) return `${prices.pl.price} PLN`;
        return "N/A";
      case "weight":
        const weight = shoe.specs.m?.weight || shoe.specs.w?.weight;
        return weight ? `${weight}g` : "N/A";
      case "drop":
        const drop = shoe.specs.m?.drop || shoe.specs.w?.drop;
        return drop !== undefined ? `${drop}mm` : "N/A";
      case "stackHeight":
        const heelStack = shoe.specs.m?.heelStack || shoe.specs.w?.heelStack;
        const dropValue = shoe.specs.m?.drop || shoe.specs.w?.drop;
        if (heelStack && dropValue !== undefined) {
          const forefoot = heelStack - dropValue;
          return `${heelStack}mm / ${forefoot}mm`;
        }
        return "N/A";
      default:
        return "N/A";
    }
  };

  const getComparisonClass = (
    shoe1Value: string,
    shoe2Value: string,
    current: string,
    type: "higher" | "lower" | "neutral" = "neutral"
  ): string => {
    if (shoe1Value === "N/A" || shoe2Value === "N/A") return "";

    const val1 = parseFloat(shoe1Value.replace(/[^0-9.]/g, ""));
    const val2 = parseFloat(shoe2Value.replace(/[^0-9.]/g, ""));
    const currentVal = parseFloat(current.replace(/[^0-9.]/g, ""));

    if (type === "higher") {
      return currentVal > (currentVal === val1 ? val2 : val1)
        ? "bg-green-50 border-green-200"
        : "";
    } else if (type === "lower") {
      return currentVal < (currentVal === val1 ? val2 : val1)
        ? "bg-green-50 border-green-200"
        : "";
    }
    return "";
  };

  const specifications = [
    { key: "price", label: "Price", comparison: "lower" as const },
    { key: "weight", label: "Weight", comparison: "lower" as const },
    { key: "drop", label: "Drop", comparison: "neutral" as const },
    {
      key: "stackHeight",
      label: "Stack Height (Heel/Forefoot)",
      comparison: "neutral" as const,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-8">Shoe Comparison</h2>

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
          <p className="text-gray-600">{shoe1.shoeType?.name}</p>
          {shoe1.category && shoe1.category.length > 0 && (
            <p className="text-sm text-gray-500">{shoe1.category[0]?.name}</p>
          )}
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
          <p className="text-gray-600">{shoe2.shoeType?.name}</p>
          {shoe2.category && shoe2.category.length > 0 && (
            <p className="text-sm text-gray-500">{shoe2.category[0]?.name}</p>
          )}
        </div>
      </div>

      {/* Specifications Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left p-4 font-semibold text-gray-700">
                Specification
              </th>
              <th className="text-center p-4 font-semibold text-gray-700">
                {shoe1.name}
              </th>
              <th className="text-center p-4 font-semibold text-gray-700">
                {shoe2.name}
              </th>
            </tr>
          </thead>
          <tbody>
            {specifications.map((spec) => {
              const value1 = getSpecValue(shoe1, spec.key);
              const value2 = getSpecValue(shoe2, spec.key);

              return (
                <tr key={spec.key} className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700">
                    {spec.label}
                  </td>
                  <td
                    className={`p-4 text-center border rounded ${getComparisonClass(value1, value2, value1, spec.comparison)}`}
                  >
                    {value1}
                  </td>
                  <td
                    className={`p-4 text-center border rounded ${getComparisonClass(value1, value2, value2, spec.comparison)}`}
                  >
                    {value2}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Review Status */}
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Review Status</h4>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              shoe1.review
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {shoe1.review ? "Has Review Data" : "No Review Data"}
          </span>
          {shoe1.review && (
            <p className="text-xs text-gray-500 mt-1">
              Size: US {shoe1.review.shoeInfo.sizeUS}
            </p>
          )}
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Review Status</h4>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              shoe2.review
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {shoe2.review ? "Has Review Data" : "No Review Data"}
          </span>
          {shoe2.review && (
            <p className="text-xs text-gray-500 mt-1">
              Size: US {shoe2.review.shoeInfo.sizeUS}
            </p>
          )}
        </div>
      </div>

      {/* Release Information */}
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Release Date</h4>
          <p className="text-gray-600">
            {shoe1.releaseInfo?.us?.date
              ? new Date(shoe1.releaseInfo.us.date).toLocaleDateString()
              : shoe1.releaseInfo?.eu?.date
                ? new Date(shoe1.releaseInfo.eu.date).toLocaleDateString()
                : shoe1.releaseInfo?.pl?.date
                  ? new Date(shoe1.releaseInfo.pl.date).toLocaleDateString()
                  : "N/A"}
          </p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Release Date</h4>
          <p className="text-gray-600">
            {shoe2.releaseInfo?.us?.date
              ? new Date(shoe2.releaseInfo.us.date).toLocaleDateString()
              : shoe2.releaseInfo?.eu?.date
                ? new Date(shoe2.releaseInfo.eu.date).toLocaleDateString()
                : shoe2.releaseInfo?.pl?.date
                  ? new Date(shoe2.releaseInfo.pl.date).toLocaleDateString()
                  : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
