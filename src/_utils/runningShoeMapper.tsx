import { RunningShoe, SanityRunningShoe } from "@/_types/RunningShoe";
import { Image } from "antd";
import Link from "next/link";

export const mapToRunningShoe = (shoe: SanityRunningShoe): RunningShoe => ({
  name: shoe.name,
  purpose: shoe.purpose,
  releaseDate: shoe.releaseInfo
    ? {
        pl: shoe.releaseInfo.pl?.date
          ? new Date(shoe.releaseInfo.pl.date)
          : undefined,
        eu: shoe.releaseInfo.eu?.date
          ? new Date(shoe.releaseInfo.eu.date)
          : undefined,
        us: shoe.releaseInfo.us?.date
          ? new Date(shoe.releaseInfo.us.date)
          : undefined,
      }
    : { pl: undefined, eu: undefined, us: undefined },
  price: shoe.releaseInfo
    ? {
        pl: shoe.releaseInfo.pl?.price,
        eu: shoe.releaseInfo.eu?.price,
        us: shoe.releaseInfo.us?.price,
      }
    : { pl: undefined, eu: undefined, us: undefined },
  category: shoe.category?.map((cat) => cat.name),
  slug: shoe.slug.current,
  key: shoe.slug.current,
  image: shoe.image.url,
  reviewed: mapToShoeReview(shoe),
});

const mapToShoeReview = (
  shoe: SanityRunningShoe
): "Yes" | "In progress" | "No" => {
  if (shoe.review) {
    if (shoe.review.plReview) {
      return "Yes";
    }
    return "In progress";
  }
  return "No";
};

export const mapToRunningShoeDescription = (shoe: SanityRunningShoe) => [
  {
    key: "1",
    label: "US Price",
    children: shoe.releaseInfo.us?.price && `$${shoe.releaseInfo.us.price}`,
  },
  {
    key: "2",
    label: "EU Price",
    children: shoe.releaseInfo.eu?.price && `€${shoe.releaseInfo.eu.price}`,
  },
  {
    key: "3",
    label: "PL Price",
    children: shoe.releaseInfo.pl?.price && `${shoe.releaseInfo.pl.price}zł`,
  },
  {
    key: "4",
    label: "US release date",
    children:
      shoe.releaseInfo.us?.date &&
      Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
      }).format(new Date(shoe.releaseInfo.us.date)),
  },
  {
    key: "5",
    label: "EU release date",
    children:
      shoe.releaseInfo.eu?.date &&
      Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
      }).format(new Date(shoe.releaseInfo.eu.date)),
  },
  {
    key: "6",
    label: "PL release date",
    children:
      shoe.releaseInfo.pl?.date &&
      Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
      }).format(new Date(shoe.releaseInfo.pl.date)),
  },
];

export const mapToRunningShoeSpecs = (shoe: SanityRunningShoe) => [
  {
    key: "1",
    label: "Category",
    children: shoe.category?.map((o) => o.name).join(", "),
  },
  {
    key: "2",
    label: "Men's weight",
    children: `${shoe.specs.m?.weight}g`,
  },
  {
    key: "3",
    label: "Men's drop",
    children: `${shoe.specs.m?.drop}mm`,
  },
  {
    key: "4",
    label: "Men's stack height",
    children:
      shoe.specs.m?.heelStack &&
      `${shoe.specs.m?.heelStack}mm - ${shoe.specs.m?.heelStack - shoe.specs.m!.drop!}mm`,
  },
  {
    key: "5",
    label: "Women's weight",
    children: `${shoe.specs.w?.weight}g`,
  },
  {
    key: "6",
    label: "Women's drop",
    children: `${shoe.specs.w?.drop}mm`,
  },
  {
    key: "7",
    label: "Women's stack height",
    children:
      shoe.specs.w?.heelStack &&
      `${shoe.specs.w?.heelStack}mm - ${shoe.specs.w?.heelStack - shoe.specs.w!.drop!}mm`,
  },
  {
    key: "8",
    label: "Stability",
    children: shoe.stability,
  },
  {
    key: "9",
    label: "Upper",
    children: shoe.specs.upper?.map((f) => f.name).join(", "),
  },
  {
    key: "10",
    label: "Foam",
    children: shoe.specs.foam?.map((f) => f.name).join(", "),
  },
  {
    key: "11",
    label: "Plate",
    children: shoe.specs.plate,
  },
  {
    key: "12",
    label: "Outsole",
    children: shoe.specs.outsole?.map((o) => o.name).join(", "),
  },
  {
    key: "13",
    label: "Notes",
    children: shoe.notes,
  },
];

export const mapToRunningShoeReview = (shoe: SanityRunningShoe) => [
  {
    key: "1",
    label: "Reviewed shoe weight",
    children: shoe.review.shoeInfo.weightL && shoe.review.shoeInfo.weightR && (
      <div className="flex flex-col">
        <div>{`L: ${shoe.review.shoeInfo.weightL}g | ${Math.round(shoe.review.shoeInfo.weightL * 3.5274) / 100}oz.`}</div>
        <div>{`R: ${shoe.review.shoeInfo.weightR}g | ${Math.round(shoe.review.shoeInfo.weightR * 3.5274) / 100}oz.`}</div>
      </div>
    ),
  },
  {
    key: "2",
    label: "Reviewed shoe size",
    children:
      shoe.review.shoeInfo &&
      `${shoe.review.shoeInfo.sizeEU}EU | ${shoe.review.shoeInfo.sizeUS}US`,
  },
  {
    key: "3",
    label: "English review",
    children: shoe.review.enReview && (
      <div className="flex flex-col sm:flex-row gap-2">
        {shoe.review.enReview.youtube && (
          <a href={shoe.review.enReview.youtube}>YouTube</a>
        )}
        {shoe.review.enReview.instagram && (
          <a href={shoe.review.enReview.instagram}>Instagram</a>
        )}
        {shoe.review.enReview.tiktok && (
          <a href={shoe.review.enReview.tiktok}>TikTok</a>
        )}
      </div>
    ),
  },
  {
    key: "4",
    label: "Polish review",
    children: shoe.review.plReview && (
      <div className="flex flex-col sm:flex-row gap-2">
        {shoe.review.plReview.youtube && (
          <a href={shoe.review.plReview.youtube}>YouTube</a>
        )}
        {shoe.review.plReview.instagram && (
          <a href={shoe.review.plReview.instagram}>Instagram</a>
        )}
        {shoe.review.plReview.tiktok && (
          <a href={shoe.review.plReview.tiktok}>TikTok</a>
        )}
      </div>
    ),
  },
];

export const mapToRunningShoePrevious = (shoe: SanityRunningShoe) => [
  {
    key: "1",
    label: "Name",
    children: (
      <Link href={`/shoes/${shoe.slug.current}`} className="underline">
        {shoe.name}
      </Link>
    ),
  },
  {
    key: "2",
    label: "US release date",
    children:
      shoe.releaseInfo.us?.date &&
      Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
      }).format(new Date(shoe.releaseInfo.us.date)),
  },
  {
    key: "3",
    label: "EU release date",
    children:
      shoe.releaseInfo.eu?.date &&
      Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
      }).format(new Date(shoe.releaseInfo.eu.date)),
  },
  {
    key: "4",
    label: "PL release date",
    children:
      shoe.releaseInfo.pl?.date &&
      Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
      }).format(new Date(shoe.releaseInfo.pl.date)),
  },
  {
    key: "5",
    label: "Image",
    children: shoe.image && (
      <Image width={200} src={`${shoe.image.url}`} alt="" />
    ),
  },
];
