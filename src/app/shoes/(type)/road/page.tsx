import ShoePurposePageLayout, {
  ShoePurposePageProps,
} from "@/components/features/shoes/ShoePurposePageLayout";
import { FilteredShoePageProps } from "@/types/FilteredShoePageProps";

export default function RoadShoesPage(props: FilteredShoePageProps) {
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
