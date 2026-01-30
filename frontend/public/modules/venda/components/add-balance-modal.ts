import { BalanceService } from "../services/balance.service.js";
import { SuccessModal } from "../../../shared/components/success-modal.js";
import { ErrorModal } from "../../../shared/components/error-modal.js";

/**
 * Modal para adicionar saldo à conta do usuário
 */
export const AddBalanceModal = (onBalanceAdded: () => void): HTMLElement => {
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "balance-modal-overlay";
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    background: var(--surface);
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    max-width: 400px;
    width: 90%;
    animation: slideIn 0.3s ease-out;
  `;

  // Styles
  const style = document.createElement("style");
  style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
  `;
  modal.appendChild(style);

  // Title
  const title = document.createElement("h3");
  title.style.cssText = "margin-bottom: 1.5rem; color: var(--primary);";
  title.textContent = "💰 Adicionar Saldo";
  modal.appendChild(title);

  // Form
  const form = document.createElement("form");
  form.id = "add-balance-form";

  // Amount Input
  const amountConfig = document.createElement("div");
  amountConfig.style.marginBottom = "1.5rem";

  const label = document.createElement("label");
  label.style.cssText =
    "display: block; margin-bottom: 0.5rem; font-weight: 500;";
  label.textContent = "Valor (R$)";
  amountConfig.appendChild(label);

  const input = document.createElement("input");
  input.type = "number";
  input.id = "balance-amount";
  input.name = "amount";
  input.min = "1";
  input.step = "0.01";
  input.required = true;
  input.placeholder = "Digite o valor";
  input.className = "input-field";
  input.style.cssText =
    "width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 1rem;";
  input.autofocus = true;
  amountConfig.appendChild(input);

  form.appendChild(amountConfig);

  // Buttons
  const btnGroup = document.createElement("div");
  btnGroup.style.cssText = "display: flex; gap: 1rem;";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "btn btn-primary";
  submitBtn.style.cssText = "flex: 1; padding: 0.75rem;";
  submitBtn.textContent = "Adicionar";
  btnGroup.appendChild(submitBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.id = "cancel-btn";
  cancelBtn.className = "btn btn-secondary";
  cancelBtn.style.cssText = "flex: 1; padding: 0.75rem;";
  cancelBtn.textContent = "Cancelar";
  btnGroup.appendChild(cancelBtn);

  form.appendChild(btnGroup);
  modal.appendChild(form);

  // Tip
  const tip = document.createElement("div");
  tip.style.cssText =
    "margin-top: 1rem; padding: 1rem; background: var(--background); border-radius: var(--radius-md); border-left: 4px solid var(--primary);";

  const tipP = document.createElement("p");
  tipP.style.cssText =
    "font-size: 0.875rem; color: var(--text-muted); margin: 0;";
  tipP.innerHTML =
    "💡 <strong>Dica:</strong> Você pode adicionar qualquer valor acima de R$ 1,00";
  tip.appendChild(tipP);
  modal.appendChild(tip);

  modalOverlay.appendChild(modal);

  // Logic
  const closeModal = () => {
    modalOverlay.remove();
  };

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  cancelBtn.addEventListener("click", closeModal);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const amount = parseFloat(formData.get("amount") as string);

    if (amount > 0) {
      const newBalance = BalanceService.addBalance(amount);
      closeModal();

      const successModal = SuccessModal({
        title: "Saldo Adicionado!",
        message: "Seu saldo foi atualizado com sucesso.",
        icon: "💰",
        details: [`Novo saldo: R$ ${newBalance.toFixed(2)}`],
      });
      document.body.appendChild(successModal);

      onBalanceAdded();
    } else {
      const errorModal = ErrorModal({
        title: "Valor Inválido",
        message: "Por favor, insira um valor válido maior que zero.",
        type: "warning",
      });
      document.body.appendChild(errorModal);
    }
  });

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);

  return modalOverlay;
};
