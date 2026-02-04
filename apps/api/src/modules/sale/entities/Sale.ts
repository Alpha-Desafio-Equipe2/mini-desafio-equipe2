export interface Sale {
  id: number;
  user_id?: number;
    total_value: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  doctor_crm?: string;
  prescription_date?: string;
  payment_method?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SaleItem {
  id: number;
  sale_id: number;
  medicine_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
}
