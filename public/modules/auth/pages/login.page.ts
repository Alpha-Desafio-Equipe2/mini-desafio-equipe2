import { AuthService } from "../services/auth.service.js";

export const LoginPage = (): HTMLElement => {
  const div = document.createElement("div");
  div.style.maxWidth = "400px";
  div.style.margin = "2rem auto";
  div.className = "card fade-in";

  div.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 2rem; color: var(--primary);">Login</h2>
        <form id="login-form">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
                <input type="email" name="email" class="input-field" required>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Senha</label>
                <input type="password" name="password" class="input-field" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Entrar</button>
        </form>
        <p style="text-align: center; margin-top: 1rem; color: var(--text-muted);">
            Não tem uma conta? <a href="#" id="go-register" style="color: var(--primary); font-weight: 600;">Cadastre-se</a>
        </p>
        <div id="error-msg" style="color: var(--error); text-align: center; margin-top: 1rem; display: none;"></div>
    `;

  const form = div.querySelector("#login-form");
  const errorMsg = div.querySelector("#error-msg") as HTMLElement;

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());

      try {
        await AuthService.login(data.email as string, data.password as string);
        window.navigate("/");
      } catch (error: any) {
        errorMsg.textContent = error.message;
        errorMsg.style.display = "block";
      }
    });
  }

  div.querySelector("#go-register")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.navigate("/register");
  });

  return div;
};
