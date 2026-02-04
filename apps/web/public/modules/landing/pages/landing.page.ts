import { HeroSection } from "../components/hero-section.js";
import { LandingHeader } from "../components/landing-header.js";
import { CategoryGrid } from "../components/category-grid.js";
import { ProductsShowcase } from "../components/products-showcase-v2.js";
import { AppPromotion } from "../components/app-promotion.js";
import { Footer } from "../components/footer.js";
import { setupThemeToggle } from "../components/theme-toggle.js";
import { initLanding, logEvent } from "../init.js";

export const LandingPage = async (): Promise<HTMLElement> => {
  const container = document.createElement("div");
  container.className = "landing-page";

  // Inicializar módulo landing
  await initLanding({
    showHero: true,
    showCategories: true,
    showProducts: true,
    showPromo: true,
    showFooter: true,
  });

  // Registrar visualização
  logEvent("landing_page_view", {
    timestamp: new Date().toISOString(),
  });

  // Extrair categoria da URL
  const params = new URLSearchParams(window.location.search);
  const selectedCategory = params.get("category") || undefined;

  // Adicionar todos os componentes
  container.appendChild(HeroSection());
  container.appendChild(LandingHeader());
  container.appendChild(CategoryGrid());
  const productsShowcase = await ProductsShowcase(selectedCategory);
  container.appendChild(productsShowcase);
  container.appendChild(AppPromotion());
  container.appendChild(Footer());

  // Setup tema após renderização
  setTimeout(() => {
    setupThemeToggle();
  }, 0);

  return container;
};
