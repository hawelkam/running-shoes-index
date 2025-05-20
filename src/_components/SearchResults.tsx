"use client";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import { mapToRunningShoe } from "@/_utils/runningShoeMapper";
import ShoesTable from "@/app/shoes/_components/ShoesTable";
import { client } from "@/sanity/client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [shoes, setShoes] = useState<SanityRunningShoe[]>([]);

  useEffect(() => {
    async function getShoes(query: string) {
      try {
        const data = await client.fetch<SanityRunningShoe[]>(
          `*[
  _type == "runningShoe" && defined(slug.current) && name match "*${query}*"]|order(lower(name) asc)[0...400]{_id, name, slug, shoeType->, category[]->, releaseInfo, image, review}`,
          {},
          { next: { revalidate: 60 } }
        );
        setShoes(data || []);
      } catch (error) {
        console.error("Failed to fetch shoe:", error);
      }
    }
    getShoes(query || "");
  }, [query]);
  return <ShoesTable shoes={shoes.map((shoe) => mapToRunningShoe(shoe))} />;
};

export default SearchResults;
