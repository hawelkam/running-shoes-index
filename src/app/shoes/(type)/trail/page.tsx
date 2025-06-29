import ShoePurposePageLayout, {
  ShoePurposePageProps,
} from "../../_components/ShoePurposePageLayout";

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
  const shoePurposeProps: ShoePurposePageProps = {
    searchParams: props.searchParams,
    config: {
      purpose: "Trail",
      title: "Trail Running Shoes",
      description: "Conquer any terrain with trail running shoes",
      basePath: "/shoes/trail",
    },
  };

  return <ShoePurposePageLayout {...shoePurposeProps} />;
}
