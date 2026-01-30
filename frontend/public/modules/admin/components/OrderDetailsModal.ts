import { api } from "../../../shared/http/api.js";
import { Order, Product } from "../../../shared/types.js";

export function createOrderDetailsModal(onUpdate: () => void): HTMLElement {
  const orderDetailsModal = document.createElement("div");
  orderDetailsModal.id = "order-details-modal";
  orderDetailsModal.style.cssText =
    "display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;";

  const orderModalContent = document.createElement("div");
  orderModalContent.style.cssText =
    "background: var(--surface); margin: 5% auto; padding: 2rem; border-radius: var(--radius-md); width: 80%; max-width: 600px; max-height: 80vh; overflow-y: auto;";

  const orderModalHeader = document.createElement("div");
  orderModalHeader.style.cssText =
    "display: flex; justify-content: space-between; margin-bottom: 1rem;";
  const orderH3 = document.createElement("h3");
  orderH3.textContent = "Detalhes do Pedido";
  const closeOrderBtn = document.createElement("button");
  closeOrderBtn.textContent = "X";
  closeOrderBtn.className = "btn btn-secondary";
  closeOrderBtn.onclick = () => (orderDetailsModal.style.display = "none");

  orderModalHeader.appendChild(orderH3);
  orderModalHeader.appendChild(closeOrderBtn);
  orderModalContent.appendChild(orderModalHeader);

  const orderDetailsDiv = document.createElement("div");
  orderDetailsDiv.id = "order-details-content";
  orderModalContent.appendChild(orderDetailsDiv);
  orderDetailsModal.appendChild(orderModalContent);

  // Attach to window for global access if needed, or we export a function verify
  // For now we will use a specific export function to open it.

  return orderDetailsModal;
}

export async function openOrderDetails(id: number, onUpdate: () => void) {
  const modal = document.getElementById("order-details-modal");
  const content = document.getElementById("order-details-content");
  if (!modal || !content) return;

  modal.style.display = "block";
  content.innerHTML = "Carregando...";

  try {
    const order = await api.get<Order>(`/sales/${id}`);

    let itemsList: HTMLElement;
    if (order.items && order.items.length > 0) {
      itemsList = document.createElement("table");
      itemsList.style.cssText =
        "width: 100%; border-collapse: collapse; margin-top: 1rem;";
      itemsList.innerHTML = `<thead><tr style="border-bottom: 1px solid var(--border);"><th style="text-align: left; padding: 5px;">Produto</th><th style="padding: 5px;">Qtd</th></tr></thead><tbody></tbody>`;
      const tbody = itemsList.querySelector("tbody")!;

      for (const item of order.items) {
        const prodId = item.product_id || item.medicine_id;
        let name = item.product_name;
        if (!name && prodId) {
          try {
            const p = await api.get<Product>(`/medicines/${prodId}`);
            name = p.name;
          } catch {
            name = "Produto não encontrado";
          }
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `<td style="padding: 5px;">${name || `ID ${prodId}`}</td><td style="padding: 5px;">${item.quantity}</td>`;
        tbody.appendChild(tr);
      }
    } else {
      itemsList = document.createElement("p");
      itemsList.textContent = "Sem itens.";
    }

    content.innerHTML = "";

    const createP = (label: string, value: string) => {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${label}:</strong> ${value}`;
      return p;
    };

    content.appendChild(createP("ID", `#${order.id}`));
    content.appendChild(createP("Cliente ID", order.customer_id.toString()));
    content.appendChild(createP("Status", order.status || "Pendente"));
    content.appendChild(
      createP("Data", new Date(order.created_at).toLocaleString()),
    );

    if (order.doctor_crm) {
      const prescDiv = document.createElement("div");
      prescDiv.style.cssText =
        "margin-top: 1rem; padding: 1rem; background: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px;";
      const h5 = document.createElement("h5");
      h5.style.marginBottom = "0.5rem";
      h5.textContent = "Dados da Receita";
      prescDiv.appendChild(h5);
      prescDiv.appendChild(createP("CRM", order.doctor_crm));
      prescDiv.appendChild(
        createP("Data Receita", order.prescription_date || "-"),
      );
      content.appendChild(prescDiv);
    }

    const h4Items = document.createElement("h4");
    h4Items.style.marginTop = "1rem";
    h4Items.textContent = "Itens";
    content.appendChild(h4Items);
    content.appendChild(itemsList);

    const footer = document.createElement("div");
    footer.style.cssText =
      "margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1rem; display: flex; justify-content: flex-end; gap: 1rem;";

    if (!order.status || order.status === "pending") {
      const confirmBtn = document.createElement("button");
      confirmBtn.className = "btn btn-primary";
      confirmBtn.textContent = "Confirmar Pedido";
      confirmBtn.onclick = async () => {
        if (!confirm("Confirmar este pedido?")) return;
        try {
          await api.patch(`/sales/${order.id}/confirm`, {});
          alert("Pedido confirmado!");
          modal.style.display = "none";
          onUpdate();
        } catch (err: any) {
          alert("Erro ao confirmar: " + err.message);
        }
      };
      footer.appendChild(confirmBtn);
    } else {
      const span = document.createElement("span");
      span.style.cssText = "color: var(--success); font-weight: bold;";
      span.textContent = "Pedido Confirmado";
      footer.appendChild(span);
    }

    const closeBtn = document.createElement("button");
    closeBtn.className = "btn btn-secondary";
    closeBtn.textContent = "Fechar";
    closeBtn.onclick = () => (modal.style.display = "none");
    footer.appendChild(closeBtn);

    content.appendChild(footer);
  } catch (err: any) {
    content.textContent = `Erro ao carregar detalhes: ${err.message}`;
  }
}
