export type ErrorType = 'error' | 'warning' | 'info';

export interface ErrorModalData {
  title: string;
  message: string;
  type?: ErrorType;
  details?: string[];
}

export const ErrorModal = (data: ErrorModalData) => {
  const modal = document.createElement("div");
  modal.className = "error-modal-overlay";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  `;

  const type = data.type || 'error';
  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const colors = {
    error: {
      bg: '#fee',
      border: 'var(--error)',
      text: 'var(--error)'
    },
    warning: {
      bg: '#fff3cd',
      border: '#ff9800',
      text: '#856404'
    },
    info: {
      bg: '#e3f2fd',
      border: '#2196f3',
      text: '#0d47a1'
    }
  };

  const modalContent = document.createElement("div");
  modalContent.className = "error-modal-content";
  modalContent.style.cssText = `
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 2rem;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    animation: shake 0.4s ease;
  `;

  modalContent.innerHTML = `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      .error-modal-header {
        text-align: center;
        margin-bottom: 1.5rem;
      }
      .error-modal-icon {
        font-size: 3.5rem;
        margin-bottom: 1rem;
        animation: pulse 0.5s ease;
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      .error-modal-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: ${colors[type].text};
      }
      .error-modal-message {
        font-size: 1rem;
        color: var(--text);
        line-height: 1.6;
        margin-bottom: 1rem;
      }
      .error-modal-alert {
        background: ${colors[type].bg};
        border-left: 4px solid ${colors[type].border};
        padding: 1rem;
        border-radius: var(--radius-md);
        margin-bottom: 1.5rem;
      }
      .error-modal-details {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0 0 0;
      }
      .error-modal-details li {
        padding: 0.5rem 0;
        padding-left: 1.5rem;
        position: relative;
        color: ${colors[type].text};
        font-size: 0.875rem;
      }
      .error-modal-details li:before {
        content: "•";
        position: absolute;
        left: 0.5rem;
        font-weight: bold;
      }
      .error-modal-button {
        width: 100%;
        padding: 0.875rem;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all 0.2s ease;
        background: ${type === 'error' ? 'var(--error)' : type === 'warning' ? '#ff9800' : 'var(--primary)'};
        color: white;
      }
      .error-modal-button:hover {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .error-modal-button:active {
        transform: translateY(0);
      }
    </style>

    <div class="error-modal-header">
      <div class="error-modal-icon">${icons[type]}</div>
      <h2 class="error-modal-title">${data.title}</h2>
    </div>

    <div class="error-modal-alert">
      <div class="error-modal-message">${data.message}</div>
      ${data.details && data.details.length > 0 ? `
        <ul class="error-modal-details">
          ${data.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
      ` : ''}
    </div>

    <button id="close-error-btn" class="error-modal-button">
      Entendi
    </button>
  `;

  modal.appendChild(modalContent);

  // Close modal on button click
  const closeBtn = modalContent.querySelector("#close-error-btn");
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
