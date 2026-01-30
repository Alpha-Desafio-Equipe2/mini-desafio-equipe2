export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "attendant" | "customer";
  phone?: string;
  address?: string;
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
  requires_prescription: boolean;
}

export interface Customer {
  id: number;
  name: string;
  cpf: string;
  email?: string;
  user_id?: number;
}

export interface SaleItem {
  medicine_id: number;
  quantity: number;
}

export interface CreateSaleDTO {
  customer_id: number;
  items: SaleItem[];
  payment_method: string;
  doctor_crm?: string;
  prescription_date?: string;
  doctor_name?: string;
  doctor_uf?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
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
  product_id?: number; // Frontend uses this usually
  medicine_id?: number; // Backend might return this
  quantity: number;
  price_at_time?: number;
  unit_price?: number; // Backend alias
  product_name?: string;
}

export interface Order {
  id: number;
  customer_id: number;
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
    editProduct?: (id: number) => void;
    viewOrderDetails?: (id: number) => void;
    confirmOrder?: (id: number) => void;
  }
}
