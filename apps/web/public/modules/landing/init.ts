/**
 * Inicializador do Módulo Landing
 * 
 * Este arquivo centraliza toda a lógica de inicialização do módulo landing
 */

import { LandingState, UserContext, LandingConfig } from "./types.js";
import { setupThemeToggle } from "./components/theme-toggle.js";

// Tipagem para Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Estado global do módulo landing
 */
let landingState: LandingState = {
  loading: false,
  config: {
    showHero: true,
    showCategories: true,
    showProducts: true,
    showPromo: true,
    showFooter: true,
  },
  user: {
    isAuthenticated: false,
    role: "guest",
  },
  cart: [],
  favorites: [],
};

/**
 * Inicializar o módulo landing
 */
export const initLanding = async (config?: Partial<LandingConfig>): Promise<void> => {
  try {
    landingState.loading = true;

    // Mesclar configuração customizada
    if (config) {
      landingState.config = { ...landingState.config, ...config };
    }

    // Carregar contexto do usuário
    loadUserContext();

    // Carregar favoritos
    loadFavorites();

    // Carregar carrinho
    loadCart();

    // Setup tema
    setupThemeToggle();

    // Inicializar listeners globais
    initGlobalListeners();

    console.log("[Landing] Módulo inicializado com sucesso");
  } catch (error) {
    console.error("[Landing] Erro ao inicializar:", error);
    landingState.error = (error as Error).message;
  } finally {
    landingState.loading = false;
  }
};

/**
 * Carregar contexto do usuário do localStorage
 */
const loadUserContext = (): void => {
  try {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userStr && token) {
      const user = JSON.parse(userStr);
      landingState.user = {
        isAuthenticated: true,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        preferences: {
          theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
        },
      };
    } else {
      landingState.user = {
        isAuthenticated: false,
        role: "guest",
      };
    }
  } catch (error) {
    console.warn("[Landing] Erro ao carregar contexto do usuário:", error);
  }
};

/**
 * Carregar favoritos do localStorage
 */
const loadFavorites = (): void => {
  try {
    const favorites = localStorage.getItem("favorites");
    if (favorites) {
      landingState.favorites = JSON.parse(favorites);
    }
  } catch (error) {
    console.warn("[Landing] Erro ao carregar favoritos:", error);
  }
};

/**
 * Carregar carrinho do localStorage
 */
const loadCart = (): void => {
  try {
    const cart = localStorage.getItem("cart");
    if (cart) {
      landingState.cart = JSON.parse(cart);
    }
  } catch (error) {
    console.warn("[Landing] Erro ao carregar carrinho:", error);
  }
};

/**
 * Adicionar listener global para o botão de favorito
 */
const initGlobalListeners = (): void => {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // Botão de favorito
    if (target.closest(".product-favorite-btn")) {
      const productCard = target.closest(".product-card");
      if (productCard) {
        const productName = productCard.querySelector(".product-name")?.textContent || "Produto";
        console.log("[Landing] Favorito clicado:", productName);
      }
    }

    // Botão de carrinho
    if (target.closest(".btn-add-cart")) {
      const productCard = target.closest(".product-card");
      if (productCard) {
        const productName = productCard.querySelector(".product-name")?.textContent || "Produto";
        const priceText = productCard.querySelector(".price-current")?.textContent || "R$ 0,00";
        console.log("[Landing] Adicionar ao carrinho:", productName, priceText);
      }
    }
  });
};

/**
 * Adicionar produto aos favoritos
 */
export const addToFavorites = (productId: string): void => {
  if (!landingState.favorites.includes(productId)) {
    landingState.favorites.push(productId);
    saveFavorites();
    console.log("[Landing] Produto adicionado aos favoritos:", productId);
  }
};

/**
 * Remover produto dos favoritos
 */
export const removeFromFavorites = (productId: string): void => {
  landingState.favorites = landingState.favorites.filter((id) => id !== productId);
  saveFavorites();
  console.log("[Landing] Produto removido dos favoritos:", productId);
};

/**
 * Salvar favoritos no localStorage
 */
const saveFavorites = (): void => {
  localStorage.setItem("favorites", JSON.stringify(landingState.favorites));
};

/**
 * Verificar se produto está nos favoritos
 */
export const isFavorited = (productId: string): boolean => {
  return landingState.favorites.includes(productId);
};

/**
 * Obter estado atual do módulo
 */
export const getLandingState = (): LandingState => {
  return { ...landingState };
};

/**
 * Obter contexto do usuário
 */
export const getUserContext = (): UserContext => {
  return { ...landingState.user };
};

/**
 * Verificar se usuário está autenticado
 */
export const isAuthenticated = (): boolean => {
  return landingState.user.isAuthenticated;
};

/**
 * Obter rol do usuário
 */
export const getUserRole = (): "admin" | "user" | "guest" => {
  return landingState.user.role || "guest";
};

/**
 * Registrar evento no módulo landing
 */
export const logEvent = (
  eventType: string,
  data?: Record<string, any>
): void => {
  const event = {
    type: eventType,
    data,
    timestamp: new Date().toISOString(),
    userRole: landingState.user.role,
    isAuthenticated: landingState.user.isAuthenticated,
  };

  console.log("[Landing Event]", event);

  // Enviar para analytics se disponível
  if (window.gtag) {
    window.gtag("event", eventType, data || {});
  }
};

/**
 * Cleanup - Limpar recursos do módulo
 */
export const cleanupLanding = (): void => {
  console.log("[Landing] Limpando recursos");
  // Aqui você pode adicionar lógica de cleanup
};

/**
 * Recarregar configuração do módulo
 */
export const reloadConfig = (newConfig: Partial<LandingConfig>): void => {
  landingState.config = { ...landingState.config, ...newConfig };
  console.log("[Landing] Configuração recarregada:", landingState.config);
};

/**
 * Forçar refresh do tema
 */
export const refreshTheme = (): void => {
  const isDark = document.documentElement.classList.contains("dark");
  landingState.user.preferences = {
    ...landingState.user.preferences,
    theme: isDark ? "dark" : "light",
  };
};

/**
 * Obter item do carrinho pelo ID
 */
export const getCartItem = (productId: string) => {
  return landingState.cart.find((item) => item.productId === productId);
};

/**
 * Obter total de itens no carrinho
 */
export const getCartTotal = (): number => {
  return landingState.cart.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Obter valor total do carrinho
 */
export const getCartValue = (): number => {
  return landingState.cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Limpar carrinho
 */
export const clearCart = (): void => {
  landingState.cart = [];
  localStorage.removeItem("cart");
  console.log("[Landing] Carrinho limpo");
};

/**
 * Exportar estado para debug
 */
export const debugState = (): void => {
  console.table({
    "User Authenticated": landingState.user.isAuthenticated,
    "User Role": landingState.user.role,
    "Favorites Count": landingState.favorites.length,
    "Cart Items": landingState.cart.length,
    "Cart Total": getCartTotal(),
    "Cart Value": `R$ ${getCartValue().toFixed(2)}`,
    Theme: landingState.user.preferences?.theme,
  });
};

// Auto-inicializar quando o documento estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initLanding();
  });
} else {
  initLanding();
}

// Limpar ao descarregar
window.addEventListener("beforeunload", () => {
  cleanupLanding();
});

// Expor globalmente para debug
(window as any).__LandingDebug = {
  state: getLandingState,
  user: getUserContext,
  isAuth: isAuthenticated,
  debug: debugState,
  logEvent,
  addFav: addToFavorites,
  removeFav: removeFromFavorites,
};
