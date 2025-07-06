import ShoePurposePageLayout, {
  ShoePurposePageProps,
} from "@/components/features/shoes/ShoePurposePageLayout";
import { FilteredShoePageProps } from "@/types/FilteredShoePageProps";

export default async function TrackShoesPage(props: FilteredShoePageProps) {
  const shoePurposeProps: ShoePurposePageProps = {
    searchParams: props.searchParams,
    config: {
      purpose: "Track",
      title: "Track Running Shoes",
      description: "Achieve your best times with precision track running shoes",
      basePath: "/shoes/track",
    },
  };

  return <ShoePurposePageLayout {...shoePurposeProps} />;
}
