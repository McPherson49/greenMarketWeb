export interface PlanPricing {
  [duration: string]: number;
}

export interface Plan {
  id: number;
  title: string;
  pricing: PlanPricing | [];
  is_recommended: number;
  created_at: string;
  updated_at: string;
}

export interface GetPlansResponse {
  data: Plan[];
  message: string;
  status: boolean;
}