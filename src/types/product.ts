export interface Product {
  id: number;
  category_id: number;
  old_id: number;
  user_id: number;
  title: string;
  slug: string;
  tags: string[];
  description: string;
  state: string;
  local: string | null;
  nearest: string;
  plan_id: number;
  price: number;
  use_escrow: number;
  status: string;
  images: string[];
  price_range: {
    max: number;
    min: number;
  };
  meta: any;
  properties: any[];
  created_at: string;
  updated_at: string;
  views: number;
  no_subscription: number;
  user: {
    avatar: string;
    id: number;
    name: string;
    phone: string;
    email: string;
    banner: string;
  };
  social: {
    twitter: string | null;
    facebook: string | null;
    instagram: string | null;
  };
  business: {
    logo: string;
    name: string;
    description: string;
    rating: number;
  };
  purchased_ad: boolean;
  thumbnail: string;
  keyword: string;
  address: string;
  phone: string;
  chat_id: string;
  reviews: any[];
  subscription: any;
  icon: string;
  sub: string;
}

export type ProductData = {
  current_page: number;
  data: Product[];
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
};

export interface GetProductsRequest {
  page?: number;
  per_page?: number;
  category_id?: number;
  state?: string;
  search?: string;
}

export interface GetProductsResponse {
  data: ProductData;
}

