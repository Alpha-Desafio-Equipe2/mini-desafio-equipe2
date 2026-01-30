import { api } from "../../../shared/http/api.js";
import { Order, Customer } from "../../../shared/types.js";
import { openOrderDetails } from "./OrderDetailsModal.js";

export async function createAdminOrders(container: HTMLElement) {
  container.innerHTML = "";
  const h3 = document.createElement("h3");
  h3.textContent = "Todos os Pedidos";
  container.appendChild(h3);

  const listDiv = document.createElement("div");
  listDiv.style.cssText =
    "display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;";
  container.appendChild(listDiv);

  try {
    const [orders, customers] = await Promise.all([
      api.get<Order[]>("/sales"),
      api.get<Customer[]>("/customers"),
    ]);
    const customerMap = new Map(customers.map((c) => [c.id, c.name]));

    orders.forEach((order) => {
      const card = document.createElement("div");
      card.style.cssText =
        "border: 1px solid var(--border); padding: 1rem; border-radius: var(--radius-sm);";

      const headerDiv = document.createElement("div");
      headerDiv.style.cssText =
        "display: flex; justify-content: space-between;";

      const title = document.createElement("strong");
      const customerName =
        customerMap.get(order.customer_id) || `ID ${order.customer_id}`;
      title.textContent = `Pedido #${order.id} - ${customerName}`;
      headerDiv.appendChild(title);
      card.appendChild(headerDiv);

      const totalP = document.createElement("p");
      totalP.style.cssText = "font-size: 0.9rem; color: var(--text-muted);";
      totalP.textContent = `Total: R$ ${order.total_value ? order.total_value.toFixed(2) : "0.00"}`;
      card.appendChild(totalP);

      const actionsDiv = document.createElement("div");
      actionsDiv.style.cssText =
        "display: flex; gap: 0.5rem; margin-top: 0.5rem;";

      const detailsBtn = document.createElement("button");
      detailsBtn.textContent = "Ver Detalhes";
      detailsBtn.className = "btn btn-primary";
      detailsBtn.style.fontSize = "0.8rem";
      detailsBtn.onclick = () =>
        openOrderDetails(order.id, () => createAdminOrders(container));
      actionsDiv.appendChild(detailsBtn);

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancelar/Excluir";
      cancelBtn.className = "btn btn-secondary";
      cancelBtn.style.cssText = "font-size: 0.8rem; color: var(--error);";
      cancelBtn.onclick = async () => {
        if (!confirm("Cancelar pedido?")) return;
        try {
          await api.post(`/sales/${order.id}/cancel`);
          createAdminOrders(container);
        } catch (err: any) {
          alert(err.message);
        }
      };
      actionsDiv.appendChild(cancelBtn);

      card.appendChild(actionsDiv);
      listDiv.appendChild(card);
    });
  } catch (err: any) {
    const errP = document.createElement("p");
    errP.style.color = "var(--error)";
    errP.textContent = `Erro: ${err.message}`;
    container.appendChild(errP);
  }
}
