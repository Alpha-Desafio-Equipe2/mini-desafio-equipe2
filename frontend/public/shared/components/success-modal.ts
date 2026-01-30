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

  const iconChar = data.icon || "✅";

  // Styles
  const style = document.createElement("style");
  style.textContent = `
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
      @keyframes successPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
  `;
  modal.appendChild(style);

  // Header
  const header = document.createElement("div");
  header.style.cssText = "text-align: center; margin-bottom: 1.5rem;";

  const iconDiv = document.createElement("div");
  iconDiv.style.cssText =
    "font-size: 4rem; margin-bottom: 1rem; animation: successPulse 0.6s ease;";
  iconDiv.textContent = iconChar;
  header.appendChild(iconDiv);

  const title = document.createElement("h2");
  title.style.cssText =
    "font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem 0; color: var(--success);";
  title.textContent = data.title;
  header.appendChild(title);

  modalContent.appendChild(header);

  // Content Box
  const box = document.createElement("div");
  box.style.cssText = `
    background: linear-gradient(135deg, #d4edda, #c3e6cb);
    border-left: 4px solid var(--success);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    margin-bottom: 1.5rem;
  `;

  const message = document.createElement("div");
  message.style.cssText =
    "font-size: 1rem; color: var(--text); line-height: 1.6; text-align: center; margin-bottom: 1rem;";
  message.textContent = data.message;
  box.appendChild(message);

  if (data.details && data.details.length > 0) {
    const ul = document.createElement("ul");
    ul.style.cssText = "list-style: none; padding: 0; margin: 0.5rem 0 0 0;";
    data.details.forEach((detail) => {
      const li = document.createElement("li");
      li.style.cssText =
        "padding: 0.5rem 0; text-align: center; color: #155724; font-size: 1rem; font-weight: 600;";
      li.textContent = detail;
      ul.appendChild(li);
    });
    box.appendChild(ul);
  }
  modalContent.appendChild(box);

  // Button
  const button = document.createElement("button");
  button.id = "close-success-btn";
  button.style.cssText = `
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
  `;
  button.textContent = "OK";
  button.onmouseenter = () => {
    button.style.opacity = "0.9";
    button.style.transform = "translateY(-1px)";
    button.style.boxShadow = "0 4px 12px rgba(40, 167, 69, 0.3)";
  };
  button.onmouseleave = () => {
    button.style.opacity = "1";
    button.style.transform = "translateY(0)";
    button.style.boxShadow = "none";
  };

  modalContent.appendChild(button);
  modal.appendChild(modalContent);

  // Close Logic
  const closeModal = () => {
    modal.style.animation = "fadeOut 0.2s ease";
    setTimeout(() => modal.remove(), 200);
  };

  button.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);

  return modal;
};
