// types/dashboard.ts
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