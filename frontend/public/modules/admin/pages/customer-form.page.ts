import { CustomerService } from "../services/customer.service.js";

export const CustomerFormPage = async (id?: string): Promise<HTMLElement> => {
  const isEdit = !!id;
  const div = document.createElement("div");
  div.className = "container fade-in";
  div.style.maxWidth = "600px";

  div.innerHTML = `
        <h2 style="color: var(--primary); margin-bottom: 2rem;">${isEdit ? "Editar Cliente" : "Novo Cliente"}</h2>
        
        <form id="customer-form" class="card">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome</label>
                <input type="text" name="name" id="name" class="input-field" required>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">CPF</label>
                <input type="text" name="cpf" id="cpf" class="input-field" required placeholder="000.000.000-00">
            </div>

            <div style="display: flex; gap: 1rem;">
                <button type="submit" class="btn btn-primary" id="save-btn">Salvar</button>
                <button type="button" class="btn btn-secondary" onclick="window.navigate('/customers')">Cancelar</button>
            </div>
        </form>
    `;

  const form = div.querySelector("#customer-form") as HTMLFormElement;
  const nameInput = div.querySelector("#name") as HTMLInputElement;
  const cpfInput = div.querySelector("#cpf") as HTMLInputElement;

  if (isEdit && id) {
    try {
      const customer = await CustomerService.getById(parseInt(id));
      nameInput.value = customer.name;
      cpfInput.value = customer.cpf;
    } catch (error) {
      alert("Erro ao carregar dados do cliente.");
      window.navigate("/customers");
    }
  }

  // CPF Mask
  cpfInput.addEventListener("input", (e) => {
    let value = cpfInput.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    cpfInput.value = value;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const saveBtn = div.querySelector("#save-btn") as HTMLButtonElement;
    saveBtn.disabled = true;
    saveBtn.textContent = "Salvando...";

    const data = {
      name: nameInput.value,
      cpf: cpfInput.value,
    };

    try {
      if (isEdit && id) {
        await CustomerService.update(parseInt(id), data);
        alert("Cliente atualizado com sucesso!");
      } else {
        await CustomerService.create(data);
        alert("Cliente criado com sucesso!");
      }
      window.navigate("/customers");
    } catch (error: any) {
      alert("Erro ao salvar: " + (error.message || error));
      saveBtn.disabled = false;
      saveBtn.textContent = "Salvar";
    }
  });

  return div;
};
