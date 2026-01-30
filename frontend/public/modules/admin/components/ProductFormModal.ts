import { api } from "../../../shared/http/api.js";

export function createProductFormModal(onUpdate: () => void): HTMLElement {
  const prodFormModal = document.createElement("div");
  prodFormModal.id = "product-form-modal";
  prodFormModal.style.cssText =
    "display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;";

  const prodModalContent = document.createElement("div");
  prodModalContent.style.cssText =
    "background: var(--surface); margin: 10% auto; padding: 2rem; border-radius: var(--radius-md); width: 90%; max-width: 500px;";

  const prodH4 = document.createElement("h4");
  prodH4.id = "form-title";
  prodH4.textContent = "Adicionar Medicamento";
  prodH4.style.marginBottom = "1rem";
  prodModalContent.appendChild(prodH4);

  const prodForm = document.createElement("form");
  prodForm.id = "add-product-form";

  const hiddenId = document.createElement("input");
  hiddenId.type = "hidden";
  hiddenId.name = "id";
  hiddenId.id = "product-id";
  prodForm.appendChild(hiddenId);

  const gridDiv = document.createElement("div");
  gridDiv.style.cssText =
    "display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;";

  const createInput = (
    name: string,
    placeholder: string,
    type: string = "text",
    required: boolean = true,
  ) => {
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.id = `p-${name}`;
    input.placeholder = placeholder;
    input.className = "input-field";
    if (required) input.required = true;
    if (type === "number") input.min = "0";
    if (type === "number" && name === "price") input.step = "0.01";
    return input;
  };

  gridDiv.appendChild(createInput("name", "Nome Comercial"));
  gridDiv.appendChild(createInput("manufacturer", "Fabricante"));
  gridDiv.appendChild(createInput("active_principle", "Princípio Ativo"));
  gridDiv.appendChild(createInput("price", "Preço", "number"));
  gridDiv.appendChild(createInput("stock", "Estoque", "number"));

  const checkDiv = document.createElement("div");
  checkDiv.style.cssText = "display: flex; align-items: center; gap: 0.5rem;";
  const check = document.createElement("input");
  check.type = "checkbox";
  check.name = "requires_prescription";
  check.id = "p-prescription";
  const checkLabel = document.createElement("label");
  checkLabel.htmlFor = "p-prescription";
  checkLabel.textContent = "Requer Receita?";
  checkDiv.appendChild(check);
  checkDiv.appendChild(checkLabel);
  gridDiv.appendChild(checkDiv);

  prodForm.appendChild(gridDiv);

  const formActions = document.createElement("div");
  formActions.style.marginTop = "1rem";
  formActions.style.display = "flex";
  formActions.style.gap = "0.5rem";

  const saveBtn = document.createElement("button");
  saveBtn.type = "submit";
  saveBtn.className = "btn btn-primary";
  saveBtn.textContent = "Salvar";
  formActions.appendChild(saveBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn btn-secondary";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.onclick = () => (prodFormModal.style.display = "none");
  formActions.appendChild(cancelBtn);

  prodForm.appendChild(formActions);
  prodModalContent.appendChild(prodForm);
  prodFormModal.appendChild(prodModalContent);

  // Global Handlers attached to window are removed, logic is internal or exposed via exports if needed.
  // However, to keep compatibility with the way we invoke it, we might need to expose the open function.
  // For now, let's attach the submit handler.

  prodForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(prodForm);
    const rawData: any = Object.fromEntries(formData.entries());

    const requiresPrescriptionInput = document.getElementById(
      "p-prescription",
    ) as HTMLInputElement;
    const isChecked = requiresPrescriptionInput?.checked ?? false;

    const data = {
      id: rawData.id,
      name: rawData.name,
      manufacturer: rawData.manufacturer,
      active_principle: rawData.active_principle,
      price: parseFloat(rawData.price),
      stock: parseInt(rawData.stock),
      requires_prescription: isChecked,
    };

    const id = data.id;
    delete (data as any).id;

    try {
      if (id) {
        await api.put(`/medicines/${id}`, data);
        alert("Medicamento atualizado!");
      } else {
        await api.post("/medicines", data);
        alert("Medicamento criado!");
      }
      onUpdate(); // Refresh the list
      prodFormModal.style.display = "none";
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  return prodFormModal;
}

export function openProductForm(product?: any) {
  const modal = document.getElementById("product-form-modal");
  const title = document.getElementById("form-title");
  const form = document.getElementById("add-product-form") as HTMLFormElement;
  const hiddenId = document.getElementById("product-id") as HTMLInputElement;

  if (!modal || !title || !form || !hiddenId) return;

  modal.style.display = "block";

  if (product) {
    title.textContent = "Editar Medicamento";
    hiddenId.value = product.id.toString();
    (document.getElementById("p-name") as HTMLInputElement).value =
      product.name;
    (document.getElementById("p-manufacturer") as HTMLInputElement).value =
      product.manufacturer || "";
    (document.getElementById("p-active_principle") as HTMLInputElement).value =
      product.active_principle || "";
    (document.getElementById("p-price") as HTMLInputElement).value =
      product.price.toString();
    (document.getElementById("p-stock") as HTMLInputElement).value = (
      product.stock ?? product.quantity
    ).toString();
    (document.getElementById("p-prescription") as HTMLInputElement).checked =
      !!product.requires_prescription;
  } else {
    title.textContent = "Adicionar Medicamento";
    form.reset();
    hiddenId.value = "";
  }
}
