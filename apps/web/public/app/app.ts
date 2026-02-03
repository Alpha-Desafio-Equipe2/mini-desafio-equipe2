import { Navbar } from "../shared/components/navbar.js";

// Definição de rotas com Lazy Loading (opcional) ou import direto
import { HomePage } from "../modules/medicamento/pages/home.page.js";
import { LoginPage } from "../modules/auth/pages/login.page.js";
import { RegisterPage } from "../modules/auth/pages/register.page.js";
import { AdminPage } from "../modules/admin/pages/admin.v2.page.js";
import { CartPage } from "../modules/venda/pages/cart.page.js";
import { ProfilePage } from "../modules/auth/pages/profile.page.js";
import { CustomerListPage } from "../modules/admin/pages/customer-list.page.js";
import { CustomerFormPage } from "../modules/admin/pages/customer-form.page.js";

export const routes: Record<string, () => Promise<HTMLElement> | HTMLElement> =
  {
    "/server07/": HomePage,
    "/server07/login": LoginPage,
    "/server07/register": RegisterPage,
    "/server07/admin": AdminPage,
    "/server07/cart": CartPage,
    "/server07/profile": ProfilePage,
    "/server07/customers": CustomerListPage,
    "/server07/customers/new": () => CustomerFormPage(),
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

    let PageComponent = routes[this.currentPath];
    let pageArgs: any[] = [];

    // Simple Dynamic Route Matching
    if (!PageComponent) {
      if (this.currentPath.startsWith("/server07/customers/edit/")) {
        const id = this.currentPath.split("/").pop();
        PageComponent = CustomerFormPage as any;
        pageArgs = [id];
      } else if (this.currentPath === "/server07/" || this.currentPath === "/server07") {
        PageComponent = HomePage;
      } else {
        // Simple fallback
        PageComponent = HomePage;
        // Optional: Update URL to canonical home if completely unmatched?
        // window.history.replaceState({}, "", "/server07/"); 
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
