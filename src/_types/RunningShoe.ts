import { SanityDocument } from "next-sanity";

export type SanityRunningShoe = SanityDocument & {
  name: string;
  brand: { name: string };
  shoeType: { name: string };
  releaseInfo: {
    pl: { date: string; price: number };
    eu: { date: string; price: number };
    us: { date: string; price: number };
  };
  stability: string;
  category?: { name: string }[];
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
  previousVersion: {
    name: string;
    slug: { current: string };
    releaseInfo: {
      pl: { date: string; price: number };
      eu: { date: string; price: number };
      us: { date: string; price: number };
    };
    image: { url: string };
  };
  review: {
    shoeInfo: { weight: number; sizeUS: number; sizeEU: number };
    plReview: { youtube: string; instagram: string; tiktok: string };
    enReview: { youtube: string; instagram: string; tiktok: string };
  };
};

export type RunningShoe = {
  name: string;
  shoeTypeName: string;
  releaseDatePl?: Date;
  releaseDateEu?: Date;
  releaseDateUs?: Date;
  pricePl?: number;
  priceEu?: number;
  priceUs?: number;
  category?: string[];
  slug: string;
  image: string;
  reviewed: boolean;
  key: string;
};
