import ApiFetcher from "@/utils/apis";
import { toast } from "react-toastify";

// TYPES
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  avatar: string;
  banner: string | null;
  business: any | null;
  settings: any | null;
  socials: any | null;
  tags: any | null;
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
}

export interface GetProfileResponse {
  data: UserProfile;
  message: string;
  status: boolean;
}

// GET USER PROFILE
export const getProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await ApiFetcher.get<GetProfileResponse>(`/auth/profile`);

    if (response?.data?.data) {
      return response.data.data;
    }

    toast.error("Failed to load profile");
    return null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    toast.error("Error fetching profile");
    return null;
  }
};

// GET SPECIFIC PROFILE FIELD
export const getProfileField = async (field: string): Promise<any | null> => {
  try {
    const response = await ApiFetcher.get<GetProfileResponse>(`/auth/profile`);

    if (response?.data?.data) {
      return response.data.data[field as keyof UserProfile];
    }

    toast.error(`Failed to load ${field}`);
    return null;
  } catch (error) {
    console.error(`Error fetching ${field}:`, error);
    toast.error(`Error fetching ${field}`);
    return null;
  }
};

// GET USER AVATAR
export const getUserAvatar = async (): Promise<string | null> => {
  try {
    const response = await ApiFetcher.get<GetProfileResponse>(`/auth/profile`);

    if (response?.data?.data) {
      return response.data.data.avatar;
    }

    toast.error("Failed to load avatar");
    return null;
  } catch (error) {
    console.error("Error fetching avatar:", error);
    toast.error("Error fetching avatar");
    return null;
  }
};

// GET USER NAME
export const getUserName = async (): Promise<string | null> => {
  try {
    const response = await ApiFetcher.get<GetProfileResponse>(`/auth/profile`);

    if (response?.data?.data) {
      return response.data.data.name;
    }

    toast.error("Failed to load user name");
    return null;
  } catch (error) {
    console.error("Error fetching user name:", error);
    toast.error("Error fetching user name");
    return null;
  }
};

// GET USER EMAIL
export const getUserEmail = async (): Promise<string | null> => {
  try {
    const response = await ApiFetcher.get<GetProfileResponse>(`/auth/profile`);

    if (response?.data?.data) {
      return response.data.data.email;
    }

    toast.error("Failed to load user email");
    return null;
  } catch (error) {
    console.error("Error fetching user email:", error);
    toast.error("Error fetching user email");
    return null;
  }
};

// GET PRODUCT COUNT
export const getProfileProductCount = async (): Promise<number | null> => {
  try {
    const response = await ApiFetcher.get<GetProfileResponse>(`/auth/profile`);

    if (response?.data?.data) {
      return response.data.data.product_count;
    }

    toast.error("Failed to load product count");
    return null;
  } catch (error) {
    console.error("Error fetching product count:", error);
    toast.error("Error fetching product count");
    return null;
  }
};

// CHECK IF USER IS ADMIN
export const isUserAdmin = async (): Promise<boolean | null> => {
  try {
    const response = await ApiFetcher.get<GetProfileResponse>(`/auth/profile`);

    if (response?.data?.data) {
      return response.data.data.is_admin;
    }

    toast.error("Failed to load user role");
    return null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    toast.error("Error fetching user role");
    return null;
  }
};