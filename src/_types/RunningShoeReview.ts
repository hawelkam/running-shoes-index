import { SanityDocument } from "next-sanity";
import { SanityRunningShoe } from "./RunningShoe";

export type SanityRunningShoeReview = SanityDocument & {
  shoe: SanityRunningShoe;
  weightL?: number;
  weightR?: number;
  sizeUS: number;
  sizeEU: number;
  rating?: "S" | "A" | "B" | "C" | "D" | "E";
  writtenReview?: string;
  reviewDate?: string; // ISO date string
  plReview?: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
  };
  enReview?: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
  };
};
