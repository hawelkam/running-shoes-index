import Link from "next/link";
import Card from "antd/es/card/Card";
import Title from "antd/es/typography/Title";
import { RunningShoe } from "@/_types/RunningShoe";

interface IProps {
  shoe: RunningShoe;
}

export default function ShoeCard({ shoe }: IProps) {
  return (
    <Card
      cover={<img alt="example" src={shoe.image} />}
      actions={[
        <Link href={`/shoes/${shoe.slug}`} key={`${shoe.slug}-details`}>
          Details
        </Link>,
      ]}
    >
      <Link href={`/shoes/${shoe.slug}`}>
        <Title level={2} style={{ textAlign: "center" }}>
          {shoe.name}
        </Title>
      </Link>
    </Card>
  );
}
