import React from "react";
import { Image } from "antd";
import Link from "next/link";

import { SanityRunningShoe } from "@/types/RunningShoe";
import { prepareWeightInGrams, prepareWeightInOunces } from "@/utils/helpers";

interface ShoeTableElementProps {
  shoe: SanityRunningShoe;
}

const ShoeTableElement = ({ shoe }: ShoeTableElementProps) => {
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
    </tr>
  );
};

export default ShoeTableElement;
