"use client";

import { SanityRunningShoe } from "@/_types/RunningShoe";
import { List } from "antd";
import Link from "next/link";

interface LatestReleasesProps {
  shoes: SanityRunningShoe[];
}

export default function LatestReleases({ shoes }: LatestReleasesProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Latest Releases</h2>
        <Link
          href="/shoes"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View All Shoes →
        </Link>
      </div>

      <List
        grid={{
          gutter: 24,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 3,
        }}
        dataSource={shoes}
        renderItem={(shoe) => (
          <List.Item>
            <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
              <div className="h-64 overflow-hidden">
                <img
                  alt={shoe.name}
                  src={shoe.image?.url}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <Link
                  href={`/shoes/${shoe.slug.current}`}
                  className="text-black"
                >
                  <h3 className="text-xl font-semibold mb-2">{shoe.name}</h3>
                </Link>
                {shoe.shoeType?.name && (
                  <div className="text-xs uppercase text-gray-500 mb-1">
                    {shoe.shoeType.name}
                  </div>
                )}
                {shoe.category && shoe.category.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-sm text-white mb-4">
                    {shoe.category
                      .slice(0, 2)
                      .map((cat: { name: string }, idx: number) => (
                        <span key={idx} className="bg-black px-2 py-1 rounded">
                          {cat.name}
                        </span>
                      ))}
                  </div>
                )}
                <Link
                  href={`/shoes/${shoe.slug.current}`}
                  key={`${shoe.slug.current}-details`}
                  className="inline-block mt-2 px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black border border-black transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          </List.Item>
        )}
      />
    </section>
  );
}
