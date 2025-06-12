"use client";

import { SanityRunningShoe } from "@/_types/RunningShoe";
import { Card, List } from "antd";
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
            <Card
              hoverable
              cover={
                <div className="h-64 overflow-hidden">
                  <img
                    alt={shoe.name}
                    src={shoe.image?.url}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
              }
              actions={[
                <Link
                  href={`/shoes/${shoe.slug.current}`}
                  key={`${shoe.slug.current}-details`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </Link>,
              ]}
              className="h-full"
            >
              <Card.Meta
                title={
                  <Link
                    href={`/shoes/${shoe.slug.current}`}
                    className="text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {shoe.name}
                  </Link>
                }
                description={
                  <div className="space-y-2">
                    {shoe.shoeType?.name && (
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {shoe.shoeType.name}
                      </span>
                    )}
                    {shoe.category && shoe.category.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {shoe.category
                          .slice(0, 2)
                          .map((cat: { name: string }, idx: number) => (
                            <span
                              key={idx}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {cat.name}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </section>
  );
}
