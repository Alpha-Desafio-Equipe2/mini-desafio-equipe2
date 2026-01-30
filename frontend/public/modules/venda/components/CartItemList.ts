import { CartService } from "../services/cart.service.js";

export const createCartItemList = (
  cart: any[],
  onDelete: () => void,
): HTMLElement => {
  const container = document.createElement("div");
  container.style.cssText =
    "background: var(--surface); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--shadow-sm);";

  cart.forEach((item) => {
    const itemRow = document.createElement("div");
    itemRow.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding: 1rem 0;";

    // Left Info
    const infoDiv = document.createElement("div");
    const nameH4 = document.createElement("h4");
    nameH4.textContent = item.product.name;
    nameH4.style.marginBottom = "0.5rem";
    infoDiv.appendChild(nameH4);

    const priceP = document.createElement("p");
    priceP.textContent = `R$ ${item.product.price.toFixed(2)} x ${item.quantity}`;
    priceP.style.color = "var(--text-muted)";
    infoDiv.appendChild(priceP);

    if (item.product.requires_prescription) {
      const reqSpan = document.createElement("span");
      reqSpan.textContent = "*Requer Receita";
      reqSpan.style.cssText = "color: var(--error); font-size: 0.8rem;";
      infoDiv.appendChild(reqSpan);
    }
    itemRow.appendChild(infoDiv);

    // Right Actions
    const actionsDiv = document.createElement("div");
    actionsDiv.style.cssText = "display: flex; gap: 10px; align-items: center;";

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.max = item.product.quantity.toString();
    qtyInput.value = item.quantity.toString();
    qtyInput.style.cssText =
      "width: 60px; padding: 5px; border-radius: var(--radius-sm); border: 1px solid var(--border);";
    qtyInput.onchange = (e) => {
      const val = (e.target as HTMLInputElement).value;
      CartService.updateQuantity(item.product.id, parseInt(val));
      onDelete(); // Triggers re-render
    };
    actionsDiv.appendChild(qtyInput);

    const maxLabel = document.createElement("span");
    maxLabel.textContent = `(Max: ${item.product.quantity})`;
    maxLabel.style.cssText = "font-size: 0.8rem; color: #777;";
    actionsDiv.appendChild(maxLabel);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.className = "btn btn-secondary";
    removeBtn.style.cssText =
      "color: var(--error); border-color: var(--error);";
    removeBtn.onclick = () => {
      CartService.removeFromCart(item.product.id);
      onDelete();
    };
    actionsDiv.appendChild(removeBtn);

    itemRow.appendChild(actionsDiv);
    container.appendChild(itemRow);
  });

  return container;
};
