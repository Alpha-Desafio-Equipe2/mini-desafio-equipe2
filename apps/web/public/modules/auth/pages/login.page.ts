import { AuthService } from "../services/auth.service.js";

export const LoginPage = (): HTMLElement => {
  const container = document.createElement("div");
  container.className = "container";
  container.style.cssText = "display: flex; justify-content: center; align-items: center; min-height: 80vh;";

  const card = document.createElement("div");
  card.className = "card fade-in";
  card.style.maxWidth = "400px";
  card.style.width = "100%";

  card.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem;">Bem-vindo</h2>
            <p style="color: var(--text-muted);">Faça login para acessar sua conta</p>
        </div>

        <form id="login-form" style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">Email</label>
                <input type="email" name="email" class="input-field" placeholder="seu@email.com" required>
            </div>
            <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">Senha</label>
                <input type="password" name="password" class="input-field" placeholder="••••••••" required>
            </div>
            
            <button type="submit" class="btn btn-primary" style="margin-top: 1rem; padding: 1rem; font-size: 1rem;">
                Entrar
            </button>
        </form>

        <div style="margin-top: 2rem; text-align: center; border-top: 1px solid var(--border); padding-top: 1.5rem;">
            <p style="color: var(--text-muted); font-size: 0.9rem;">
                Não tem uma conta? 
                <a href="#" id="go-register" style="color: var(--primary); font-weight: 700; text-decoration: none;">Criar conta</a>
            </p>
        </div>
        
        <div id="error-msg" style="
            background: #fee2e2; 
            color: #ef4444; 
            padding: 1rem; 
            border-radius: var(--radius-sm); 
            margin-top: 1.5rem; 
            display: none; 
            font-size: 0.9rem;
            text-align: center;
            border: 1px solid #fecaca;
        "></div>
    `;

  const form = card.querySelector("#login-form");
  const errorMsg = card.querySelector("#error-msg") as HTMLElement;

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type='submit']") as HTMLButtonElement;
      
      // Loading state
      const originalText = btn.textContent;
      btn.textContent = "Autenticando...";
      btn.disabled = true;
      btn.style.opacity = "0.7";
      errorMsg.style.display = "none";

      const formData = new FormData(form as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());

      try {
        await AuthService.login(data.email as string, data.password as string);
        window.navigate("/server07/");
      } catch (error: any) {
        errorMsg.textContent = error.message;
        errorMsg.style.display = "block";
        // Reset button
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = "1";
      }
    });
  }

  card.querySelector("#go-register")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.navigate("/server07/register");
  });

  container.appendChild(card);
  return container;
};
