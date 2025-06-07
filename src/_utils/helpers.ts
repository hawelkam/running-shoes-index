import { ReleaseInfo } from "@/_types/RunningShoe";

export function preparePriceInfo(releaseInfo: ReleaseInfo): string {
  const prices: string[] = [];

  if (releaseInfo.us?.price) {
    prices.push(preparePriceInUSD(releaseInfo));
  }
  if (releaseInfo.eu?.price) {
    prices.push(preparePriceInEUR(releaseInfo));
  }
  if (releaseInfo.pl?.price) {
    prices.push(preparePriceInPLN(releaseInfo));
  }

  return prices.join(" | ");
}

export function prepareReleaseDate(releaseDate: string | undefined): string {
  if (!releaseDate) {
    return "-";
  }
  return Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
  }).format(new Date(releaseDate));
}

export function preparePriceInPLN(releaseInfo: ReleaseInfo): string {
  if (releaseInfo.pl?.price) {
    return `${releaseInfo.pl.price} zł`;
  }
  return "-";
}
export function preparePriceInEUR(releaseInfo: ReleaseInfo): string {
  if (releaseInfo.eu?.price) {
    return `€${releaseInfo.eu.price}`;
  }
  return "-";
}
export function preparePriceInUSD(releaseInfo: ReleaseInfo): string {
  if (releaseInfo.us?.price) {
    return `$${releaseInfo.us.price}`;
  }
  return "-";
}
export function prepareHeightInMM(height: number | undefined): string {
  if (height) {
    return `${height}mm`;
  }
  return "-";
}
export function prepareWeight(weight: number | undefined): string {
  if (weight) {
    return `${weight}g (${(weight * 0.03527396).toFixed(1)} oz)`;
  }
  return "-";
}
export function prepareListDividedByComma(
  items: { name: string }[] | undefined
): string {
  if (items && items.length > 0) {
    return items.map((u) => u.name).join(", ");
  }
  return "-";
}
