"use client";

import ViewSwitcher from "@/_components/ViewSwitcher";
import BrandCard from "./BrandCard";
import { useState } from "react";
import { SanityBrand } from "../page";
import ListView from "@/_components/ListView";
import GridView from "@/_components/GridView";
import BrandListHeader from "./BrandListHeader";
import BrandListItem from "./BrandListItem";

interface BrandsTableProps {
  brands: SanityBrand[];
}

export default function BrandsTable({ brands }: BrandsTableProps) {
  const [gridView, setGridView] = useState(true);
  return (
    <div className="flex flex-col gap-2">
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
        <ListView
          listViewHeader={<BrandListHeader />}
          listViewItems={brands.map((brand) => (
            <BrandListItem brand={brand} key={brand._id} />
          ))}
        />
      )}
    </div>
  );
}
