import { Navbar } from "../shared/components/navbar.js";

// Definição de rotas com Lazy Loading (opcional) ou import direto
import { HomePage } from "../modules/medicamento/pages/home.page.js";
import { LoginPage } from "../modules/auth/pages/login.page.js";
import { RegisterPage } from "../modules/auth/pages/register.page.js";
import { AdminPage } from "../modules/admin/pages/admin.page.js";
import { CartPage } from "../modules/venda/pages/cart.page.js";
import { ProfilePage } from "../modules/auth/pages/profile.page.js";

export const routes: Record<string, () => Promise<HTMLElement> | HTMLElement> =
  {
    "/": HomePage,
    "/login": LoginPage,
    "/register": RegisterPage,
    "/admin": AdminPage,
    "/cart": CartPage,
    "/profile": ProfilePage,
  };

export class App {
  appElement: HTMLElement;
  currentPath: string;

  constructor() {
    this.appElement = document.getElementById("app") as HTMLElement;
    this.currentPath = window.location.pathname;

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

    // Simple Router
    const PageComponent = routes[this.currentPath] || routes["/"];
    const pageContent = await PageComponent();

    const main = document.createElement("main");
    main.className = "container fade-in";
    main.style.marginTop = "2rem";
    main.appendChild(pageContent);

    this.appElement.appendChild(main);
  }
}
