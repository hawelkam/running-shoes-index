import { ReleaseInfo, SanityRunningShoe } from "@/_types/RunningShoe";

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
    return `${releaseInfo.pl.price}zł`;
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
export function prepareMissingDataList(shoe: SanityRunningShoe): string {
  const missingData: string[] = [];
  if (!shoe.releaseInfo) {
    missingData.push("Release info");
  } else {
    if (!shoe.releaseInfo.pl) {
      missingData.push("PL release info");
    }
    if (!shoe.releaseInfo.eu) {
      missingData.push("EU release info");
    }
    if (!shoe.releaseInfo.us) {
      missingData.push("US release info");
    }
    if (!shoe.releaseInfo.pl?.date) {
      missingData.push("PL release date");
    }
    if (!shoe.releaseInfo.eu?.date) {
      missingData.push("EU release date");
    }
    if (!shoe.releaseInfo.us?.date) {
      missingData.push("US release date");
    }
    if (!shoe.releaseInfo.pl?.price) {
      missingData.push("PL price");
    }
    if (!shoe.releaseInfo.eu?.price) {
      missingData.push("EU price");
    }
    if (!shoe.releaseInfo.us?.price) {
      missingData.push("US price");
    }
  }
  if (!shoe.category) {
    missingData.push("Category");
  }
  if (!shoe.image) {
    missingData.push("Image");
  }
  if (!shoe.specs) {
    missingData.push("Specs");
  } else {
    if (!shoe.specs.m) {
      missingData.push("Men's specs");
    }
    if (!shoe.specs.w) {
      missingData.push("Women's specs");
    }
    if (!shoe.specs.m?.weight) {
      missingData.push("Men's weight");
    }
    if (!shoe.specs.w?.weight) {
      missingData.push("Women's weight");
    }
    if (!shoe.specs.m?.drop) {
      missingData.push("Men's drop");
    }
    if (!shoe.specs.w?.drop) {
      missingData.push("Women's drop");
    }
    if (!shoe.specs.m?.heelStack) {
      missingData.push("Men's heel stack");
    }
    if (!shoe.specs.w?.heelStack) {
      missingData.push("Women's heel stack");
    }
    if (!shoe.specs.upper) {
      missingData.push("Upper");
    }
    if (!shoe.specs.foam) {
      missingData.push("Foam");
    }
    if (!shoe.specs.plate) {
      missingData.push("Plate");
    }
    if (!shoe.specs.outsole) {
      missingData.push("Outsole");
    }
  }

  return missingData.join(", ") || "No missing data";
}
export function isCurrentYearRelease(releaseDate: string | undefined): boolean {
  if (!releaseDate) return false;
  const currentYear = new Date().getFullYear();
  const releaseYear = new Date(releaseDate).getFullYear();
  return releaseYear === currentYear;
}
