import { CartService } from "../../modules/venda/services/cart.service.js";
import { Product } from "../types.js";

export const ProductCard = (product: Product): HTMLElement => {
  const card = document.createElement("div");
  card.className = "card";

  // Image
  const img = document.createElement("img");
  img.src = product.image_url || "https://placehold.co/300x200?text=Produto";
  img.alt = product.name;
  img.style.cssText =
    "width:100%; height:200px; object-fit:cover; border-radius: var(--radius-sm); margin-bottom: 1rem;";
  card.appendChild(img);

  // Title
  const title = document.createElement("h3");
  title.style.marginBottom = "0.5rem";
  title.textContent = product.name;
  card.appendChild(title);

  // Description
  const desc = document.createElement("p");
  desc.style.cssText =
    "color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.4; height: 40px; overflow: hidden;";
  desc.textContent = product.description || "Sem descrição";
  card.appendChild(desc);

  // Price & Status Row
  const priceRow = document.createElement("div");
  priceRow.style.cssText =
    "display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;";

  const price = document.createElement("span");
  price.style.cssText =
    "font-weight: 700; color: var(--primary); font-size: 1.2rem;";
  price.textContent = `R$ ${product.price.toFixed(2)}`;
  priceRow.appendChild(price);

  const statusDiv = document.createElement("div");
  statusDiv.style.textAlign = "right";

  const statusText = document.createElement("span");
  const isAvailable = product.quantity > 0;
  statusText.style.cssText = `font-size: 0.8rem; color: ${isAvailable ? "var(--success)" : "var(--error)"}; display: block;`;
  statusText.textContent = isAvailable ? "Disponível" : "Esgotado";
  statusDiv.appendChild(statusText);

  if (product.requires_prescription) {
    const badge = document.createElement("span");
    badge.style.cssText =
      "font-size: 0.7rem; color: var(--error); font-weight: bold; border: 1px solid var(--error); padding: 2px 4px; border-radius: 4px; margin-top: 4px; display: inline-block;";
    badge.textContent = "Receita Obrigatória";
    statusDiv.appendChild(badge);
  }

  priceRow.appendChild(statusDiv);
  card.appendChild(priceRow);

  // Actions Row
  const actionsRow = document.createElement("div");
  actionsRow.style.cssText = "display: flex; gap: 10px; margin-top: auto;";

  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.id = `qty-${product.id}`;
  qtyInput.value = "1";
  qtyInput.min = "1";
  qtyInput.max = product.quantity.toString();
  qtyInput.style.cssText =
    "width: 60px; padding: 5px; border-radius: var(--radius-sm); border: 1px solid var(--border);";
  if (!isAvailable) qtyInput.disabled = true;
  actionsRow.appendChild(qtyInput);

  const addBtn = document.createElement("button");
  addBtn.className = "btn btn-primary";
  addBtn.style.flex = "1";
  addBtn.id = `add-btn-${product.id}`;
  addBtn.textContent = "Adicionar";
  if (!isAvailable) {
    addBtn.disabled = true;
    addBtn.style.opacity = "0.5";
    addBtn.style.cursor = "not-allowed";
  }
  actionsRow.appendChild(addBtn);
  card.appendChild(actionsRow);

  // Toast
  const toast = document.createElement("div");
  toast.id = `toast-${product.id}`;
  toast.style.cssText =
    "font-size: 0.8rem; color: var(--success); text-align: center; margin-top: 5px; opacity: 0; transition: opacity 0.3s;";
  toast.textContent = "Produto adicionado!";
  card.appendChild(toast);

  // Add Button Logic
  addBtn.onclick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Faça login para comprar.");
      if (window.navigate) window.navigate("/login");
      return;
    }

    const qty = parseInt(qtyInput.value) || 1;

    if (qty <= 0 || qty > product.quantity) {
      alert("Quantidade inválida.");
      return;
    }

    const addToCartAction = () => {
      CartService.addToCart(product, qty);
      toast.style.opacity = "1";
      setTimeout(() => {
        toast.style.opacity = "0";
      }, 2000);
    };

    if (product.requires_prescription) {
      showPrescriptionModal(product, addToCartAction);
    } else {
      addToCartAction();
    }
  };

  return card;
};

// Helper for Prescription Modal (also DOM-based now)
function showPrescriptionModal(product: Product, onConfirm: () => void) {
  const modalId = `modal-presc-${product.id}`;
  const existing = document.getElementById(modalId);
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = modalId;
  overlay.style.cssText =
    "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center;";

  const modalContent = document.createElement("div");
  modalContent.style.cssText =
    "background: var(--surface); padding: 2rem; border-radius: var(--radius-md); width: 90%; max-width: 400px; box-shadow: var(--shadow-lg);";

  const title = document.createElement("h3");
  title.style.cssText = "margin-bottom: 1rem; color: var(--error);";
  title.textContent = "Medicamento Controlado";
  modalContent.appendChild(title);

  const msg = document.createElement("p");
  msg.style.cssText = "margin-bottom: 1.5rem; color: var(--text-muted);";
  msg.textContent = "Por favor, informe os dados da receita para continuar.";
  modalContent.appendChild(msg);

  // CRM Input
  const crmGroup = document.createElement("div");
  crmGroup.style.marginBottom = "1rem";
  const crmLabel = document.createElement("label");
  crmLabel.style.cssText = "display: block; margin-bottom: 0.5rem;";
  crmLabel.textContent = "CRM do Médico";
  const crmInput = document.createElement("input");
  crmInput.type = "text";
  crmInput.className = "input-field";
  crmInput.placeholder = "Ex: 12345/SP";
  crmGroup.appendChild(crmLabel);
  crmGroup.appendChild(crmInput);
  modalContent.appendChild(crmGroup);

  // Date Input
  const dateGroup = document.createElement("div");
  dateGroup.style.marginBottom = "1.5rem";
  const dateLabel = document.createElement("label");
  dateLabel.style.cssText = "display: block; margin-bottom: 0.5rem;";
  dateLabel.textContent = "Data da Receita";
  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.className = "input-field";
  dateGroup.appendChild(dateLabel);
  dateGroup.appendChild(dateInput);
  modalContent.appendChild(dateGroup);

  // Buttons
  const btnGroup = document.createElement("div");
  btnGroup.style.cssText = "display: flex; gap: 1rem;";

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "btn btn-primary";
  confirmBtn.style.flex = "1";
  confirmBtn.textContent = "Confirmar";
  confirmBtn.onclick = () => {
    const crm = crmInput.value;
    const date = dateInput.value;

    if (!crm || !date) {
      alert("Preencha todos os campos.");
      return;
    }

    const storedPrescription = CartService.getPrescriptionData();
    if (
      storedPrescription &&
      (storedPrescription.crm !== crm || storedPrescription.date !== date)
    ) {
      if (
        !confirm(
          "Você já informou uma receita diferente para outro item. Deseja usar esta nova receita para TODO o pedido?",
        )
      ) {
        return;
      }
    }

    CartService.setPrescriptionData({ crm, date });
    onConfirm();
    overlay.remove();
  };

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "btn btn-secondary";
  cancelBtn.style.flex = "1";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.onclick = () => overlay.remove();

  btnGroup.appendChild(confirmBtn);
  btnGroup.appendChild(cancelBtn);
  modalContent.appendChild(btnGroup);

  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);
}
