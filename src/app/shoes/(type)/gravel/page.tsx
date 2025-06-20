import ShoeTypePageLayout, {
  ShoeTypePageProps,
} from "../../_components/ShoeTypePageLayout";

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
  const shoeTypeProps: ShoeTypePageProps = {
    searchParams: props.searchParams,
    config: {
      shoeType: "Gravel",
      title: "Gravel Running Shoes",
      description: "Tackle mixed terrain with versatile gravel running shoes",
      basePath: "/shoes/gravel",
    },
  };

  return <ShoeTypePageLayout {...shoeTypeProps} />;
}
