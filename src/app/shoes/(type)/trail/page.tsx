import ShoeTypePageLayout, {
  ShoeTypePageProps,
} from "../../_components/ShoeTypePageLayout";

interface TrailShoesPageProps {
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

export default async function TrailShoesPage(props: TrailShoesPageProps) {
  const shoeTypeProps: ShoeTypePageProps = {
    searchParams: props.searchParams,
    config: {
      shoeType: "Trail",
      title: "Trail Running Shoes",
      description: "Conquer any terrain with trail running shoes",
      basePath: "/shoes/trail",
    },
  };

  return <ShoeTypePageLayout {...shoeTypeProps} />;
}
