export const createCartSummary = (
  total: number,
  balance: number,
  isAdminOrAttendant: boolean,
): HTMLElement => {
  const container = document.createElement("div");
  container.style.cssText = "margin-top: 1.5rem; text-align: right;";

  const totalValDiv = document.createElement("div");
  totalValDiv.textContent = `Total: R$ ${total.toFixed(2)}`;
  totalValDiv.style.cssText =
    "font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;";
  container.appendChild(totalValDiv);

  if (!isAdminOrAttendant) {
    if (balance < total) {
      const warningDiv = document.createElement("div");
      warningDiv.style.cssText =
        "background: #fee; color: var(--error); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.875rem; margin-top: 1rem; border-left: 4px solid var(--error);";
      warningDiv.textContent = `⚠️ Saldo insuficiente! Adicione R$ ${(
        total - balance
      ).toFixed(2)} para completar o pedido.`;
      container.appendChild(warningDiv);
    } else {
      const successDiv = document.createElement("div");
      successDiv.style.cssText =
        "background: #efe; color: var(--success); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.875rem; margin-top: 1rem; border-left: 4px solid var(--success);";
      successDiv.textContent =
        "✅ Saldo suficiente! Você pode finalizar o pedido.";
      container.appendChild(successDiv);
    }
  }

  return container;
};
