import { AuthService } from "../services/auth.service.js";

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
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">CPF</label>
                <input type="text" name="cpf" class="input-field" required placeholder="000.000.000-00">
            </div>
            <!-- Backend ignores phone and address for now, simplifying form -->
            <!-- 
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Telefone</label>
                <input type="text" name="phone" class="input-field">
            </div>
             <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Endereço</label>
                <textarea name="address" class="input-field" rows="2"></textarea>
            </div> 
            -->
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
      const data: any = Object.fromEntries(formData.entries());

      // Fix for backend "SQLite3 can only bind..." error
      // The backend likely expects phone/address fields to exist, even if empty.
      // Since we removed them from the form, we explicitly send empty strings.
      if (!data.phone) data.phone = "";
      if (!data.address) data.address = "";

      try {
        await AuthService.register(data);
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

  const cpfInput = div.querySelector('input[name="cpf"]') as HTMLInputElement;
  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      let value = cpfInput.value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 9) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4");
      } else if (value.length > 6) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3}).*/, "$1.$2.$3");
      } else if (value.length > 3) {
        value = value.replace(/^(\d{3})(\d{3}).*/, "$1.$2");
      }

      cpfInput.value = value;
    });
  }

  return div;
};
