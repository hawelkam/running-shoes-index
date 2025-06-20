import ShoeTypePageLayout, {
  ShoeTypePageProps,
} from "../../_components/ShoeTypePageLayout";

interface TrackShoesPageProps {
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

export default async function TrackShoesPage(props: TrackShoesPageProps) {
  const shoeTypeProps: ShoeTypePageProps = {
    searchParams: props.searchParams,
    config: {
      shoeType: "Track",
      title: "Track Running Shoes",
      description: "Achieve your best times with precision track running shoes",
      basePath: "/shoes/track",
    },
  };

  return <ShoeTypePageLayout {...shoeTypeProps} />;
}
