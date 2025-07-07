import ShoePurposePageLayout, {
  ShoePurposePageProps,
} from "@/components/features/shoes/ShoePurposePageLayout";
import { FilteredShoePageProps } from "@/types/FilteredShoePageProps";

export default function GymTreadmillShoesPage(props: FilteredShoePageProps) {
  const shoePurposeProps: ShoePurposePageProps = {
    searchParams: props.searchParams,
    config: {
      purpose: "Gym / Treadmill",
      title: "Gym & Treadmill Running Shoes",
      description:
        "Optimize your indoor training with specialized gym and treadmill shoes",
      basePath: "/shoes/gym-treadmill",
    },
  };

  return <ShoePurposePageLayout {...shoePurposeProps} />;
}
