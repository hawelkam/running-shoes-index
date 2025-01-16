import { SanityRunningShoe } from "@/_types/RunningShoe";
import { client } from "@/sanity/client";
import Title from "antd/es/typography/Title";
import ShoesGrid from "./shoes/_components/ShoesGrid";

async function getData() {
  const query = `*[_type == "runningShoe" && defined(slug.current)]|order(_createdAt desc)[0...9]{_id, name, slug, shoeType->, category[]->, image}`;

  const data = await client.fetch<SanityRunningShoe[]>(
    query,
    {},
    { next: { revalidate: 30 } }
  );
  return data;
}

export default async function IndexPage() {
  const shoes = await getData();
  return (
    <main>
      <Title level={1}>Running Shoes Index</Title>
      <Title level={3}>You directory of all running shoes.</Title>
      <Title level={4}>Latest shoes in the catalog:</Title>
      <ShoesGrid shoes={shoes} />
    </main>
  );
}
