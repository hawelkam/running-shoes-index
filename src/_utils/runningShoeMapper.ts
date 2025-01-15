import { RunningShoe, SanityRunningShoe } from "@/_types/RunningShoe";

export const mapToRunningShoe = (shoe: SanityRunningShoe): RunningShoe => ({
  name: shoe.name,
  shoeTypeName: shoe.shoeType.name,
  releaseDatePl: shoe.releaseInfo.pl?.date
    ? new Date(shoe.releaseInfo.pl.date)
    : undefined,
  releaseDateEu: shoe.releaseInfo.eu?.date
    ? new Date(shoe.releaseInfo.eu.date)
    : undefined,
  releaseDateUs: shoe.releaseInfo.us?.date
    ? new Date(shoe.releaseInfo.us.date)
    : undefined,
  pricePl: shoe.releaseInfo.pl?.price,
  priceEu: shoe.releaseInfo.eu?.price,
  priceUs: shoe.releaseInfo.us?.price,
  category: shoe.category?.map((cat) => cat.name),
  slug: shoe.slug.current,
  key: shoe.slug.current,
  image: shoe.image.url,
  reviewed: shoe.review !== null,
});
