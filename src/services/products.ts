import ApiFetcher from "@/utils/apis";
import { toast } from "react-toastify";
import { GetProductsRequest, GetProductsResponse, ProductData } from "@/types/product";

// GET ALL PRODUCTS
export const getProducts = async (
  params: GetProductsRequest = {}
): Promise<ProductData | null> => {  // Change return type
  try {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const response = await ApiFetcher.get<ProductData>(  // Change generic type
      `/products?${query}`
    );

    // Check if response exists
    if (response?.data) {
      return response.data;  // Return response.data directly
    }

    toast.error("Failed to load Products");
    return null;
  } catch (error) {
    console.error("Error fetching Products:", error);
    toast.error("Error fetching Products");
    return null;
  }
};

// GET MY PRODUCTS
export const getMyProducts = async (
  page: number = 1, 
  per_page: number = 24
): Promise<ProductData | null> => {
  try {
    const response = await ApiFetcher.get<ProductData>(
      `/my-products?page=${page}&per_page=${per_page}`
    );

    if (response?.data) {
      return response.data; 
    }

    toast.error("Failed to load your products");
    return null;
  } catch (error) {
    console.error("Error fetching your products:", error);
    toast.error("Error fetching your products");
    return null;
  }
};

// GET PRODUCT BY ID
export const getProductDetails = async (id: string): Promise<any | null> => {
  try {
    const response = await ApiFetcher.get(`/products/${id}`);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching Product Details:", error);
    toast.error("Error fetching Product details");
    return null;
  }
};

// GET SIMILAR PRODUCTS
export const getSimilarProducts = async (
  id: number, 
  page: number = 1, 
  per_page: number = 10
): Promise<SimilarProductsResponse | null> => {
  try {
    const response = await ApiFetcher.get<SimilarProductsResponse>(
      `/similar-products/${id}?page=${page}&per_page=${per_page}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching similar Products:", error);
    toast.error("Error fetching similar Products");
    return null;
  }
}

// Make sure you have these types defined in your services file
export type SimilarProduct = {
  id: number;
  title: string;
  price: number;
  price_range: {
    max: string;
    min: string;
  };
  thumbnail: string;
  images: string[];
  business: {
    name: string;
    rating: number;
  };
  user: {
    name: string;
  };
  sub: string;
  tags: string[];
};

export type SimilarProductsResponse = {
  current_page: number;
  data: SimilarProduct[];
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  path?: string;
};