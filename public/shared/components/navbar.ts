import { User } from "../types.js";

export const Navbar = (): HTMLElement => {
  const nav = document.createElement("nav");
  nav.className = "navbar";

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user: User = userStr ? JSON.parse(userStr) : ({} as User);
  const isLoggedIn = !!token;
  const isAdmin = user.role === "admin";

  nav.innerHTML = `
        <div class="container nav-content">
            <a href="#" onclick="window.navigate('/'); return false;" class="logo">FarmaPro</a>
            <div class="nav-links">
                <a href="#" onclick="window.navigate('/'); return false;" class="nav-link">Home</a>
                ${
                  isLoggedIn
                    ? `
                    <a href="#" onclick="window.navigate('/cart'); return false;" class="nav-link">Carrinho</a>
                    <a href="#" onclick="window.navigate('/profile'); return false;" class="nav-link">Perfil</a>
                    ${isAdmin ? `<a href="#" onclick="window.navigate('/admin'); return false;" class="nav-link">Admin</a>` : ""}
                    <a href="#" id="logout-btn" class="nav-link">Sair</a>
                `
                    : `
                    <a href="#" onclick="window.navigate('/login'); return false;" class="nav-link">Entrar</a>
                `
                }
            </div>
        </div>
    `;

  const logoutBtn = nav.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.navigate) {
        window.navigate("/");
      } else {
        window.location.reload();
      }
    });
  }

  return nav;
};
