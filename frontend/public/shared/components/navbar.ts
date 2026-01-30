import { User } from "../types.js";

export const Navbar = (): HTMLElement => {
  const nav = document.createElement("nav");
  nav.className = "navbar";

  const container = document.createElement("div");
  container.className = "container nav-content";
  nav.appendChild(container);

  // Logo
  const logo = document.createElement("a");
  logo.href = "#";
  logo.className = "logo";
  logo.textContent = "FarmaPro";
  logo.onclick = (e) => {
    e.preventDefault();
    if (window.navigate) window.navigate("/");
  };
  container.appendChild(logo);

  // Links Container
  const linksDiv = document.createElement("div");
  linksDiv.className = "nav-links";
  container.appendChild(linksDiv);

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user: User = userStr ? JSON.parse(userStr) : ({} as User);
  const isLoggedIn = !!token;
  const isAdmin = user.role?.toLowerCase() === "admin";

  // Helper to create links
  const createNavLink = (text: string, path: string) => {
    const a = document.createElement("a");
    a.href = "#";
    a.className = "nav-link";
    a.textContent = text;
    a.onclick = (e) => {
      e.preventDefault();
      if (window.navigate) window.navigate(path);
    };
    return a;
  };

  // Home Link
  linksDiv.appendChild(createNavLink("Home", "/"));

  if (isLoggedIn) {
    linksDiv.appendChild(createNavLink("Carrinho", "/cart"));
    linksDiv.appendChild(createNavLink("Perfil", "/profile"));

    if (isAdmin) {
      linksDiv.appendChild(createNavLink("Clientes", "/customers"));
      linksDiv.appendChild(createNavLink("Admin", "/admin"));
    }

    const logoutBtn = document.createElement("a");
    logoutBtn.href = "#";
    logoutBtn.className = "nav-link";
    logoutBtn.textContent = "Sair";
    logoutBtn.id = "logout-btn";
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.navigate) {
        window.navigate("/");
      } else {
        window.location.reload();
      }
    };
    linksDiv.appendChild(logoutBtn);
  } else {
    linksDiv.appendChild(createNavLink("Entrar", "/login"));
  }

  return nav;
};
