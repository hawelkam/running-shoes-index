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
  categories?: string[];
  wideAvailable: boolean;
  waterproofAvailable: boolean;
  specs: {
    m?: { weight?: number; drop?: number; heelStack?: number };
    w?: { weight?: number; drop?: number; heelStack?: number };
    upper?: { name: string }[];
    foam?: { name: string }[];
    plate: string;
    outsole?: { name: string }[];
  };
  slug: { current: string };
  notes: string;
  image: { url: string };
  previousVersion: SanityRunningShoe;
  review: {
    shoeInfo: {
      weightL: number;
      weightR: number;
      sizeUS: number;
      sizeEU: number;
    };
    plReview: { youtube: string; instagram: string; tiktok: string };
    enReview: { youtube: string; instagram: string; tiktok: string };
  };
};

export type RunningShoe = {
  name: string;
  purpose: string;
  releaseDate: {
    pl?: Date;
    eu?: Date;
    us?: Date;
  };
  price: {
    pl?: number;
    eu?: number;
    us?: number;
  };
  categories?: string[];
  slug: string;
  image: string;
  reviewed: "Yes" | "In progress" | "No";
  key: string;
};
