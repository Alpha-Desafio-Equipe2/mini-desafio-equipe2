import { login, logout as authLogout } from "../services/authservice.js";
import { renderizarMedicamentos } from "../../medicamento/pages/list.page.js";
// We need to trigger dashboard update or initial load
// import { atualizarDashboard } from "../../app/main.js";

export function realizarLogin(e: Event) {
  e.preventDefault();
  const email = (
    document.querySelector('input[type="email"]') as HTMLInputElement
  ).value;
  const pass = (
    document.querySelector('input[type="password"]') as HTMLInputElement
  ).value;

  if (login(email, pass)) {
    const loginScreen = document.getElementById("login-screen");
    const appLayout = document.getElementById("app-layout");

    if (loginScreen) loginScreen.classList.add("hidden");
    if (appLayout) appLayout.classList.remove("hidden");

    renderizarMedicamentos();

    // Call global dashboard update if exposed
    if ((window as any).atualizarDashboard) {
      (window as any).atualizarDashboard();
    }
  } else {
    alert("Login inválido");
  }
}

export function logout() {
  authLogout();
}
