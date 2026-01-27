import { api } from "../../../shared/http/api.js";

export const RegisterPage = (): HTMLElement => {
  const div = document.createElement("div");
  div.style.maxWidth = "400px";
  div.style.margin = "2rem auto";
  div.className = "card fade-in";

  div.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 2rem; color: var(--primary);">Cadastro</h2>
        <form id="register-form">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome Completo</label>
                <input type="text" name="name" class="input-field" required>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
                <input type="email" name="email" class="input-field" required>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Senha</label>
                <input type="password" name="password" class="input-field" required minlength="6">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Telefone</label>
                <input type="text" name="phone" class="input-field">
            </div>
             <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Endereço</label>
                <textarea name="address" class="input-field" rows="2"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Cadastrar</button>
        </form>
        <p style="text-align: center; margin-top: 1rem; color: var(--text-muted);">
            Já tem uma conta? <a href="#" id="go-login" style="color: var(--primary); font-weight: 600;">Faça Login</a>
        </p>
        <div id="error-msg" style="color: var(--error); text-align: center; margin-top: 1rem; display: none;"></div>
    `;

  const form = div.querySelector("#register-form");
  const errorMsg = div.querySelector("#error-msg") as HTMLElement;

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await api.post<{ token: string; user: any }>(
          "/auth/register",
          data,
        );
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        alert("Cadastro realizado com sucesso!");
        window.navigate("/");
      } catch (error: any) {
        errorMsg.textContent = error.message;
        errorMsg.style.display = "block";
      }
    });
  }

  div.querySelector("#go-login")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.navigate("/login");
  });

  return div;
};
