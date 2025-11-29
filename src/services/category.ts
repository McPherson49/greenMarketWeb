import ApiFetcher from "@/utils/apis";
import { toast } from "react-toastify";
import { Category, GetCategoriesResponse } from "@/types/category";

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  banner: string | null;
  color: string;
  products_count: number;
}

export interface CategoryResponse {
  data: CategoryItem[];
}

export const getCategories = async (): Promise<Category[] | null> => {
  try {
    const response = await ApiFetcher.get<GetCategoriesResponse>("/categories");

    if (response?.data?.data) {
      return response.data.data;
    }

    toast.error("Failed to load categories");
    return null;

  } catch (error) {
    console.error("Error fetching categories:", error);
    toast.error("Error fetching categories");
    return null;
  }
};
