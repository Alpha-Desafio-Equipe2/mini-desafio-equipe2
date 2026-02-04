export interface Medicine {
  id: number;
  name: string;
  manufacturer?: string;
  category: string;
  active_principle: string;
  requires_prescription: boolean;
  price: number;
  stock: number;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
