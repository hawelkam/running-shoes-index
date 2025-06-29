import ShoePurposePageLayout, {
  ShoePurposePageProps,
} from "../../_components/ShoePurposePageLayout";

interface GymTreadmillShoesPageProps {
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

export default async function GymTreadmillShoesPage(
  props: GymTreadmillShoesPageProps
) {
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
