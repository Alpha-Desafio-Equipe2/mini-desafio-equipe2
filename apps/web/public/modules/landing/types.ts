/**
 * Tipos e Interfaces do Módulo Landing
 */

/**
 * Representação de uma categoria de produtos
 */
export interface Category {
  id: string;
  name: string;
  icon: string; // Nome do ícone Material Symbols
  description?: string;
  link?: string;
}

/**
 * Representação de um item de produto
 */
export interface ProductItem {
  id: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  inStock?: boolean;
  quantity?: number;
}

/**
 * Configuração de tema
 */
export type ThemeMode = "light" | "dark" | "auto";

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor?: string;
  darkColor?: string;
  syncWithSystem: boolean;
}

/**
 * Configuração da landing page
 */
export interface LandingConfig {
  showHero: boolean;
  showCategories: boolean;
  showProducts: boolean;
  showPromo: boolean;
  showFooter: boolean;
  products?: ProductItem[];
  categories?: Category[];
  theme?: ThemeConfig;
  analytics?: AnalyticsConfig;
}

/**
 * Configuração de Analytics
 */
export interface AnalyticsConfig {
  enabled: boolean;
  trackingId?: string;
  events?: AnalyticsEvent[];
}

/**
 * Evento de Analytics
 */
export interface AnalyticsEvent {
  name: string;
  data?: Record<string, any>;
  timestamp: Date;
}

/**
 * Configuração de Navegação
 */
export interface NavigationConfig {
  links: NavigationLink[];
  logo?: string;
  logoText?: string;
  sticky: boolean;
}

export interface NavigationLink {
  label: string;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  icon?: string;
}

/**
 * Configuração do Footer
 */
export interface FooterConfig {
  brandName: string;
  brandDescription: string;
  social?: SocialLink[];
  links?: FooterLinkGroup[];
  contact?: ContactInfo;
  copyright: string;
  showPaymentMethods: boolean;
}

export interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
}

/**
 * Resposta de API para produtos
 */
export interface ProductApiResponse {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image_url?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  requiresPrescription?: boolean;
  [key: string]: any;
}

/**
 * Dados do usuário (contexto da landing)
 */
export interface UserContext {
  isAuthenticated: boolean;
  id?: string;
  name?: string;
  email?: string;
  role?: "admin" | "user" | "guest";
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: ThemeMode;
  language?: string;
  notifications?: boolean;
  favoriteCategories?: string[];
}

/**
 * Estado da landing page
 */
export interface LandingState {
  loading: boolean;
  error?: string;
  config: LandingConfig;
  user: UserContext;
  cart: CartItem[];
  favorites: string[]; // IDs de produtos favoritos
}

/**
 * Item do carrinho
 */
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

/**
 * Evento do módulo Landing
 */
export interface LandingEvent {
  type:
    | "PRODUCT_CLICK"
    | "CATEGORY_CLICK"
    | "CTA_CLICK"
    | "ADD_TO_CART"
    | "ADD_TO_FAVORITES"
    | "THEME_CHANGE"
    | "NAVIGATION";
  payload?: Record<string, any>;
  timestamp: Date;
}

/**
 * Resposta de API genérica
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

/**
 * Configuração de Animação
 */
export interface AnimationConfig {
  duration: number; // em ms
  easing: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  delay?: number;
}

/**
 * Configuração de Layout
 */
export interface LayoutConfig {
  maxWidth: string;
  padding: string;
  gap: string;
  columns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

/**
 * Resposta de Busca
 */
export interface SearchResponse {
  query: string;
  results: ProductItem[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Recomendação de Produto
 */
export interface ProductRecommendation {
  productId: string;
  reason: "popular" | "trending" | "personalized" | "similar";
  score: number;
}

/**
 * Tipo para Callbacks de Eventos
 */
export type EventCallback<T = any> = (event: T) => void;

/**
 * Serviço de Landing
 */
export interface LandingService {
  getCategories(): Promise<Category[]>;
  getProducts(filter?: Record<string, any>): Promise<ProductItem[]>;
  searchProducts(query: string): Promise<SearchResponse>;
  getRecommendations(): Promise<ProductRecommendation[]>;
  trackEvent(event: LandingEvent): Promise<void>;
  addToCart(product: ProductItem, quantity: number): Promise<void>;
  addToFavorites(productId: string): Promise<void>;
}

/**
 * Type Guards
 */
export const isProductItem = (obj: any): obj is ProductItem => {
  return (
    typeof obj === "object" &&
    "id" in obj &&
    "name" in obj &&
    "price" in obj &&
    "image" in obj
  );
};

export const isCategory = (obj: any): obj is Category => {
  return typeof obj === "object" && "id" in obj && "name" in obj && "icon" in obj;
};

export const isCartItem = (obj: any): obj is CartItem => {
  return (
    typeof obj === "object" &&
    "productId" in obj &&
    "name" in obj &&
    "price" in obj &&
    "quantity" in obj
  );
};
