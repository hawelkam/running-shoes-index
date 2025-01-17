import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
import React from "react";
import CompareModal from "../_components/CompareModal";
import { SanityRunningShoe } from "@/_types/RunningShoe";
import { Descriptions, Flex, Image } from "antd";
import {
  mapToRunningShoeDescription,
  mapToRunningShoePrevious,
  mapToRunningShoeReview,
  mapToRunningShoeSpecs,
} from "@/_utils/runningShoeMapper";

type Params = Promise<{ slug: string }>;

async function getShoe(slug: string): Promise<SanityRunningShoe | null> {
  try {
    const shoe = await client.fetch<SanityRunningShoe>(
      `*[_type == "runningShoe" && slug.current == "${slug}"][0]{_id, name, brand->, shoeType->, releaseInfo, category[]->, stability, specs { m, w, upper[]->, foam[]->, plate, outsole[]->}, notes, previousVersion-> { name, releaseInfo, category[]->, slug, image, specs { m, w, upper[]->, foam[]->, plate, outsole[]->}, stability, notes}, image, review}`,
      {},
      { next: { revalidate: 60 } }
    );
    if (!shoe) return null;

    return shoe;
  } catch (error) {
    console.error("Failed to fetch shoe:", error);
    return null;
  }
}

const ShoePage = async (props: { params: Params }) => {
  const params = await props.params;
  const slug = params.slug;
  const shoe = await getShoe(slug);

  if (!shoe) {
    notFound(); // Trigger 404 page if the shoe is not found
  }
  return (
    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 items-start justify-center py-12 2xl:px-40 md:px-6 px-4">
      {shoe.image && <Image src={shoe.image.url} />}
      <Flex vertical gap={16}>
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm leading-none text-gray-600">
            {shoe.shoeType.name} | {shoe.brand.name}
          </p>
          <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mt-2">
            {shoe.name}
          </h1>
        </div>

        <Descriptions
          title="General info"
          bordered
          items={mapToRunningShoeDescription(shoe)}
          column={1}
        />
      </Flex>
      <Descriptions
        title="Specification"
        bordered
        items={mapToRunningShoeSpecs(shoe)}
        column={1}
      />
      <div className="flex flex-col gap-8">
        {shoe.review && (
          <Descriptions
            title="My review"
            bordered
            items={mapToRunningShoeReview(shoe)}
            column={1}
          />
        )}
        {shoe.previousVersion && (
          <>
            <Descriptions
              title="Previous version"
              bordered
              items={mapToRunningShoePrevious(shoe.previousVersion)}
              column={1}
            />
            <CompareModal shoe={shoe} />
          </>
        )}
      </div>
    </div>
  );
};

export async function generateStaticParams() {
  try {
    const shoes = await client.fetch<SanityRunningShoe[]>(
      `*[_type == "runningShoe"]{ slug }`,
      {}
    );

    return shoes.map((shoe) => ({ slug: shoe.slug.current }));
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    return [];
  }
}

export default ShoePage;
