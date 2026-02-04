import { Navbar } from "../shared/components/navbar.js";

// Definição de rotas com Lazy Loading (opcional) ou import direto
import { ProductsPage } from "../modules/medicamento/pages/products.page.js";
import { LandingPage } from "../modules/landing/pages/landing.page.js";
import { LoginPage } from "../modules/auth/pages/login.page.js";
import { RegisterPage } from "../modules/auth/pages/register.page.js";
import { AdminPage } from "../modules/admin/pages/admin.v2.page.js";
import { CartPage } from "../modules/venda/pages/cart.page.js";
import { ProfilePage } from "../modules/auth/pages/profile.page.js";


export const routes: Record<string, () => Promise<HTMLElement> | HTMLElement> =
  {
    "/server07/landing": LandingPage,
    "/server07/": LandingPage,
    "/server07/products": ProductsPage,
    "/server07/login": LoginPage,
    "/server07/register": RegisterPage,
    "/server07/admin": AdminPage,
    "/server07/cart": CartPage,
    "/server07/profile": ProfilePage,

  };

export class App {
  appElement: HTMLElement;
  currentPath: string;

  constructor() {
    this.appElement = document.getElementById("app") as HTMLElement;
    // Use pathname + search to preserve query parameters on initial load
    this.currentPath = window.location.pathname + window.location.search;

    window.addEventListener("popstate", () => {
      this.currentPath = window.location.pathname;
      this.render();
    });

    document.addEventListener("navigate", (e: any) => {
      const { path } = e.detail;
      this.navigateTo(path);
    });
  }

  navigateTo(path: string) {
    window.history.pushState({}, "", path);
    this.currentPath = path;
    this.render();
  }

  async render() {
    this.appElement.innerHTML = "";
    this.appElement.appendChild(Navbar());

    // Extract base path without query parameters for routing
    let pathOnly = this.currentPath.split("?")[0];
    
    // Normalize path by removing trailing slash (unless it's just the root or subpath root)
    if (pathOnly.length > 1 && pathOnly.endsWith("/") && pathOnly !== "/server07/") {
      pathOnly = pathOnly.slice(0, -1);
    }
    
    let PageComponent = routes[pathOnly];
    let pageArgs: any[] = [];
    
    console.log("[Router] Current Path:", this.currentPath);
    console.log("[Router] Path Only (Normalized):", pathOnly);
    console.log("[Router] Found Component:", PageComponent !== undefined ? "Yes" : "No");

    // Simple Dynamic Route Matching
    if (!PageComponent) {
      if (pathOnly === "/server07/" || pathOnly === "/server07") {
        const params = new URLSearchParams(window.location.search);
        if (params.has("search")) {
          console.log("[Router] Search detected on landing, redirecting to products");
          this.navigateTo("/server07/products" + window.location.search);
          return;
        }
        PageComponent = LandingPage;
      } else {
        console.warn("[Router] No route found for:", pathOnly, "- Falling back to LandingPage");
        // Fallback to landing page for unmatched routes
        PageComponent = LandingPage;
      }
    } else if (PageComponent === LandingPage) {
        // Even if route matches landing exactly, check for search
        const params = new URLSearchParams(window.location.search);
        if (params.has("search")) {
          console.log("[Router] Search detected on landing route, redirecting to products");
          this.navigateTo("/server07/products" + window.location.search);
          return;
        }
    }

    const pageContent = await (PageComponent as any)(...pageArgs);

    const main = document.createElement("main");
    main.className = "container fade-in";
    main.style.marginTop = "2rem";
    main.appendChild(pageContent);

    this.appElement.appendChild(main);
  }
}
