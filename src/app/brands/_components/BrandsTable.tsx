"use client";

import BrandCard from "./BrandCard";
import { SanityBrand } from "../page";
import { List } from "antd";

interface BrandsTableProps {
  brands: SanityBrand[];
}

export default function BrandsTable({ brands }: BrandsTableProps) {
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 4,
        xxl: 3,
      }}
      dataSource={brands}
      renderItem={(item) => (
        <List.Item>
          <BrandCard key={item._id} brand={item} />
        </List.Item>
      )}
      style={{ padding: "1rem" }}
    />
  );
}
