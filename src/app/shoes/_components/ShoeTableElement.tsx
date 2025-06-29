import React from "react";
import { Image } from "antd";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import { prepareWeightInGrams, prepareWeightInOunces } from "@/_utils/helpers";
import Link from "next/link";

interface ShoeTableElementProps {
  shoe: SanityRunningShoe;
}

const ShoeTableElement = ({ shoe }: ShoeTableElementProps) => {
  const prepareProperReviewedStatus = (shoe: SanityRunningShoe) => {
    if (shoe.review) {
      if (shoe.review.plReview || shoe.review.enReview) {
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        );
      }
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      );
    }
  };
  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="p-4">
        <div className="w-32 h-16 bg-blue-100 rounded-md flex items-center justify-center">
          <Image
            src={shoe.image.url}
            alt={shoe.name}
            style={{ objectFit: "contain" }}
          />
        </div>
      </td>

      <td className="p-4 font-medium">
        <Link href={`/shoes/${shoe.slug.current}`} className="no-underline">
          {shoe.name}
        </Link>
      </td>
      <td className="p-4">{shoe.categories?.join(", ")}</td>
      <td className="p-4">
        <div className="flex flex-col">
          <span>{shoe.releaseInfo.pl?.price}zł</span>
          <span className="text-sm text-gray-500">
            ${shoe.releaseInfo.us?.price} / €{shoe.releaseInfo.eu?.price}
          </span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex flex-col">
          <span>{prepareWeightInGrams(shoe.specs.m?.weight)}</span>
          <span className="text-sm text-gray-500">
            {prepareWeightInOunces(shoe.specs.m?.weight)}
          </span>
        </div>
      </td>
      <td className="p-4">{shoe.specs.m?.drop}mm</td>
      <td className="p-4">{prepareProperReviewedStatus(shoe)}</td>
    </tr>
  );
};

export default ShoeTableElement;
