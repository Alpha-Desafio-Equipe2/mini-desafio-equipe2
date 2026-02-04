import { User } from "../types.js";
import { CartService } from "../../modules/venda/services/cart.service.js";

export const Navbar = (): HTMLElement => {
  const nav = document.createElement("nav");
  nav.className = "navbar";

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user: User = userStr ? JSON.parse(userStr) : ({} as User);
  const isLoggedIn = !!token;

  console.log("Navbar Render - User:", user); 
  const isAdmin = user.role === "ADMIN";

  const getCartCount = () => {
      const items = CartService.getCart();
      return items.reduce((acc, item) => acc + item.quantity, 0);
  };

  nav.innerHTML = `
        <div class="container nav-content">
            <a href="/server07/" style="text-decoration: none;" class="logo">FarmaPROX</a>
            <div class="nav-links">
                <a href="#" onclick="window.navigate('/server07/'); return false;" class="nav-link">Home</a>
                ${
                  isLoggedIn
                    ? `
                    <a href="#" onclick="window.navigate('/server07/cart'); return false;" class="nav-link" style="display: flex; align-items: center; gap: 5px;">
                        <span class="material-symbols-outlined" style="font-size: 1.2rem;">shopping_cart</span>
                        <span id="nav-cart-count" style="background: var(--primary); color: white; border-radius: 50%; padding: 2px 6px; font-size: 0.7rem; font-weight: bold; ${getCartCount() > 0 ? '' : 'display: none;'}">${getCartCount()}</span>
                    </a>
                    <a href="#" onclick="window.navigate('/server07/profile'); return false;" class="nav-link">Perfil</a>
                    ${isAdmin ? `<a href="#" onclick="window.navigate('/server07/admin'); window.switchTab('users'); return false;" class="nav-link">Clientes</a>` : ""}
                    ${isAdmin ? `<a href="#" onclick="window.navigate('/server07/admin'); return false;" class="nav-link">Admin</a>` : ""}
                    <a href="#" id="logout-btn" class="nav-link">Sair</a>
                `
                    : `
                    <a href="#" onclick="window.navigate('/server07/login'); return false;" class="nav-link">Entrar</a>
                `
                }
            </div>
        </div>
    `;

  const updateCount = () => {
      const countEl = nav.querySelector("#nav-cart-count");
      if(countEl) {
          const count = getCartCount();
          countEl.textContent = count.toString();
          (countEl as HTMLElement).style.display = count > 0 ? "inline-block" : "none";
      }
  };

  window.addEventListener("cart-updated", updateCount);

  // Clean up listener if element is removed? 
  // In a real framework, yes. Here, simple app, maybe okay. 
  // Or attach a mutation observer/disconnect logic if sophisticated.

  const logoutBtn = nav.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if ((window as any).navigate) {
        (window as any).navigate("/server07/");
      } else {
        window.location.reload();
      }
    });
  }

  return nav;
};
