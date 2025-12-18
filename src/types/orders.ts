// types/orders.ts
export interface GetOrdersRequest {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface GetOrdersResponse {
  current_page: number;
  data: Order[];
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface Order {
  id: string;
  order_number?: string;
  customer_name: string;
  customer_email?: string;
  product_name: string;
  product_id?: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  created_at: string;
  updated_at?: string;
  // Add any other fields your API returns
}