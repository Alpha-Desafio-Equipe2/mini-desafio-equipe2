export interface SuccessModalData {
  title: string;
  message: string;
  details?: string[];
  icon?: string;
}

export const SuccessModal = (data: SuccessModalData) => {
  const modal = document.createElement("div");
  modal.className = "success-modal-overlay";
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
    z-index: 1001;
    animation: fadeIn 0.2s ease;
  `;

  const modalContent = document.createElement("div");
  modalContent.className = "success-modal-content";
  modalContent.style.cssText = `
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    animation: bounceIn 0.5s ease;
  `;

  const icon = data.icon || '✅';

  modalContent.innerHTML = `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      .success-modal-header {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .success-modal-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: successPulse 0.6s ease;
      }
      @keyframes successPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
      .success-modal-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--success);
      }
      .success-modal-message {
        font-size: 1rem;
        color: var(--text);
        line-height: 1.6;
        text-align: center;
        margin-bottom: 1rem;
      }
      .success-modal-box {
        background: linear-gradient(135deg, #d4edda, #c3e6cb);
        border-left: 4px solid var(--success);
        padding: 1.5rem;
        border-radius: var(--radius-md);
        margin-bottom: 1.5rem;
      }
      .success-modal-details {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0 0 0;
      }
      .success-modal-details li {
        padding: 0.5rem 0;
        text-align: center;
        color: #155724;
        font-size: 1rem;
        font-weight: 600;
      }
      .success-modal-button {
        width: 100%;
        padding: 0.875rem;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--success);
        color: white;
      }
      .success-modal-button:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
      }
      .success-modal-button:active {
        transform: translateY(0);
      }
    </style>

    <div class="success-modal-header">
      <div class="success-modal-icon">${icon}</div>
      <h2 class="success-modal-title">${data.title}</h2>
    </div>

    <div class="success-modal-box">
      <div class="success-modal-message">${data.message}</div>
      ${data.details && data.details.length > 0 ? `
        <ul class="success-modal-details">
          ${data.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      ` : ''}
    </div>

    <button id="close-success-btn" class="success-modal-button">
      OK
    </button>
  `;

  modal.appendChild(modalContent);

  // Close modal on button click
  const closeBtn = modalContent.querySelector("#close-success-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.animation = "fadeOut 0.2s ease";
      setTimeout(() => modal.remove(), 200);
    });
  }

  // Close modal on overlay click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.animation = "fadeOut 0.2s ease";
      setTimeout(() => modal.remove(), 200);
    }
  });

  // Close on Escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal.style.animation = "fadeOut 0.2s ease";
      setTimeout(() => {
        modal.remove();
        document.removeEventListener('keydown', handleEscape);
      }, 200);
    }
  };
  document.addEventListener('keydown', handleEscape);

  return modal;
};
