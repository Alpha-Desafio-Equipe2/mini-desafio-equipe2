export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "CLIENT";
  balance?: number;
  phone?: string;
  address?: string;
  cpf?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Medicine {
  id: number;
  name: string;
  manufacturer?: string;
  active_principle: string;
  price: number;
  stock: number;
  image_url?: string;
  category:string;
  requires_prescription: boolean;
}

export interface SaleItem {
  medicine_id: number;
  quantity: number;
}

export interface CreateSaleDTO {
  user_id?: number;
  items: SaleItem[];
  doctor_crm?: string;
  prescription_date?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price: number;
  quantity: number;
  image_url?: string;
  requires_prescription?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id?: number;
  medicine_id?: number; 
  quantity: number;
  price_at_time?: number;
  unit_price?: number;
  product_name?: string;
}

export interface Order {
  id: number;
  user_id: number;
  status?: string;
  type: "delivery" | "pickup";
  items?: OrderItem[];
  total_value: number;
  created_at: string;
  doctor_crm?: string;
  prescription_date?: string;
}

// Deprecated or Alias if needed
export interface Medicamento {
  id: number;
  nome: string;
  fabricante: string;
  ativo: string;
  receita: boolean;
  preco: number;
  estoque: number;
}

// Extensão do objeto Window para navegação global
declare global {
  interface Window {
    navigate: (path: string) => void;
    switchTab?: (tab: string) => void;
    showProductForm?: () => void;
    deleteProduct?: (id: number) => void;
    adminCancelOrder?: (id: number) => void;
    updateCartItem?: (id: number, qty: string) => void;
    removeCartItem?: (id: number) => void;
    cancelOrder?: (id: number) => void;
  }
}
