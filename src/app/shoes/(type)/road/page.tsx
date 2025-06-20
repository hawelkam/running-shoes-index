import ShoeTypePageLayout, {
  ShoeTypePageProps,
} from "../../_components/ShoeTypePageLayout";

interface RoadShoesPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    priceMin?: string;
    priceMax?: string;
    weightMin?: string;
    weightMax?: string;
    dropMin?: string;
    dropMax?: string;
    reviewed?: string;
    search?: string;
  }>;
}

export default async function RoadShoesPage(props: RoadShoesPageProps) {
  const shoeTypeProps: ShoeTypePageProps = {
    searchParams: props.searchParams,
    config: {
      shoeType: "Road",
      title: "Road Running Shoes",
      description: "Find your perfect road running companion",
      basePath: "/shoes/road",
    },
  };

  return <ShoeTypePageLayout {...shoeTypeProps} />;
}
