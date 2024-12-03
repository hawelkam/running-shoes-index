"use client";

import ViewSwitcher from "@/_components/ViewSwitcher";
import BrandCard from "./BrandCard";
import { useState } from "react";
import { SanityBrand } from "../page";
import ListView from "@/_components/ListView";

interface BrandsTableProps {
  brands: SanityBrand[];
}

export default function BrandsTable({ brands }: BrandsTableProps) {
  const [gridView, setGridView] = useState(true);
  return (
    <>
      <ViewSwitcher
        toggleGrid={() => setGridView(true)}
        toggleList={() => setGridView(false)}
      />
      {gridView ? (
        brands.map((brand) => <BrandCard key={brand._id} brand={brand} />)
      ) : (
        <ListView />
      )}
    </>
  );
}
