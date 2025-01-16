"use client";

import { SanityRunningShoe } from "@/_types/RunningShoe";
import { Card, List } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";

interface ShoesGridProps {
  shoes: SanityRunningShoe[];
}

const ShoesGrid = ({ shoes }: ShoesGridProps) => {
  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 3,
        lg: 3,
        xl: 3,
        xxl: 3,
      }}
      dataSource={shoes}
      renderItem={(shoe) => (
        <List.Item>
          <Card
            cover={<img alt="" src={shoe.image.url} />}
            actions={[
              <Link
                href={`/shoes/${shoe.slug.current}`}
                key={`${shoe.slug.current}-details`}
              >
                Details
              </Link>,
            ]}
          >
            <Link href={`/shoes/${shoe.slug.current}`}>
              <Title level={2} style={{ textAlign: "center" }}>
                {shoe.name}
              </Title>
            </Link>
          </Card>
        </List.Item>
      )}
      style={{ padding: "1rem" }}
    />
  );
};

export default ShoesGrid;
