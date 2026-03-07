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

    // Try nested data.data first, fall back to data directly
    const stats =
      response?.data?.data ?? (response?.data as unknown as DashboardStats);

    if (stats && typeof stats === "object") {
      return stats;
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
export const getDashboardMetric = async (
  metric: string,
): Promise<number | string | null> => {
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

// TYPES for Profile Image Update
export interface UpdateProfileImageResponse {
  message: string;
  status: boolean;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    type: string;
    avatar: string;
    banner: string;
    business: {
      name: string;
      description: string;
      address: string;
      logo: string;
    };
    settings: {
      escrow: string;
      notification: string;
    };
    socials: {
      twitter: string | null;
      facebook: string | null;
      instagram: string | null;
    };
    tags: string[];
    fcm_token: string | null;
    email_verified_at: string | null;
    provider_name: string | null;
    provider_id: string | null;
    remember_token: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    is_admin: boolean;
    product_count: number;
  };
}

// UPDATE PROFILE IMAGE
export const updateProfileImage = async (
  imageFile: File,
): Promise<UpdateProfileImageResponse | null> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("avatar", imageFile);
    formData.append("file", imageFile);

    const response = await ApiFetcher.post<UpdateProfileImageResponse>(
      "/auth/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response?.data?.status) {
      toast.success(
        response.data.message || "Profile image updated successfully!",
      );
      return response.data;
    }

    toast.error(response?.data?.message || "Failed to update profile image");
    return null;
  } catch (error: any) {
    console.error("Error updating profile image:", error);

    // Handle specific error messages
    const errorMessage =
      error.response?.data?.message || "Error updating profile image";
    toast.error(errorMessage);

    return null;
  }
};
