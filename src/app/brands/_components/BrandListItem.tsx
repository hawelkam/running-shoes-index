import React from "react";
import { SanityBrand } from "../page";
import Link from "next/link";

interface BrandListItemProps {
  brand: SanityBrand;
}

const BrandListItem = ({ brand }: BrandListItemProps) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {brand.name}
      </th>
      <td className="px-6 py-4">
        {brand.image && (
          <img
            className="rounded-t-lg max-w-xs"
            src={`${brand.image.url}`}
            alt=""
          />
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <Link
          href={`/brands/${brand.slug.current}`}
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Learn more
        </Link>
      </td>
    </tr>
  );
};

export default BrandListItem;
