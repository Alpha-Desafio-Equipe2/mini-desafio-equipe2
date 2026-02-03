export interface Sale {
  id: number;
  customer_id?: number;
  branch_id: number;
  total_value: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  doctor_crm?: string;
  prescription_date?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id: number;
  sale_id: number;
  medicine_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  medicine_name?: string; // Preenchido via JOIN
}

export interface SaleWithItems extends Sale {
  items: SaleItem[];
}