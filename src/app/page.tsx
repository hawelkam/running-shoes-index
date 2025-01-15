import { Button, Flex } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";

export default async function IndexPage() {
  return (
    <main>
      <Title level={1}>Running Shoes Index</Title>
      <Title level={3}>You directory of all running shoes.</Title>
      <Title level={4}>Browse by:</Title>
      <Flex gap={4}>
        <Link href={`/brands`}>
          <Button color="primary" variant="solid">
            Brand
          </Button>
        </Link>
        <Link href={`/shoes`}>
          <Button color="primary" variant="solid">
            Shoes
          </Button>
        </Link>
      </Flex>
    </main>
  );
}
