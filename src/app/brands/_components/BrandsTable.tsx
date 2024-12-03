"use client";

import ViewSwitcher from "@/_components/ViewSwitcher";
import BrandCard from "./BrandCard";
import { useState } from "react";
import { SanityBrand } from "../page";
import ListView from "@/_components/ListView";
import GridView from "@/_components/GridView";

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
        <GridView
          items={brands.map((brand) => (
            <BrandCard key={brand._id} brand={brand} />
          ))}
        />
      ) : (
        <ListView />
      )}
    </>
  );
}
