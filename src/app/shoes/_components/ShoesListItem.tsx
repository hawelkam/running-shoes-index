import React from "react";
import Link from "next/link";
import { SanityRunningShoe } from "../page";

interface ShoesListItemProps {
  shoe: SanityRunningShoe;
}

const ShoesListItem = ({ shoe }: ShoesListItemProps) => {
  return (
    <tr className="bg-white border-b">
      <th className="px-6 py-4" scope="row">
        {shoe.image && (
          <img
            className="rounded-lg max-w-52"
            src={`${shoe.image.url}`}
            alt=""
          />
        )}
      </th>
      <td className="px-6 py-4 font-bold text-xl text-gray-900 whitespace-nowrap">
        {shoe.name}
      </td>

      <td className="px-6 py-4 text-right">
        <Link
          href={`/shoes/${shoe.slug.current}`}
          className="font-medium text-blue-600 hover:underline"
        >
          Learn more
        </Link>
      </td>
    </tr>
  );
};

export default ShoesListItem;
