import Link from "next/link";
import { SanityBrand } from "../page";
import Card from "antd/es/card/Card";
import Title from "antd/es/typography/Title";

interface IProps {
  brand: SanityBrand;
}

export default function BrandCard({ brand }: IProps) {
  return (
    <Card
      cover={<img alt="example" src={brand.image.url} />}
      actions={[
        <Link
          href={`/brands/${brand.slug.current}`}
          key={`${brand.slug.current}-details`}
        >
          Details
        </Link>,
      ]}
    >
      <Link href={`/brands/${brand.slug.current}`}>
        <Title level={2} style={{ textAlign: "center" }}>
          {brand.name}
        </Title>
      </Link>
    </Card>
  );
}
