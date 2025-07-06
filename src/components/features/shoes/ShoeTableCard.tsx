import React from "react";
import { Image } from "antd";
import { SanityRunningShoe } from "@/types/RunningShoe";
import { prepareWeightInGrams, prepareWeightInOunces } from "@/utils/helpers";
import Link from "next/link";

interface ShoeTableCardProps {
  shoe: SanityRunningShoe;
}

const ShoeTableCard = ({ shoe }: ShoeTableCardProps) => {
  return (
    <Link href={`/shoes/${shoe.slug.current}`} className="block no-underline">
      <div className="shoe-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
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
                {shoe.categories?.join(", ") || "No Category"}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium">{shoe.releaseInfo.pl?.price}zł</p>
              <p className="text-xs text-gray-500">
                ${shoe.releaseInfo.us?.price} / €{shoe.releaseInfo.eu?.price}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Weight</p>
              <p className="font-medium">
                {prepareWeightInGrams(shoe.specs.m?.weight)}
              </p>
              <p className="text-xs text-gray-500">
                {prepareWeightInOunces(shoe.specs.m?.weight)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Drop</p>
              <p className="font-medium">{shoe.specs.m?.drop}mm</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShoeTableCard;
