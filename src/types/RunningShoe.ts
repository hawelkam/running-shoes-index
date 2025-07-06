import { SanityDocument } from "next-sanity";

export type ReleaseInfo = {
  pl?: { date: string; price: number };
  eu?: { date: string; price: number };
  us?: { date: string; price: number };
};

export type SanityRunningShoe = SanityDocument & {
  name: string;
  brand: { name: string; slug: { current: string } };
  purpose: string;
  releaseInfo: ReleaseInfo;
  stability: string;
  categories?: string[] | undefined;
  wideAvailable: boolean;
  waterproofAvailable: boolean;
  specs: {
    m?:
      | {
          weight?: number | undefined;
          drop?: number | undefined;
          heelStack?: number | undefined;
        }
      | undefined;
    w?:
      | {
          weight?: number | undefined;
          drop?: number | undefined;
          heelStack?: number | undefined;
        }
      | undefined;
    upper?: { name: string }[] | undefined;
    foam?: { name: string }[] | undefined;
    plate: string;
    outsole?: { name: string }[] | undefined;
  };
  slug: { current: string };
  notes: string;
  image: { url: string };
  previousVersion: SanityRunningShoe;
  nextVersion: SanityRunningShoe;
};

export type RunningShoe = {
  name: string;
  purpose: string;
  releaseDate: {
    pl?: Date | undefined;
    eu?: Date | undefined;
    us?: Date | undefined;
  };
  price: {
    pl?: number | undefined;
    eu?: number | undefined;
    us?: number | undefined;
  };
  categories?: string[] | undefined;
  slug: string;
  image: string;
  key: string;
};
