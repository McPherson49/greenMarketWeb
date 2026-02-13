import ApiFetcher from "@/utils/apis";
import { toast } from "react-toastify";
import { ProductsResponse, ProductsParams, Product } from "@/types/adminProducts";

export const ProductService = {
  /**
   * Get all products with pagination and filters
   */
  async getProducts(params?: ProductsParams): Promise<ProductsResponse> {
    try {
      const response = await ApiFetcher.get<ProductsResponse>('/products', { 
        params: {
          ...params,
          byAdmin: true // Always include byAdmin=true for admin panel
        }
      });
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch products');
      throw error;
    }
  },

  /**
   * Get a single product by ID
   */
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await ApiFetcher.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch product');
      throw error;
    }
  },

  /**
   * Update product status (PATCH method)
   */
  async updateProductStatus(id: number, status: 'rejected' | 'publish' | 'pending' | 'draft' | 'trash'): Promise<Product> {
    try {
      const response = await ApiFetcher.patch<Product>(`/products/${id}`, { status });
      toast.success('Product status updated successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update product status');
      throw error;
    }
  },

  /**
   * Delete product (move to trash)
   */
  async deleteProduct(id: number): Promise<Product> {
    try {
      const response = await ApiFetcher.patch<Product>(`/products/${id}`, { status: 'trash' });
      toast.success('Product moved to trash successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      throw error;
    }
  },

  /**
   * Search products by title, description, or tags
   */
  async searchProducts(query: string, params?: Omit<ProductsParams, 'search'>): Promise<ProductsResponse> {
    return this.getProducts({
      ...params,
      search: query,
    });
  },

  /**
   * Boost product ad (if you have this feature)
   */
  async boostProductAd(id: number): Promise<any> {
    try {
      const response = await ApiFetcher.post(`/products/${id}/boost`);
      toast.success('Product ad boosted successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to boost product ad');
      throw error;
    }
  },
};