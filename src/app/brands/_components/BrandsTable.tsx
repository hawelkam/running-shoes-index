import BrandCard from "./BrandCard";
import { SanityBrand } from "../page";
import GridView from "@/_components/GridView";

interface BrandsTableProps {
  brands: SanityBrand[];
}

export default function BrandsTable({ brands }: BrandsTableProps) {
  return (
    <div className="flex flex-col gap-2">
      <GridView
        items={brands.map((brand) => (
          <BrandCard key={brand._id} brand={brand} />
        ))}
      />
    </div>
  );
}
