import ShoePurposePageLayout, {
  ShoePurposePageProps,
} from "@/components/features/shoes/ShoePurposePageLayout";
import { FilteredShoePageProps } from "@/types/FilteredShoePageProps";

export default async function TrailShoesPage(props: FilteredShoePageProps) {
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
