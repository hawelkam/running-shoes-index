import ShoeTypePageLayout, {
  ShoePurposePageProps,
} from "@/components/features/shoes/ShoePurposePageLayout";
import { FilteredShoePageProps } from "@/types/FilteredShoePageProps";

export default async function GravelShoesPage(props: FilteredShoePageProps) {
  const shoePurposeProps: ShoePurposePageProps = {
    searchParams: props.searchParams,
    config: {
      purpose: "Gravel",
      title: "Gravel Running Shoes",
      description: "Tackle mixed terrain with versatile gravel running shoes",
      basePath: "/shoes/gravel",
    },
  };

  return <ShoeTypePageLayout {...shoePurposeProps} />;
}
