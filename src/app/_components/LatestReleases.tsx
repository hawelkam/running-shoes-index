"use client";

import { SanityRunningShoe } from "@/_types/RunningShoe";
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {shoes.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500">
            No latest releases available at the moment.
          </div>
        ) : (
          shoes.slice(0, 3).map((shoe) => (
            <div
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white"
              key={shoe._id}
            >
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
                {shoe.purpose && (
                  <div className="text-xs uppercase text-gray-500 mb-1">
                    {shoe.purpose}
                  </div>
                )}
                {shoe.categories && shoe.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-sm text-white mb-4">
                    {shoe.categories.slice(0, 2).map((cat, idx: number) => (
                      <span key={idx} className="bg-black px-2 py-1 rounded">
                        {cat}
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
          ))
        )}
      </div>
    </section>
  );
}
