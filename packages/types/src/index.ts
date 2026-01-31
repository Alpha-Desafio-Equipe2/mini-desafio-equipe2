export interface Medicine {
  id: number;
  name: string;
  manufacturer: string;
  active_principle: string;
  requires_prescription: boolean;
  price: number;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: number;
  name: string;
  cpf: string;
  email?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'attendant' | 'manager';
  created_at?: string;
  updated_at?: string;
}

export interface Sale {
  id: number;
  customer_id?: number;
  branch_id: number;
  total_value: number;
  status: 'pending' | 'completed' | 'cancelled';
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
}
