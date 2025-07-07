import { client } from "@/sanity/client";
import { CACHE_OPTIONS } from "@/utils/cache";

export interface Category {
  name: string;
  _id: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const query = `*[_type == "shoeCategory"] | order(name asc) {
      _id,
      name
    }`;

    const categories = await client.fetch<Category[]>(
      query,
      {},
      CACHE_OPTIONS.VERY_LONG // Categories change infrequently
    );

    return categories || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
