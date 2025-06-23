import { client } from "@/sanity/client";

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
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    return categories || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
