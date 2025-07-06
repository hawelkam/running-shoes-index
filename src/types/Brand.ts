import { SanityDocument } from "next-sanity";

export type SanityBrand = SanityDocument & {
  name: string;
  slug: { current: string };
  image: { url: string };
  country: string;
  usWebsite: string;
  euWebsite: string;
  plWebsite: string;
  usMediaContact: string;
  euMediaContact: string;
  plMediaContact: string;
};
