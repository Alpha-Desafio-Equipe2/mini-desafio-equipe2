export interface Medicine {
  id: number;
  name: string;
  manufacturer?: string;
  active_principle: string;
  requires_prescription: boolean;
  price: number;
  stock: number;
  image_url?: string;
  category_id?: number;
  created_at?: string;
  updated_at?: string;
}