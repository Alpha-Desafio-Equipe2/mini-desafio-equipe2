import { api } from "../../../shared/http/api.js";
import { Product, User, Order, Customer } from "../../../shared/types.js";

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
                <button class="btn btn-secondary" onclick="window.switchTab('customers')">Clientes</button>
                <button class="btn btn-secondary" onclick="window.switchTab('users')">Usuários</button>
            </div>
            
            <div id="admin-content" class="card">
                <!-- Content injected here -->
            </div>
            
            <div id="order-details-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
                <div style="background: var(--surface); margin: 5% auto; padding: 2rem; border-radius: var(--radius-md); width: 80%; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                        <h3>Detalhes do Pedido</h3>
                        <button class="btn btn-secondary" onclick="document.getElementById('order-details-modal').style.display='none'">X</button>
                    </div>
                    <div id="order-details-content">Loading...</div>
                </div>
            </div>
        </div>
    `;

  const contentDiv = div.querySelector("#admin-content") as HTMLElement;

  const renderProducts = async () => {
    try {
      // Changed to /medicines based on new backend structure
      const products = await api.get<Product[]>("/medicines");
      // Note: If backend endpoint is /products, change back. Guide says /medicines.

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
                                    <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; margin-right: 5px;" onclick="window.editProduct(${p.id})">Editar</button>
                                    <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; color: var(--error); border-color: var(--error);" onclick="window.deleteProduct(${p.id})">Excluir</button>
                                </td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
                
    <div id="product-form-modal" style="display: none; margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1rem;">
                    <h4 id="form-title">Adicionar Medicamento</h4>
                    <form id="add-product-form">
                        <input type="hidden" name="id" id="product-id">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <input type="text" name="name" id="p-name" placeholder="Nome Comercial" class="input-field" required>
                            <input type="text" name="manufacturer" id="p-manufacturer" placeholder="Fabricante" class="input-field" required>
                            <input type="text" name="active_principle" id="p-active_principle" placeholder="Princípio Ativo" class="input-field" required>
                            <input type="number" name="price" id="p-price" placeholder="Preço" step="0.01" class="input-field" required min="0">
                            <input type="number" name="stock" id="p-stock" placeholder="Estoque (Quantidade)" class="input-field" required min="0">
                            
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <input type="checkbox" name="requires_prescription" id="p-prescription">
                                <label for="p-prescription">Requer Receita?</label>
                            </div>
                        </div>
                        <!-- <input type="text" name="image_url" id="p-image" placeholder="URL da Imagem" class="input-field" style="margin-top: 1rem;"> -->
                        
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
          const rawData: any = Object.fromEntries(formData.entries());

          // Map fields to Backend Schema
          const data = {
            id: rawData.id,
            name: rawData.name,
            manufacturer: rawData.manufacturer,
            active_principle: rawData.active_principle,
            price: parseFloat(rawData.price),
            stock: parseInt(rawData.stock), // Backend uses 'stock', interface 'quantity'
            requires_prescription: (
              document.getElementById("p-prescription") as HTMLInputElement
            ).checked, // Boolean
          };

          const id = data.id;
          delete (data as any).id;

          try {
            if (id) {
              // Update
              await api.put(`/medicines/${id}`, data);
              alert("Medicamento atualizado!");
            } else {
              // Create
              await api.post("/medicines", data);
              alert("Medicamento criado!");
            }
            renderProducts();
            document.getElementById("product-form-modal")!.style.display =
              "none";
          } catch (err: any) {
            alert("Erro: " + err.message);
          }
        });
      }
    } catch (err: any) {
      contentDiv.innerHTML = `<p style="color: var(--error);">Erro: ${err.message}</p>`;
    }
  };

  const renderOrders = async () => {
    try {
      const [orders, customers] = await Promise.all([
        api.get<Order[]>("/sales"),
        api.get<Customer[]>("/customers"),
      ]);

      const customerMap = new Map(customers.map((c) => [c.id, c.name]));

      contentDiv.innerHTML = `
                 <h3>Todos os Pedidos</h3>
                  <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                    ${orders
                      .map((order) => {
                        const customerName =
                          customerMap.get(order.customer_id) ||
                          `ID ${order.customer_id}`;
                        return `
                        <div style="border: 1px solid var(--border); padding: 1rem; border-radius: var(--radius-sm);">
                            <div style="display: flex; justify-content: space-between;">
                                <strong>Pedido #${order.id} - ${customerName}</strong>
                                <!-- Status implicitly Active if listed here -->
                            </div>
                            <p style="font-size: 0.9rem; color: var(--text-muted);">Total: R$ ${order.total_value ? order.total_value.toFixed(2) : "0.00"}</p>
                             <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                <button class="btn btn-primary" style="font-size: 0.8rem;" onclick="window.viewOrderDetails(${order.id})">Ver Detalhes</button>
                                <button class="btn btn-secondary" style="font-size: 0.8rem; color: var(--error);" onclick="window.adminCancelOrder(${order.id})">Cancelar/Excluir</button>
                             </div>
                        </div>
                    `;
                      })
                      .join("")}
                 </div>
            `;
    } catch (err: any) {
      contentDiv.innerHTML = `<p style="color: var(--error);">Erro: ${err.message}</p>`;
    }
  };

  const renderUsers = async () => {
    try {
      const users = await api.get<User[]>("/users");
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

  const renderCustomers = async () => {
    try {
      const customers = await api.get<Customer[]>("/customers");
      contentDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>Gerenciar Clientes</h3>
                    <button class="btn btn-primary" onclick="window.navigate('/customers/new')">Novo Cliente</button>
                </div>
                 <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid var(--border);">
                            <th style="padding: 10px;">ID</th>
                            <th style="padding: 10px;">Nome</th>
                            <th style="padding: 10px;">CPF</th>
                            <th style="padding: 10px;">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${customers
                          .map(
                            (c) => `
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 10px;">${c.id}</td>
                                <td style="padding: 10px;">${c.name}</td>
                                <td style="padding: 10px;">${c.cpf}</td>
                                <td style="padding: 10px;">${c.email || "-"}</td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
                <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem;">
                    * Certifique-se de que existe um Cliente com ID correspondente ao usuário logado para evitar erros de venda.
                </p>
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
    if (tab === "customers") renderCustomers();
  };

  window.showProductForm = () => {
    const modal = document.getElementById("product-form-modal");
    if (modal) {
      modal.style.display = "block";
      (document.getElementById("form-title") as HTMLElement).textContent =
        "Adicionar Medicamento";
      (document.getElementById("add-product-form") as HTMLFormElement).reset();
      (document.getElementById("product-id") as HTMLInputElement).value = "";
    }
  };

  window.editProduct = async (id: number) => {
    try {
      const product = await api.get<any>(`/medicines/${id}`); // Use 'any' or proper interface matching backend
      const modal = document.getElementById("product-form-modal");
      if (modal) {
        modal.style.display = "block";
        (document.getElementById("form-title") as HTMLElement).textContent =
          "Editar Medicamento";

        (document.getElementById("product-id") as HTMLInputElement).value =
          product.id.toString();
        (document.getElementById("p-name") as HTMLInputElement).value =
          product.name;
        (document.getElementById("p-manufacturer") as HTMLInputElement).value =
          product.manufacturer || "";
        (
          document.getElementById("p-active_principle") as HTMLInputElement
        ).value = product.active_principle || "";
        (document.getElementById("p-price") as HTMLInputElement).value =
          product.price.toString();
        (document.getElementById("p-stock") as HTMLInputElement).value = (
          product.stock ?? product.quantity
        ).toString();
        (
          document.getElementById("p-prescription") as HTMLInputElement
        ).checked = !!product.requires_prescription;
      }
    } catch (e) {
      alert("Erro ao carregar produto.");
    }
  };

  window.deleteProduct = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este medicamento?")) return;
    try {
      await api.delete(`/medicines/${id}`); // Changed to /medicines based on guide
      renderProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  window.adminCancelOrder = async (id: number) => {
    if (!confirm("Cancelar pedido?")) return;
    try {
      await api.post(`/sales/${id}/cancel`);
      renderOrders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  window.viewOrderDetails = async (id: number) => {
    const modal = document.getElementById("order-details-modal");
    const content = document.getElementById("order-details-content");
    if (!modal || !content) return;

    modal.style.display = "block";
    content.innerHTML = "Carregando...";

    try {
      const order = await api.get<Order>(`/sales/${id}`);

      let itemsHtml = "<p>Sem itens.</p>";
      if (order.items && order.items.length > 0) {
        // Enrich items with product names if missing
        const enrichedItems = await Promise.all(
          order.items.map(async (item) => {
            const prodId = item.product_id || item.medicine_id;
            let name = item.product_name;

            if (!name && prodId) {
              try {
                const product = await api.get<Product>(`/medicines/${prodId}`);
                name = product.name;
              } catch (e) {
                console.error("Failed to load product", prodId, e);
                name = "Produto não encontrado";
              }
            }
            return { ...item, _display_name: name, _display_id: prodId };
          }),
        );

        itemsHtml = `
                <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border);">
                            <th style="text-align: left; padding: 5px;">Produto</th>
                            <th style="text-align: left; padding: 5px;">Qtd</th>
                            <!-- <th style="text-align: left; padding: 5px;">Preço</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        ${enrichedItems
                          .map(
                            (item) => `
                            <tr>
                                <td style="padding: 5px;">${item._display_name || `ID ${item._display_id}`}</td>
                                <td style="padding: 5px;">${item.quantity}</td>
                                <!-- <td style="padding: 5px;">R$ ${item.price_at_time ? item.price_at_time.toFixed(2) : "-"}</td> -->
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            `;
      }

      content.innerHTML = `
            <p><strong>ID:</strong> #${order.id}</p>
            <p><strong>Cliente ID:</strong> ${order.customer_id}</p>
            <p><strong>Status:</strong> ${order.status || "Pendente"}</p>
            <p><strong>Data:</strong> ${new Date(order.created_at).toLocaleString()}</p>
            
            ${
              order.doctor_crm
                ? `
                <div style="margin-top: 1rem; padding: 1rem; background: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px;">
                    <h5 style="margin-bottom: 0.5rem;">Dados da Receita</h5>
                    <p><strong>CRM:</strong> ${order.doctor_crm}</p>
                    <p><strong>Data Receita:</strong> ${order.prescription_date}</p>
                </div>
            `
                : ""
            }

            <h4 style="margin-top: 1rem;">Itens</h4>
            ${itemsHtml}

            <div style="margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1rem; display: flex; justify-content: flex-end; gap: 1rem;">
                ${
                  !order.status || order.status === "pending"
                    ? `
                    <button class="btn btn-primary" onclick="window.confirmOrder(${order.id})">Confirmar Pedido</button>
                `
                    : '<span style="color: var(--success); font-weight: bold;">Pedido Confirmado</span>'
                }
                <button class="btn btn-secondary" onclick="document.getElementById('order-details-modal').style.display='none'">Fechar</button>
            </div>
        `;
    } catch (err: any) {
      content.innerHTML = `<p style="color: var(--error);">Erro ao carregar detalhes: ${err.message}</p>`;
    }
  };

  window.confirmOrder = async (id: number) => {
    if (!confirm("Confirmar este pedido?")) return;
    try {
      await api.patch(`/sales/${id}/confirm`, {});
      alert("Pedido confirmado!");
      document.getElementById("order-details-modal")!.style.display = "none";
      renderOrders();
    } catch (err: any) {
      alert("Erro ao confirmar: " + err.message);
    }
  };

  // Render inicial
  renderProducts();

  return div;
};

// Add global types
declare global {
  interface Window {
    editProduct?: (id: number) => void;
    viewOrderDetails?: (id: number) => void;
    confirmOrder?: (id: number) => void;
  }
}
