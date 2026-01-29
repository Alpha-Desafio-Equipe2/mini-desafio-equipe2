import { api } from "../../../shared/http/api.js";
import { User, Order } from "../../../shared/types.js";

export const ProfilePage = async (): Promise<HTMLElement> => {
  const div = document.createElement("div");

  try {
    const user = await api.get<User>("/auth/profile");
    const orders = await api.get<Order[]>("/sales/myorders");

    div.innerHTML = `
            <div style="display: grid; gap: 2rem; grid-template-columns: 1fr 2fr;">
                <div class="card">
                    <h3 style="margin-bottom: 1rem; color: var(--primary);">Meu Perfil</h3>
                    <form id="profile-form">
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem;">Nome</label>
                            <input type="text" name="name" value="${user.name}" class="input-field">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem;">Telefone</label>
                            <input type="text" name="phone" value="${user.phone || ""}" class="input-field">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem;">Endereço</label>
                            <textarea name="address" class="input-field" rows="3">${user.address || ""}</textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                    </form>
                </div>

                <div>
                    <h3 style="margin-bottom: 1rem; color: var(--primary);">Meus Pedidos</h3>
                    ${
                      orders.length === 0
                        ? "<p>Nenhum pedido encontrado.</p>"
                        : `
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            ${orders
                              .map(
                                (order) => `
                                <div class="card">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                                        <strong>Pedido #${order.id}</strong>
                                         <!-- Status implicitly Active if listed here -->
                                    </div>
                                    <p style="color: var(--text-muted); font-size: 0.9rem;">Data: ${new Date(order.created_at).toLocaleString()}</p>
                                    <p style="color: var(--text-muted); font-size: 0.9rem;">Tipo: ${order.type === "delivery" ? "Entrega" : "Retirada"}</p>
                                    
                                    <div style="margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 1rem;">
                                        ${
                                          order.items
                                            ? order.items
                                                .map(
                                                  (item) => `
                                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                                                <span>Produto #${item.product_id} (x${item.quantity})</span>
                                                <span>R$ ${(item.price_at_time! * item.quantity).toFixed(2)}</span>
                                            </div>
                                        `,
                                                )
                                                .join("")
                                            : "<p>Itens não disponíveis</p>"
                                        }
                                    </div>
                                    
                                    <button class="btn btn-secondary" style="margin-top: 1rem; width: 100%; border-color: var(--error); color: var(--error);" 
                                            onclick="window.cancelOrder(${order.id})">
                                        Cancelar Pedido
                                    </button>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    `
                    }
                </div>
            </div>
        `;

    div
      .querySelector("#profile-form")
      ?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        try {
          await api.put("/auth/profile", data);
          alert("Perfil atualizado!");
        } catch (error) {
          alert("Erro ao atualizar perfil.");
        }
      });

    window.cancelOrder = async (id: number) => {
      if (!confirm("Tem certeza que deseja cancelar este pedido?")) return;
      try {
        await api.post(`/sales/${id}/cancel`, {});
        alert("Pedido cancelado.");
        window.location.reload();
      } catch (error: any) {
        alert("Erro ao cancelar pedido: " + error.message);
      }
    };
  } catch (error: any) {
    div.innerHTML = `<p style="color: var(--error);">Erro ao carregar perfil: ${error.message}</p>`;
    if (error.message.includes("token") || error.message.includes("401")) {
      window.navigate("/login");
    }
  }

  return div;
};
