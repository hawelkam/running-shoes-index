import ShoePurposePageLayout, {
  ShoePurposePageProps,
} from "../../_components/ShoePurposePageLayout";

interface GravelShoesPageProps {
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

export default async function GravelShoesPage(props: GravelShoesPageProps) {
  const shoePurposeProps: ShoePurposePageProps = {
    searchParams: props.searchParams,
    config: {
      purpose: "Gravel",
      title: "Gravel Running Shoes",
      description: "Tackle mixed terrain with versatile gravel running shoes",
      basePath: "/shoes/gravel",
    },
  };

  return <ShoePurposePageLayout {...shoePurposeProps} />;
}
