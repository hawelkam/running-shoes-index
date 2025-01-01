import React from "react";

const ShoesListHeader = () => {
  return (
    <tr>
      <th scope="col" className="px-6 py-3">
        Image
      </th>
      <th scope="col" className="px-6 py-3">
        <div className="flex items-center">Shoe name</div>
      </th>
      <th scope="col" className="px-6 py-3">
        <span className="sr-only">Learn more</span>
      </th>
    </tr>
  );
};

export default ShoesListHeader;
