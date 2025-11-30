import ApiFetcher from "@/utils/apis";
import { toast } from "react-toastify";

// TYPES
export interface DashboardStats {
  escrow: number;
  products: number;
  tickets: number;
  liked: number;
  wish_list: number;
  wallet: string;
}

export interface GetDashboardResponse {
  data: DashboardStats;
  message?: string;
  status?: string;
}

// GET DASHBOARD STATS
export const getDashboardStats = async (): Promise<DashboardStats | null> => {
  try {
    const response = await ApiFetcher.get<GetDashboardResponse>(`/dashboard`);

    if (response?.data?.data) {
      return response.data.data;
    }

    toast.error("Failed to load dashboard statistics");
    return null;
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    toast.error("Error fetching dashboard statistics");
    return null;
  }
};

// GET SPECIFIC DASHBOARD METRIC
export const getDashboardMetric = async (metric: string): Promise<number | string | null> => {
  try {
    const response = await ApiFetcher.get<GetDashboardResponse>(`/dashboard`);

    if (response?.data?.data) {
      return response.data.data[metric as keyof DashboardStats];
    }

    toast.error(`Failed to load ${metric} data`);
    return null;
  } catch (error) {
    console.error(`Error fetching ${metric} data:`, error);
    toast.error(`Error fetching ${metric} data`);
    return null;
  }
};

// GET WALLET BALANCE
export const getWalletBalance = async (): Promise<string | null> => {
  try {
    const response = await ApiFetcher.get<GetDashboardResponse>(`/dashboard`);

    if (response?.data?.data) {
      return response.data.data.wallet;
    }

    toast.error("Failed to load wallet balance");
    return null;
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    toast.error("Error fetching wallet balance");
    return null;
  }
};

// GET PRODUCTS COUNT
export const getProductsCount = async (): Promise<number | null> => {
  try {
    const response = await ApiFetcher.get<GetDashboardResponse>(`/dashboard`);

    if (response?.data?.data) {
      return response.data.data.products;
    }

    toast.error("Failed to load products count");
    return null;
  } catch (error) {
    console.error("Error fetching products count:", error);
    toast.error("Error fetching products count");
    return null;
  }
};

// GET ESCROW COUNT
export const getEscrowCount = async (): Promise<number | null> => {
  try {
    const response = await ApiFetcher.get<GetDashboardResponse>(`/dashboard`);

    if (response?.data?.data) {
      return response.data.data.escrow;
    }

    toast.error("Failed to load escrow count");
    return null;
  } catch (error) {
    console.error("Error fetching escrow count:", error);
    toast.error("Error fetching escrow count");
    return null;
  }
};