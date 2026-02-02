import { User } from "../types.js";

export const Navbar = (): HTMLElement => {
  const nav = document.createElement("nav");
  nav.className = "navbar";

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user: User = userStr ? JSON.parse(userStr) : ({} as User);
  const isLoggedIn = !!token;

  console.log("Navbar Render - User:", user); // DEBUG
  const isAdmin = user.role?.toLowerCase() === "admin";

  nav.innerHTML = `
        <div class="container nav-content">
            <a href="/server07/" style="text-decoration: none;" class="logo">FarmaPro</a>
            <div class="nav-links">
                <a href="#" onclick="window.navigate('/server07/'); return false;" class="nav-link">Home</a>
                ${
                  isLoggedIn
                    ? `
                    <a href="#" onclick="window.navigate('/server07/cart'); return false;" class="nav-link">Carrinho</a>
                    <a href="#" onclick="window.navigate('/server07/profile'); return false;" class="nav-link">Perfil</a>
                    ${isAdmin ? `<a href="#" onclick="window.navigate('/server07/customers'); return false;" class="nav-link">Clientes</a>` : ""}
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

  const navLinks = nav.querySelector(".nav-links");
  const links = nav.querySelectorAll(".nav-link");


  const logoutBtn = nav.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.navigate) {
        window.navigate("/server07/");
      } else {
        window.location.reload();
      }
    });
  }

  return nav;
};
