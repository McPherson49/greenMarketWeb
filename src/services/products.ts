import ApiFetcher from "@/utils/apis";
import { toast } from "react-toastify";
import { GetProductsRequest, GetProductsResponse, ProductData } from "@/types/product";

// GET ALL PRODUCTS
export const getProducts = async (): Promise<GetProductsResponse | null> => {
  try {
    const response = await ApiFetcher.get<GetProductsResponse>(`/products`);

    if (response?.data) {
      return response.data; 
    }

    toast.error("Failed to load Products");
    return null;
  } catch (error) {
    console.error("Error fetching Products:", error);
    toast.error("Error fetching Products");
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
export const getSimilarProducts = async (id: number): Promise<ProductData | null> => {
  try {
    const response = await ApiFetcher.get<GetProductsResponse>(`/products`, {
      params: {
        id: id,
      },
    });

    if (response?.data?.data) {
      return response.data.data;
    }

    toast.error("Failed to load similar Products");
    return null;
  } catch (error) {
    console.error("Error fetching similar Products:", error);
    toast.error("Error fetching similar Products");
    return null;
  }
}
