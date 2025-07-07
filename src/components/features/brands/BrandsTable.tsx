"use client";

import { List } from "antd";

import { SanityBrand } from "@/types/Brand";

import BrandCard from "./BrandCard";

interface BrandsTableProps {
  brands: SanityBrand[];
}

export default function BrandsTable({ brands }: BrandsTableProps) {
  return (
    <List
      grid={{
        gutter: 24,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 4,
        xxl: 5,
      }}
      dataSource={brands}
      renderItem={(item) => (
        <List.Item>
          <BrandCard key={item._id} brand={item} />
        </List.Item>
      )}
    />
  );
}
