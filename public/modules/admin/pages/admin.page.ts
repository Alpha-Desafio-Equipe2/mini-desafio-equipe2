import { api } from "../../../shared/http/api.js";
import { Product, User, Order } from "../../../shared/types.js";

export const AdminPage = async (): Promise<HTMLElement> => {
  const div = document.createElement("div");

  const userStr = localStorage.getItem("user");
  const user: User = userStr ? JSON.parse(userStr) : ({} as User);

  if (user.role !== "admin") {
    div.innerHTML = '<p style="color: var(--error);">Acesso negado.</p>';
    return div;
  }

  div.innerHTML = `
        <h2 style="margin-bottom: 2rem; color: var(--primary);">Painel Administrativo</h2>
        
        <div style="margin-bottom: 2rem;">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <button class="btn btn-primary" onclick="window.switchTab('products')">Produtos</button>
                <button class="btn btn-secondary" onclick="window.switchTab('orders')">Pedidos</button>
                <button class="btn btn-secondary" onclick="window.switchTab('users')">Usuários</button>
            </div>
            
            <div id="admin-content" class="card">
                <!-- Content injected here -->
            </div>
        </div>
    `;

  const contentDiv = div.querySelector("#admin-content") as HTMLElement;

  const renderProducts = async () => {
    try {
      const products = await api.get<Product[]>("/products");
      contentDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>Gerenciar Produtos</h3>
                    <button class="btn btn-primary" onclick="window.showProductForm()">Novo Produto</button>
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid var(--border);">
                            <th style="padding: 10px;">ID</th>
                            <th style="padding: 10px;">Nome</th>
                            <th style="padding: 10px;">Preço</th>
                            <th style="padding: 10px;">Estoque</th>
                            <th style="padding: 10px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products
                          .map(
                            (p) => `
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 10px;">${p.id}</td>
                                <td style="padding: 10px;">${p.name}</td>
                                <td style="padding: 10px;">R$ ${p.price.toFixed(2)}</td>
                                <td style="padding: 10px;">${p.quantity}</td>
                                <td style="padding: 10px;">
                                    <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px;" onclick="window.deleteProduct(${p.id})">Excluir</button>
                                </td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
                
                <div id="product-form-modal" style="display: none; margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1rem;">
                    <h4>Adicionar Produto</h4>
                    <form id="add-product-form">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <input type="text" name="name" placeholder="Nome" class="input-field" required>
                            <input type="number" name="price" placeholder="Preço" step="0.01" class="input-field" required>
                            <input type="number" name="quantity" placeholder="Quantidade" class="input-field" required>
                            <input type="text" name="image_url" placeholder="URL da Imagem" class="input-field">
                        </div>
                        <textarea name="description" placeholder="Descrição" class="input-field" style="margin-top: 1rem; width: 100%;"></textarea>
                        <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">Salvar</button>
                        <button type="button" class="btn btn-secondary" onclick="document.getElementById('product-form-modal').style.display='none'">Cancelar</button>
                    </form>
                </div>
            `;

      const form = contentDiv.querySelector("#add-product-form");
      if (form) {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const data: any = Object.fromEntries(formData.entries());
          data.price = parseFloat(data.price);
          data.quantity = parseInt(data.quantity);

          try {
            await api.post("/products", data);
            alert("Produto criado!");
            renderProducts();
          } catch (err: any) {
            alert(err.message);
          }
        });
      }
    } catch (err: any) {
      contentDiv.innerHTML = `<p style="color: var(--error);">Erro: ${err.message}</p>`;
    }
  };

  const renderOrders = async () => {
    try {
      const orders = await api.get<Order[]>("/orders");
      contentDiv.innerHTML = `
                 <h3>Todos os Pedidos</h3>
                 <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                    ${orders
                      .map(
                        (order) => `
                        <div style="border: 1px solid var(--border); padding: 1rem; border-radius: var(--radius-sm);">
                            <div style="display: flex; justify-content: space-between;">
                                <strong>Pedido #${order.id} (User: ${order.user_id})</strong>
                                <span>${order.status}</span>
                            </div>
                            <p style="font-size: 0.9rem; color: var(--text-muted);">Total Itens: ${order.items ? order.items.length : 0}</p>
                            ${
                              order.status !== "cancelled"
                                ? `
                                <button class="btn btn-secondary" style="margin-top: 0.5rem; color: var(--error);" onclick="window.adminCancelOrder(${order.id})">Cancelar</button>
                            `
                                : ""
                            }
                        </div>
                    `,
                      )
                      .join("")}
                 </div>
            `;
    } catch (err: any) {
      contentDiv.innerHTML = `<p style="color: var(--error);">Erro: ${err.message}</p>`;
    }
  };

  const renderUsers = async () => {
    try {
      const users = await api.get<User[]>("/auth/users");
      contentDiv.innerHTML = `
                <h3>Usuários</h3>
                 <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid var(--border);">
                            <th style="padding: 10px;">ID</th>
                            <th style="padding: 10px;">Nome</th>
                            <th style="padding: 10px;">Email</th>
                            <th style="padding: 10px;">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users
                          .map(
                            (u) => `
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 10px;">${u.id}</td>
                                <td style="padding: 10px;">${u.name}</td>
                                <td style="padding: 10px;">${u.email}</td>
                                <td style="padding: 10px;">${u.role}</td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            `;
    } catch (err: any) {
      contentDiv.innerHTML = `<p style="color: var(--error);">Erro: ${err.message}</p>`;
    }
  };

  // Helpers globais para o HTML injetado
  window.switchTab = (tab: string) => {
    if (tab === "products") renderProducts();
    if (tab === "orders") renderOrders();
    if (tab === "users") renderUsers();
  };

  window.showProductForm = () => {
    const modal = document.getElementById("product-form-modal");
    if (modal) modal.style.display = "block";
  };

  window.deleteProduct = async (id: number) => {
    if (!confirm("Excluir produto?")) return;
    try {
      await api.delete(`/products/${id}`);
      renderProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  window.adminCancelOrder = async (id: number) => {
    if (!confirm("Cancelar pedido?")) return;
    try {
      await api.post(`/orders/${id}/cancel`);
      renderOrders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Render inicial
  renderProducts();

  return div;
};
