import ApiFetcher from "@/utils/apis";
import { toast } from "react-toastify";
import { Plan, GetPlansResponse } from "@/types/plan";

export interface PlanItem {
  id: number;
  title: string;
  pricing: { [duration: string]: number } | [];
  is_recommended: number;
  created_at: string;
  updated_at: string;
}

export interface PlansResponse {
  data: PlanItem[];
}

export const getPlans = async (): Promise<Plan[] | null> => {
  try {
    const response = await ApiFetcher.get<GetPlansResponse>("/pricing");

    if (response?.data?.data) {
      return response.data.data;
    }

    toast.error("Failed to load plans");
    return null;

  } catch (error) {
    console.error("Error fetching plans:", error);
    toast.error("Error fetching plans");
    return null;
  }
};

// Optional: Get recommended plans only
export const getRecommendedPlans = async (): Promise<Plan[] | null> => {
  try {
    const response = await ApiFetcher.get<GetPlansResponse>("/pricing");

    if (response?.data?.data) {
      // Filter only recommended plans (is_recommended === 1)
      return response.data.data.filter(plan => plan.is_recommended === 1);
    }

    toast.error("Failed to load recommended plans");
    return null;

  } catch (error) {
    console.error("Error fetching recommended plans:", error);
    toast.error("Error fetching recommended plans");
    return null;
  }
};

// Optional: Get a single plan by ID
export const getPlanById = async (id: number): Promise<Plan | null> => {
  try {
    const response = await ApiFetcher.get<GetPlansResponse>("/pricing");

    if (response?.data?.data) {
      const plan = response.data.data.find(p => p.id === id);
      return plan || null;
    }

    toast.error("Plan not found");
    return null;

  } catch (error) {
    console.error("Error fetching plan:", error);
    toast.error("Error fetching plan");
    return null;
  }
};