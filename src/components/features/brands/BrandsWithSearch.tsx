"use client";

import { Input, Empty } from "antd";
import { useState, useMemo } from "react";
import { List } from "antd";

import { SanityBrand } from "@/types/Brand";

import BrandCard from "./BrandCard";

interface BrandsWithSearchProps {
  brands: SanityBrand[];
}

export default function BrandsWithSearch({ brands }: BrandsWithSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBrands = useMemo(() => {
    if (!searchTerm.trim()) return brands;

    return brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brands, searchTerm]);

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredBrands.length}</span>{" "}
          of <span className="font-medium">{brands.length}</span> brands
        </div>
        <Input.Search
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 300 }}
          allowClear
          size="large"
        />
      </div>

      {filteredBrands.length === 0 ? (
        <Empty
          description={
            searchTerm
              ? `No brands found for "${searchTerm}"`
              : "No brands available"
          }
          className="my-12"
        />
      ) : (
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
          dataSource={filteredBrands}
          renderItem={(item) => (
            <List.Item>
              <BrandCard brand={item} />
            </List.Item>
          )}
        />
      )}
    </>
  );
}
