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

  modalContent.innerHTML = `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .receipt-header {
        text-align: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px dashed var(--border);
      }
      .receipt-success-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      .receipt-title {
        color: var(--success);
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
      }
      .receipt-subtitle {
        color: var(--text-muted);
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }
      .receipt-section {
        margin-bottom: 1.5rem;
      }
      .receipt-label {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--text-muted);
        font-weight: 600;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
      }
      .receipt-value {
        font-size: 1rem;
        color: var(--text);
      }
      .receipt-items {
        background: var(--background);
        border-radius: var(--radius-md);
        padding: 1rem;
        margin-top: 0.5rem;
      }
      .receipt-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border);
      }
      .receipt-item:last-child {
        border-bottom: none;
      }
      .receipt-item-name {
        font-weight: 500;
      }
      .receipt-item-details {
        color: var(--text-muted);
        font-size: 0.875rem;
      }
      .receipt-total {
        background: linear-gradient(135deg, var(--primary), var(--primary-dark, #0056b3));
        color: white;
        padding: 1.5rem;
        border-radius: var(--radius-md);
        margin: 1.5rem 0;
        text-align: center;
      }
      .receipt-total-label {
        font-size: 0.875rem;
        opacity: 0.9;
        margin-bottom: 0.5rem;
      }
      .receipt-total-value {
        font-size: 2rem;
        font-weight: 700;
      }
      .receipt-balance {
        background: var(--background);
        padding: 1rem;
        border-radius: var(--radius-md);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      .receipt-balance-label {
        color: var(--text-muted);
        font-size: 0.875rem;
      }
      .receipt-balance-value {
        color: var(--success);
        font-size: 1.25rem;
        font-weight: 700;
      }
    </style>

    <div class="receipt-header">
      <div class="receipt-success-icon">✅</div>
      <h2 class="receipt-title">Pedido Confirmado!</h2>
      <p class="receipt-subtitle">Pedido #${orderData.orderNumber}</p>
      <p class="receipt-subtitle">${orderData.date}</p>
    </div>

    <div class="receipt-section">
      <div class="receipt-label">Itens do Pedido</div>
      <div class="receipt-items">
        ${orderData.items
          .map(
            (item) => `
          <div class="receipt-item">
            <div>
              <div class="receipt-item-name">${item.name}</div>
              <div class="receipt-item-details">${item.quantity}x R$ ${item.price.toFixed(2)}</div>
            </div>
            <div style="font-weight: 600;">
              R$ ${(item.quantity * item.price).toFixed(2)}
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <div class="receipt-total">
      <div class="receipt-total-label">Valor Total</div>
      <div class="receipt-total-value">R$ ${orderData.total.toFixed(2)}</div>
    </div>

    <div class="receipt-balance">
      <span class="receipt-balance-label">Novo Saldo</span>
      <span class="receipt-balance-value">R$ ${orderData.newBalance.toFixed(2)}</span>
    </div>

    <button id="close-receipt-btn" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1rem;">
      Ir para Meu Perfil
    </button>
  `;

  modal.appendChild(modalContent);

  // Close modal on button click
  const closeBtn = modalContent.querySelector("#close-receipt-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.animation = "fadeOut 0.3s ease";
      setTimeout(() => {
        modal.remove();
        window.navigate("/server07/profile");
      }, 300);
    });
  }

  // Close modal on overlay click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.animation = "fadeOut 0.3s ease";
      setTimeout(() => {
        modal.remove();
        window.navigate("/server07/profile");
      }, 300);
    }
  });

  // Add fadeOut animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  return modal;
};
