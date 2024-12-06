import React from "react";

const BrandListHeader = () => {
  return (
    <tr>
      <th scope="col" className="px-6 py-3">
        <div className="flex items-center">Brand name</div>
      </th>
      <th scope="col" className="px-6 py-3">
        Logo
      </th>
      <th scope="col" className="px-6 py-3">
        <span className="sr-only">Learn more</span>
      </th>
    </tr>
  );
};

export default BrandListHeader;
