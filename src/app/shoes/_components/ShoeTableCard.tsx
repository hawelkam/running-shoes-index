import React from "react";
import { Image } from "antd";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import { prepareListDividedByComma } from "@/_utils/helpers";

interface ShoeTableCardProps {
  shoe: SanityRunningShoe;
}

const ShoeTableCard = ({ shoe }: ShoeTableCardProps) => {
  const prepareProperReviewedStatus = (shoe: SanityRunningShoe) => {
    if (shoe.review) {
      if (shoe.review.plReview || shoe.review.enReview) {
        return (
          <span className="ml-2 text-green-500 flex items-center">
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
            Reviewed
          </span>
        );
      }
      return (
        <span className="ml-2 text-orange-500 flex items-center">
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
          In Review
        </span>
      );
    } else {
      return (
        <span className="ml-2 text-gray-400 flex items-center">
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
          Not Reviewed
        </span>
      );
    }
  };
  return (
    <div className="shoe-card bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex items-center space-x-4">
        <div className="w-32 h-16 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
          <Image
            src={shoe.image.url}
            alt={shoe.name}
            style={{ objectFit: "contain" }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{shoe.name}</h3>
          <div className="flex items-center mt-1">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {prepareListDividedByComma(shoe.category)}
            </span>
            {prepareProperReviewedStatus(shoe)}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-medium">999 PLN</p>
            <p className="text-xs text-gray-500">$249 / €229</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Weight</p>
            <p className="font-medium">196g</p>
            <p className="text-xs text-gray-500">6.9oz</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Drop</p>
            <p className="font-medium">8mm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoeTableCard;
