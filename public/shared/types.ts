export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "pharmacy" | "customer";
  phone?: string;
  address?: string;
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
