export const OrderReceiptModal = (orderData: {
  total: number;
  newBalance: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  orderNumber: string;
  date: string;
}) => {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  `;

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modalContent.style.cssText = `
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease;
  `;

  // Styles
  const style = document.createElement("style");
  style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
  `;
  modal.appendChild(style);

  // Header
  const header = document.createElement("div");
  header.style.cssText =
    "text-align: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px dashed var(--border);";

  const icon = document.createElement("div");
  icon.textContent = "✅";
  icon.style.cssText = "font-size: 4rem; margin-bottom: 1rem;";
  header.appendChild(icon);

  const title = document.createElement("h2");
  title.textContent = "Pedido Confirmado!";
  title.style.cssText =
    "color: var(--success); font-size: 1.5rem; font-weight: 700; margin: 0;";
  header.appendChild(title);

  const sub1 = document.createElement("p");
  sub1.textContent = `Pedido #${orderData.orderNumber}`;
  sub1.style.cssText =
    "color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;";
  header.appendChild(sub1);

  const sub2 = document.createElement("p");
  sub2.textContent = orderData.date;
  sub2.style.cssText =
    "color: var(--text-muted); font-size: 0.875rem; margin-top: 0.5rem;";
  header.appendChild(sub2);

  modalContent.appendChild(header);

  // Items Section
  const itemsSection = document.createElement("div");
  itemsSection.style.marginBottom = "1.5rem";

  const itemsLabel = document.createElement("div");
  itemsLabel.textContent = "Itens do Pedido";
  itemsLabel.style.cssText =
    "font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; letter-spacing: 0.5px; margin-bottom: 0.5rem;";
  itemsSection.appendChild(itemsLabel);

  const itemsContainer = document.createElement("div");
  itemsContainer.style.cssText =
    "background: var(--background); border-radius: var(--radius-md); padding: 1rem; margin-top: 0.5rem;";

  orderData.items.forEach((item, index) => {
    const itemRow = document.createElement("div");
    itemRow.style.cssText =
      "display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border);";
    if (index === orderData.items.length - 1)
      itemRow.style.borderBottom = "none";

    const left = document.createElement("div");
    const name = document.createElement("div");
    name.textContent = item.name;
    name.style.fontWeight = "500";
    left.appendChild(name);

    const details = document.createElement("div");
    details.textContent = `${item.quantity}x R$ ${item.price.toFixed(2)}`;
    details.style.cssText = "color: var(--text-muted); font-size: 0.875rem;";
    left.appendChild(details);
    itemRow.appendChild(left);

    const right = document.createElement("div");
    right.textContent = `R$ ${(item.quantity * item.price).toFixed(2)}`;
    right.style.fontWeight = "600";
    itemRow.appendChild(right);

    itemsContainer.appendChild(itemRow);
  });
  itemsSection.appendChild(itemsContainer);
  modalContent.appendChild(itemsSection);

  // Total
  const totalDiv = document.createElement("div");
  totalDiv.style.cssText =
    "background: linear-gradient(135deg, var(--primary), var(--primary-dark, #0056b3)); color: white; padding: 1.5rem; border-radius: var(--radius-md); margin: 1.5rem 0; text-align: center;";

  const totalLabel = document.createElement("div");
  totalLabel.textContent = "Valor Total";
  totalLabel.style.cssText =
    "font-size: 0.875rem; opacity: 0.9; margin-bottom: 0.5rem;";
  totalDiv.appendChild(totalLabel);

  const totalValue = document.createElement("div");
  totalValue.textContent = `R$ ${orderData.total.toFixed(2)}`;
  totalValue.style.cssText = "font-size: 2rem; font-weight: 700;";
  totalDiv.appendChild(totalValue);

  modalContent.appendChild(totalDiv);

  // Balance
  const balanceDiv = document.createElement("div");
  balanceDiv.style.cssText =
    "background: var(--background); padding: 1rem; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;";

  const balanceLabel = document.createElement("span");
  balanceLabel.textContent = "Novo Saldo";
  balanceLabel.style.cssText = "color: var(--text-muted); font-size: 0.875rem;";
  balanceDiv.appendChild(balanceLabel);

  const balanceValue = document.createElement("span");
  balanceValue.textContent = `R$ ${orderData.newBalance.toFixed(2)}`;
  balanceValue.style.cssText =
    "color: var(--success); font-size: 1.25rem; font-weight: 700;";
  balanceDiv.appendChild(balanceValue);

  modalContent.appendChild(balanceDiv);

  // Close Button
  const closeBtn = document.createElement("button");
  closeBtn.id = "close-receipt-btn";
  closeBtn.className = "btn btn-primary";
  closeBtn.textContent = "Ir para Meu Perfil";
  closeBtn.style.cssText = "width: 100%; padding: 1rem; font-size: 1rem;";
  modalContent.appendChild(closeBtn);

  modal.appendChild(modalContent);

  // Logic
  const closeModal = () => {
    modal.style.animation = "fadeOut 0.3s ease";
    setTimeout(() => {
      modal.remove();
      if (window.navigate) window.navigate("/profile");
    }, 300);
  };

  closeBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  return modal;
};
