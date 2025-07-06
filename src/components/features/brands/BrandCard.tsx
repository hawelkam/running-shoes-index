"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "antd";
import { useState } from "react";
import { SanityBrand } from "@/types/Brand";

interface IProps {
  brand: SanityBrand;
}

export default function BrandCard({ brand }: IProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      hoverable
      cover={
        <div className="h-48 overflow-hidden bg-white flex items-center justify-center relative">
          {brand.image?.url && !imageError ? (
            <Image
              alt={brand.name}
              src={brand.image.url}
              fill
              className="object-contain hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 mb-2">
                  {brand.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-xs text-gray-500">{brand.name}</div>
              </div>
            </div>
          )}
        </div>
      }
      actions={[
        <Link
          href={`/brands/${brand.slug.current}`}
          key={`${brand.slug.current}-details`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </Link>,
      ]}
      className="h-full shadow-sm hover:shadow-md transition-shadow bg-white"
    >
      <Card.Meta
        title={
          <Link
            href={`/brands/${brand.slug.current}`}
            className="text-gray-800 hover:text-blue-600 transition-colors text-center block font-semibold"
          >
            {brand.name}
          </Link>
        }
      />
    </Card>
  );
}
