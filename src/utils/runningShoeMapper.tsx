import { Image } from "antd";
import Link from "next/link";

import { RunningShoe, SanityRunningShoe } from "@/types/RunningShoe";

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
  categories: shoe.categories,
  slug: shoe.slug.current,
  key: shoe.slug.current,
  image: shoe.image.url,
});

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
    children: shoe.categories?.join(", "),
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
    children: shoe.specs.m?.heelStack
      ? `${shoe.specs.m.heelStack}mm - ${shoe.specs.m.heelStack - shoe.specs.m.drop!}mm`
      : "-",
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
    children: shoe.specs.w?.heelStack
      ? `${shoe.specs.w.heelStack}mm - ${shoe.specs.w.heelStack - shoe.specs.w.drop!}mm`
      : "-",
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
