import ShoePurposePageLayout, {
  ShoePurposePageProps,
} from "../../_components/ShoePurposePageLayout";

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
  const shoePurposeProps: ShoePurposePageProps = {
    searchParams: props.searchParams,
    config: {
      purpose: "Road",
      title: "Road Running Shoes",
      description: "Find your perfect road running companion",
      basePath: "/shoes/road",
    },
  };

  return <ShoePurposePageLayout {...shoePurposeProps} />;
}
