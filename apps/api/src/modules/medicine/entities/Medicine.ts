export interface Medicine {
  id: number;
  name: string;
  manufacturer?: string;
  active_principle: string;
  requires_prescription: boolean;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
