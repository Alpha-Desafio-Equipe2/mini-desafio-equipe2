export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "attendant";
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
}

export interface SaleItem {
  medicine_id: number;
  quantity: number;
}

export interface CreateSaleDTO {
  customer_id: number;
  branch_id?: number;
  items: SaleItem[];
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
  product_id: number;
  quantity: number;
  price_at_time?: number;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  type: "delivery" | "pickup";
  items: OrderItem[];
  created_at: string;
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
