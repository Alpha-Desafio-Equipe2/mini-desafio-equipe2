import { CartService } from "../services/cart.service.js";
import { SaleService } from "../services/sale.service.js";
import { BalanceService } from "../services/balance.service.js";
import { AddBalanceModal } from "../components/add-balance-modal.js";
import { createCartItemList } from "../components/CartItemList.js";
import { createCartSummary } from "../components/CartSummary.js";
import { createCheckoutForm } from "../components/CheckoutForm.js";

export const CartPage = (): HTMLElement => {
  const container = document.createElement("div");

  // State for Admin POS
  let allCustomers: any[] = [];
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdminOrAttendant =
    user &&
    (user.role === "admin" ||
      user.role === "manager" ||
      user.role === "attendant");

  const render = () => {
    container.innerHTML = ""; // Clear for re-render

    const cart = CartService.getCart();
    const hasPrescriptionItems = cart.some(
      (item) => item.product.requires_prescription,
    );
    const total = CartService.getTotal();
    const balance = BalanceService.getBalance();

    // 1. Header & Balance
    const headerRow = document.createElement("div");
    headerRow.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;";

    const h2 = document.createElement("h2");
    h2.textContent = "🛒 Carrinho";
    h2.style.cssText = "color: var(--primary); margin: 0;";
    headerRow.appendChild(h2);

    const balanceDiv = document.createElement("div");
    balanceDiv.style.cssText =
      "display: flex; align-items: center; gap: 1rem; background: var(--surface); padding: 1rem 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);";

    const balanceTextDiv = document.createElement("div");
    balanceTextDiv.style.textAlign = "right";
    const balanceLabel = document.createElement("p");
    balanceLabel.textContent = "Saldo Disponível";
    balanceLabel.style.cssText =
      "margin: 0; font-size: 0.875rem; color: var(--text-muted);";
    balanceTextDiv.appendChild(balanceLabel);
    const balanceValue = document.createElement("p");
    balanceValue.textContent = `R$ ${balance.toFixed(2)}`;
    balanceValue.style.cssText =
      "margin: 0; font-size: 1.5rem; font-weight: 700; color: var(--success);";
    balanceTextDiv.appendChild(balanceValue);
    balanceDiv.appendChild(balanceTextDiv);

    const addBalanceBtn = document.createElement("button");
    addBalanceBtn.textContent = "➕ Adicionar";
    addBalanceBtn.className = "btn btn-primary";
    addBalanceBtn.style.cssText = "padding: 0.5rem 1rem;";
    addBalanceBtn.onclick = () => {
      const modal = AddBalanceModal(() => render());
      document.body.appendChild(modal);
    };
    balanceDiv.appendChild(addBalanceBtn);

    headerRow.appendChild(balanceDiv);
    container.appendChild(headerRow);

    // 2. Cart Items
    if (cart.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "Seu carrinho está vazio.";
      container.appendChild(emptyMsg);
    } else {
      // 2.1 List
      const cartList = createCartItemList(cart, () => render());

      // 2.2 Summary inside the list container logic (or separate)
      // The original code had summary inside "cartContainer".
      // We can append summary to list or container.
      // Let's keep it simple: List -> Summary -> Form

      const summary = createCartSummary(total, balance, isAdminOrAttendant);

      cartList.appendChild(summary); // Append summary to the list container for visual grouping if desired, or just simple flow
      container.appendChild(cartList);

      // 3. Checkout Form
      const checkoutForm = createCheckoutForm(
        isAdminOrAttendant,
        user,
        allCustomers,
        hasPrescriptionItems,
        () => render(), // On success callback
      );
      container.appendChild(checkoutForm);
    }
  };

  // Init Data (only if admin)
  if (isAdminOrAttendant) {
    SaleService.getCustomers().then((customers) => {
      allCustomers = customers;
      render();
    });
  } else {
    render();
  }

  return container;
};
