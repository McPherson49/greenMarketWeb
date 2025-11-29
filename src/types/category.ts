export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  banner: string | null;
  color: string;
  products_count: number;
}

export interface GetCategoriesResponse {
  data: Category[];
}
