import { User } from "../../../shared/types.js";
import { createAdminProducts } from "../components/AdminProducts.js";
import { createAdminOrders } from "../components/AdminOrders.js";
import { createAdminCustomers } from "../components/AdminCustomers.js";
import { createAdminUsers } from "../components/AdminUsers.js";
import { createProductFormModal } from "../components/ProductFormModal.js";
import { createOrderDetailsModal } from "../components/OrderDetailsModal.js";

export const AdminPage = async (): Promise<HTMLElement> => {
  const container = document.createElement("div");

  const userStr = localStorage.getItem("user");
  const user: User = userStr ? JSON.parse(userStr) : ({} as User);

  if (user.role !== "admin") {
    const denied = document.createElement("p");
    denied.style.color = "var(--error)";
    denied.textContent = "Acesso negado.";
    container.appendChild(denied);
    return container;
  }

  // Header
  const h2 = document.createElement("h2");
  h2.textContent = "Painel Administrativo";
  h2.style.cssText = "margin-bottom: 2rem; color: var(--primary);";
  container.appendChild(h2);

  // Layout
  const wrapper = document.createElement("div");
  wrapper.style.marginBottom = "2rem";

  // Tab Buttons
  const btnGroup = document.createElement("div");
  btnGroup.style.cssText = "display: flex; gap: 1rem; margin-bottom: 1rem;";

  const createTabBtn = (
    text: string,
    tabName: string,
    onClick: (name: string) => void,
  ) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className = "btn btn-secondary";
    btn.id = `tab-btn-${tabName}`;
    btn.onclick = () => {
      // Reset styles
      Array.from(btnGroup.children).forEach(
        (c: any) => (c.className = "btn btn-secondary"),
      );
      btn.className = "btn btn-primary";
      onClick(tabName);
    };
    return btn;
  };

  const contentDiv = document.createElement("div");
  contentDiv.id = "admin-content";
  contentDiv.className = "card";

  let currentTab = "products";

  const renderCurrentTab = () => {
    if (currentTab === "products") createAdminProducts(contentDiv);
    if (currentTab === "orders") createAdminOrders(contentDiv);
    if (currentTab === "customers") createAdminCustomers(contentDiv);
    if (currentTab === "users") createAdminUsers(contentDiv);
  };

  const switchTab = (tab: string) => {
    currentTab = tab;
    renderCurrentTab();
  };

  btnGroup.appendChild(createTabBtn("Produtos", "products", switchTab));
  btnGroup.appendChild(createTabBtn("Pedidos", "orders", switchTab));
  btnGroup.appendChild(createTabBtn("Clientes", "customers", switchTab));
  btnGroup.appendChild(createTabBtn("Usuários", "users", switchTab));

  // Set initial active button
  (btnGroup.querySelector("#tab-btn-products") as HTMLElement).className =
    "btn btn-primary";

  wrapper.appendChild(btnGroup);
  wrapper.appendChild(contentDiv);
  container.appendChild(wrapper);

  // Modals
  // We pass renderCurrentTab as the callback for updates (e.g. after product save or order confirm)
  const productModal = createProductFormModal(renderCurrentTab);
  const orderModal = createOrderDetailsModal(renderCurrentTab);

  container.appendChild(productModal);
  container.appendChild(orderModal);

  // Initial Render
  renderCurrentTab();

  return container;
};
