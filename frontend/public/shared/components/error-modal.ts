export type ErrorType = "error" | "warning" | "info";

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

  const type = data.type || "error";
  const icons = {
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const colors = {
    error: {
      bg: "#fee",
      border: "var(--error)",
      text: "var(--error)",
    },
    warning: {
      bg: "#fff3cd",
      border: "#ff9800",
      text: "#856404",
    },
    info: {
      bg: "#e3f2fd",
      border: "#2196f3",
      text: "#0d47a1",
    },
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

  // Inject Styles
  const style = document.createElement("style");
  style.textContent = `
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
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
  `;
  modal.appendChild(style);

  // Header
  const header = document.createElement("div");
  header.style.textAlign = "center";
  header.style.marginBottom = "1.5rem";

  const iconDiv = document.createElement("div");
  iconDiv.style.cssText =
    "font-size: 3.5rem; margin-bottom: 1rem; animation: pulse 0.5s ease;";
  iconDiv.textContent = icons[type];
  header.appendChild(iconDiv);

  const title = document.createElement("h2");
  title.style.cssText = `font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem 0; color: ${colors[type].text};`;
  title.textContent = data.title;
  header.appendChild(title);

  modalContent.appendChild(header);

  // Alert Box
  const alertBox = document.createElement("div");
  alertBox.style.cssText = `
    background: ${colors[type].bg};
    border-left: 4px solid ${colors[type].border};
    padding: 1rem;
    border-radius: var(--radius-md);
    margin-bottom: 1.5rem;
  `;

  const message = document.createElement("div");
  message.style.cssText =
    "font-size: 1rem; color: var(--text); line-height: 1.6; margin-bottom: 1rem;";
  message.textContent = data.message;
  alertBox.appendChild(message);

  if (data.details && data.details.length > 0) {
    const ul = document.createElement("ul");
    ul.style.cssText = "list-style: none; padding: 0; margin: 0.5rem 0 0 0;";

    data.details.forEach((detail) => {
      const li = document.createElement("li");
      li.style.cssText = `
            padding: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
            color: ${colors[type].text};
            font-size: 0.875rem;
          `;

      const bullet = document.createElement("span");
      bullet.textContent = "•";
      bullet.style.cssText =
        "position: absolute; left: 0.5rem; font-weight: bold;";
      li.appendChild(bullet);
      li.appendChild(document.createTextNode(detail));
      ul.appendChild(li);
    });
    alertBox.appendChild(ul);
  }
  modalContent.appendChild(alertBox);

  // Button
  const button = document.createElement("button");
  button.id = "close-error-btn";
  const btnColor =
    type === "error"
      ? "var(--error)"
      : type === "warning"
        ? "#ff9800"
        : "var(--primary)";
  button.style.cssText = `
    width: 100%;
    padding: 0.875rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    background: ${btnColor};
    color: white;
  `;
  button.textContent = "Entendi";

  // Hover effects via JS since we don't have CSS classes easily
  button.onmouseenter = () => {
    button.style.opacity = "0.9";
    button.style.transform = "translateY(-1px)";
    button.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
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
