import { api } from "../../../shared/http/api.js";
import {
  Product,
  User,
  Order,
  Medicine,
} from "../../../shared/types.js";
import { UserService } from "../services/user.service.js";

export const AdminPage = async (): Promise<HTMLElement> => {
  const div = document.createElement("div");

  const userStr = localStorage.getItem("user");
  const user: User = userStr ? JSON.parse(userStr) : ({} as User);

  if (user.role !== "ADMIN") {
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
            
            <div id="order-details-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                <div style="background: var(--surface); padding: 2rem; border-radius: var(--radius-md); width: 80%; max-width: 600px; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
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
      const products = await api.get<Medicine[]>("/medicines");
      // Note: If backend endpoint is /products, change back. Guide says /medicines.

      contentDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>Gerenciar Produtos</h3>
                    <button class="btn btn-primary" onclick="window.showProductForm()">Novo Produto</button>
                </div>
                <div class="table-container">
                    <table style="width: 100%; border-collapse: collapse; min-width: 600px;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid var(--border);">
                            <th style="padding: 10px;">Imagem</th>
                            <th style="padding: 10px;">ID</th>
                            <th style="padding: 10px;">Nome</th>
                            <th style="padding: 10px;">Categoria</th>
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
                                <td style="padding: 10px;">
                                    ${p.image_url 
                                        ? `<img src="${p.image_url}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">` 
                                        : '<span style="font-size: 0.8rem; color: #999;">Sem IMG</span>'}
                                </td>
                                <td style="padding: 10px;">${p.id}</td>
                                <td style="padding: 10px;">${p.name}</td>
                                <td style="padding: 10px;">${p.category || '-'}</td>
                                <td style="padding: 10px;">R$ ${p.price.toFixed(2)}</td>
                                <td style="padding: 10px;">${p.stock}</td>
                                <td style="padding: 10px;">
                                    <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; margin-right: 5px;" onclick="window.editProduct(${p.id})">Editar</button>
                                    <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; margin-right: 5px; background-color: #17a2b8; border-color: #17a2b8; color: white;" onclick="window.manageImage(${p.id})">Imagem</button>
                                    <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; color: var(--error); border-color: var(--error);" onclick="window.deleteProduct(${p.id})">Excluir</button>
                                </td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
                
                    </tbody>
                </table>
                </div>
                
            <div id="product-form-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                <div style="background: var(--surface); padding: 2rem; border-radius: var(--radius-md); width: 90%; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                    <h4 id="form-title" style="margin-bottom: 1.5rem; color: var(--primary);">Adicionar Medicamento</h4>
                    <form id="add-product-form">
                        <input type="hidden" name="id" id="product-id">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <input type="text" name="name" id="p-name" placeholder="Nome Comercial" class="input-field" required>
                            <input type="text" name="manufacturer" id="p-manufacturer" placeholder="Fabricante" class="input-field" required>
                            <input type="text" name="active_principle" id="p-active_principle" placeholder="Princípio Ativo" class="input-field" required>
                            <select name="category" id="p-category" class="input-field" required>
                                <option value="" disabled selected>Selecione a Categoria</option>
                                <option value="Remédios">Remédios</option>
                                <option value="Beleza">Beleza</option>
                                <option value="Infantil">Infantil</option>
                                <option value="Suplementos">Suplementos</option>
                                <option value="Vacinas">Vacinas</option>
                                <option value="Primeiros Socorros">Primeiros Socorros</option>
                            </select>
                            <input type="number" name="price" id="p-price" placeholder="Preço" step="0.01" class="input-field" required min="0">
                            <input type="number" name="stock" id="p-stock" placeholder="Estoque (Quantidade)" class="input-field" required min="0">
                            
                            <div style="display: flex; align-items: center; gap: 0.5rem; grid-column: span 2;">
                                <input type="checkbox" name="requires_prescription" id="p-prescription">
                                <label for="p-prescription">Requer Receita?</label>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                            <button type="submit" class="btn btn-primary" style="flex: 1;">Salvar</button>
                            <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('product-form-modal').style.display='none'">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>

            <div id="image-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1001; align-items: center; justify-content: center;">
                <div style="background: var(--surface); padding: 2rem; border-radius: var(--radius-md); width: 90%; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                    <h4 style="margin-bottom: 1.5rem; color: var(--primary);">Gerenciar Imagem do Produto</h4>
                    <input type="hidden" id="img-product-id">
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Opção 1: Upload de Arquivo</label>
                        <input type="file" id="img-file-input" class="input-field" accept="image/*">
                    </div>

                    <div style="display: flex; align-items: center; margin: 1rem 0; color: var(--text-muted);">
                        <div style="flex: 1; height: 1px; background: var(--border);"></div>
                        <span style="padding: 0 10px; font-size: 0.9rem;">OU</span>
                        <div style="flex: 1; height: 1px; background: var(--border);"></div>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Opção 2: URL da Imagem</label>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="img-url-input" class="input-field" placeholder="https://..." style="flex: 1;">
                            <button type="button" class="btn btn-secondary" onclick="window.previewImageModal()">Ver</button>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 1.5rem; height: 300px; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border: 2px dashed var(--border); border-radius: var(--radius-sm); overflow: hidden;">
                        <img id="img-modal-preview" src="" style="max-width: 100%; max-height: 100%; object-fit: contain; display: none;">
                        <p id="img-modal-placeholder" style="color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                           <span style="font-size: 2rem;">🖼️</span>
                           <span>Prévia da Imagem</span>
                        </p>
                    </div>

                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-primary" style="flex: 1;" onclick="window.saveImage()">Salvar Imagem</button>
                        <button class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('image-modal').style.display='none'">Fechar</button>
                    </div>
                </div>
            </div>

            <!-- User Form Modal -->
             <div id="user-form-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                <div style="background: var(--surface); padding: 2rem; border-radius: var(--radius-md); width: 90%; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                    <h4 style="margin-bottom: 1.5rem; color: var(--primary);">Editar Usuário</h4>
                    <form id="edit-user-form">
                        <input type="hidden" name="id" id="u-id">
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome</label>
                            <input type="text" name="name" id="u-name" class="input-field" required>
                        </div>

                         <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
                            <input type="email" name="email" id="u-email" class="input-field" required>
                        </div>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Telefone</label>
                            <input type="text" name="phone" id="u-phone" class="input-field">
                        </div>
                        
                         <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Endereço</label>
                            <input type="text" name="address" id="u-address" class="input-field">
                        </div>

                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Role (Papel)</label>
                            <select name="role" id="u-role" class="input-field" required>
                                <option value="CLIENT">Cliente</option>
                                <option value="USER">Usuário Comum</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>

                        <div style="display: flex; gap: 1rem;">
                            <button type="submit" class="btn btn-primary" style="flex: 1;">Salvar</button>
                            <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('user-form-modal').style.display='none'">Cancelar</button>
                        </div>
                    </form>
                </div>
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
            category: rawData.category,
            price: parseFloat(rawData.price),
            stock: parseInt(rawData.stock), // Backend uses 'stock', interface 'quantity'
            requires_prescription: (
              document.getElementById("p-prescription") as HTMLInputElement
            ).checked, // Boolean
            // image_url removed from create/update form payload if using separate flow, OR keep it if compatible. 
            // If I remove it from form, it won't be sent.
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
      const [orders, users] = await Promise.all([
        api.get<Order[]>("/sales"),
        api.get<User[]>("/users"),
      ]);

      const userMap = new Map(users.map((u) => [u.id, u.name]));
      
      // Separate pending and confirmed orders
      const pendingOrders = orders.filter(o => !o.status || o.status === 'pending');
      const confirmedOrders = orders.filter(o => o.status === 'confirmed');
      const cancelledOrders = orders.filter(o => o.status === 'cancelled');

      const renderOrdersList = (list: Order[]) => {
        return list.map((order) => {
          const userName = userMap.get(order.user_id) || `ID ${order.user_id}`;
          const statusColor = !order.status || order.status === 'pending' ? '#ff9800' : order.status === 'confirmed' ? '#4caf50' : '#f44336';
          const statusLabel = !order.status || order.status === 'pending' ? 'Pendente' : order.status === 'confirmed' ? 'Confirmado' : 'Cancelado';
          
          return `
            <div style="border: 1px solid var(--border); padding: 1rem; border-radius: var(--radius-sm); background: ${order.status === 'pending' ? '#fffde7' : 'white'};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>Pedido #${order.id} - ${userName}</strong>
                        <span style="display: inline-block; margin-left: 1rem; padding: 4px 12px; background: ${statusColor}; color: white; font-size: 0.75rem; font-weight: bold; border-radius: 4px;">${statusLabel}</span>
                    </div>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">Total: R$ ${order.total_value ? order.total_value.toFixed(2) : "0.00"}</p>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                    <button class="btn btn-primary" style="font-size: 0.8rem;" onclick="window.viewOrderDetails(${order.id})">Ver Detalhes</button>
                    ${order.status !== 'confirmed' ? `<button class="btn btn-secondary" style="font-size: 0.8rem; color: var(--error);" onclick="window.adminCancelOrder(${order.id})">Cancelar</button>` : ''}
                </div>
            </div>
          `;
        }).join("");
      };

      contentDiv.innerHTML = `
        <div>
          ${pendingOrders.length > 0 ? `
            <h3 style="color: #ff9800; margin-bottom: 1rem;">⚠️ Pedidos Pendentes (${pendingOrders.length})</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
              ${renderOrdersList(pendingOrders)}
            </div>
          ` : '<p style="color: var(--text-muted);">Nenhum pedido pendente.</p>'}
          
          ${confirmedOrders.length > 0 ? `
            <h3 style="color: #4caf50; margin-bottom: 1rem;">✅ Pedidos Confirmados (${confirmedOrders.length})</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
              ${renderOrdersList(confirmedOrders)}
            </div>
          ` : ''}
          
          ${cancelledOrders.length > 0 ? `
            <h3 style="color: #f44336; margin-bottom: 1rem;">❌ Pedidos Cancelados (${cancelledOrders.length})</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${renderOrdersList(cancelledOrders)}
            </div>
          ` : ''}
        </div>
      `;
    } catch (err: any) {
      contentDiv.innerHTML = `<p style="color: var(--error);">Erro: ${err.message}</p>`;
    }
  };

  const renderUsers = async () => {
    try {
      const users = await UserService.getAll();
      contentDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>Gerenciar Usuários</h3>
                    <button class="btn btn-primary" onclick="window.showNewUserForm()">Novo Usuário</button>
                </div>
                 <div class="table-container">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 1rem; min-width: 600px;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid var(--border);">
                            <th style="padding: 10px;">ID</th>
                            <th style="padding: 10px;">Nome</th>
                            <th style="padding: 10px;">Email</th>
                            <th style="padding: 10px;">CPF</th>
                            <th style="padding: 10px;">Role</th>
                            <th style="padding: 10px;">Saldo</th>
                            <th style="padding: 10px;">Ações</th>
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
                                <td style="padding: 10px;">${u.cpf || '-'}</td>
                                <td style="padding: 10px;">
                                    <span style="
                                        padding: 4px 8px; 
                                        border-radius: 4px; 
                                        font-size: 0.8rem; 
                                        font-weight: bold;
                                        background: ${u.role === 'ADMIN' ? '#eef2ff' : u.role === 'USER' ? '#f0fdf4' : '#fff7ed'};
                                        color: ${u.role === 'ADMIN' ? '#4f46e5' : u.role === 'USER' ? '#16a34a' : '#ea580c'};
                                    ">
                                        ${u.role}
                                    </span>
                                </td>
                                <td style="padding: 10px;">R$ ${(u.balance || 0).toFixed(2)}</td>
                                <td style="padding: 10px;">
                                     <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; margin-right: 5px;" onclick="window.editUser(${u.id})">Editar</button>
                                     <button class="btn btn-secondary" style="font-size: 0.8rem; padding: 5px 10px; color: var(--error); border-color: var(--error);" onclick="window.deleteUser(${u.id})">Excluir</button>
                                </td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
                </div>
                
                <!-- Modal para criar/editar usuário -->
                <div id="user-form-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                    <div style="background: var(--surface); padding: 2rem; border-radius: var(--radius-md); width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                            <h3 id="user-modal-title">Novo Usuário</h3>
                            <button class="btn btn-secondary" onclick="document.getElementById('user-form-modal').style.display='none'">X</button>
                        </div>
                        <form id="user-form" style="display: flex; flex-direction: column; gap: 1rem;">
                            <input type="hidden" id="user-id" name="id" />
                            
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Nome</label>
                                <input type="text" id="user-name" name="name" required class="input-field" placeholder="Nome completo" />
                            </div>

                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Email</label>
                                <input type="email" id="user-email" name="email" required class="input-field" placeholder="email@example.com" />
                            </div>

                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">CPF</label>
                                <input type="text" id="user-cpf" name="cpf" required class="input-field" placeholder="000.000.000-00" />
                            </div>

                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Telefone</label>
                                <input type="tel" id="user-phone" name="phone" class="input-field" placeholder="(11) 99999-9999" />
                            </div>

                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Endereço</label>
                                <input type="text" id="user-address" name="address" class="input-field" placeholder="Rua, número..." />
                            </div>

                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Senha</label>
                                <input type="password" id="user-password" name="password" class="input-field" placeholder="Min 8 chars: A-Z, a-z, 0-9, @$!%*?&" />
                                <small style="color: var(--text-muted);">Obrigatória apenas para novos usuários</small>
                            </div>

                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Role</label>
                                <select id="user-role" name="role" class="input-field" required>
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="CLIENT">CLIENT</option>
                                </select>
                            </div>

                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Saldo</label>
                                <input type="number" id="user-balance" name="balance" step="0.01" class="input-field" placeholder="0.00" />
                            </div>

                            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                <button type="submit" class="btn btn-primary" style="flex: 1;">Salvar</button>
                                <button type="button" class="btn btn-secondary" style="flex: 1;" onclick="document.getElementById('user-form-modal').style.display='none'">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            // Attach event listeners
            const form = document.querySelector("#user-form") as HTMLFormElement;
            if (form) {
                form.addEventListener("submit", async (e: any) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const id = formData.get("id") as string;
                    const data: any = Object.fromEntries(formData.entries());
                    
                    // Remove campos vazios
                    if (!data.password) delete data.password;
                    if (!data.balance || data.balance === "") delete data.balance;
                    else data.balance = parseFloat(data.balance);
                    
                    if (!data.phone) delete data.phone;
                    if (!data.address) delete data.address;
                    delete data.id;

                    try {
                        if (id) {
                            // Atualizar
                            await UserService.update(parseInt(id), data);
                            alert("Usuário atualizado com sucesso!");
                        } else {
                            // Criar
                            if (!data.password) {
                                alert("Senha é obrigatória para novos usuários!");
                                return;
                            }
                            if (!data.cpf) {
                                alert("CPF é obrigatório!");
                                return;
                            }
                            await UserService.create(data);
                            alert("Usuário criado com sucesso!");
                        }
                        document.getElementById('user-form-modal')!.style.display = 'none';
                        await renderUsers();
                    } catch(err: any) {
                        alert("Erro ao salvar usuário: " + err.message);
                    }
                });
            }

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
    if (modal) {
      modal.style.display = "flex";
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
        modal.style.display = "flex";
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
        (document.getElementById("p-category") as HTMLSelectElement).value =
          product.category || "";
        (document.getElementById("p-price") as HTMLInputElement).value =
          product.price.toString();
        (document.getElementById("p-stock") as HTMLInputElement).value = (
          product.stock ?? product.quantity
        ).toString();
        (
          document.getElementById("p-prescription") as HTMLInputElement
        ).checked = !!product.requires_prescription;

        // Image handled separately now
      }
    } catch (e) {
      alert("Erro ao carregar produto.");
    }
  };

  window.manageImage = async (id: number) => {
      const modal = document.getElementById("image-modal");
      if (!modal) return;
      
      try {
          // Fetch current image to populate
          const product = await api.get<any>(`/medicines/${id}`);
          (document.getElementById("img-product-id") as HTMLInputElement).value = id.toString();
          const urlInput = document.getElementById("img-url-input") as HTMLInputElement;
          const fileInput = document.getElementById("img-file-input") as HTMLInputElement;
          
          urlInput.value = product.image_url || "";
          fileInput.value = ""; // Reset file input

          // Add Listener for File Input (remove old first to avoid duplicates if strict)
          // In this simple structure, simple assignment is okay or use onchange in HTML, but here is cleaner
          fileInput.onchange = (e: any) => {
              const file = e.target.files[0];
              if (file) {
                 const reader = new FileReader();
                 reader.onload = (evt: any) => {
                     urlInput.value = evt.target.result; // Set Data URL to text input
                     if (window.previewImageModal) window.previewImageModal();
                 };
                 reader.readAsDataURL(file);
              }
          };
          
          if (window.previewImageModal) window.previewImageModal();
          modal.style.display = "flex";
      } catch(e) {
          alert('Erro ao carregar dados do produto');
      }
  };

  window.previewImageModal = () => {
      const url = (document.getElementById("img-url-input") as HTMLInputElement).value;
      const img = document.getElementById("img-modal-preview") as HTMLImageElement;
      const placeholder = document.getElementById("img-modal-placeholder");
      
      if(url) {
          img.src = url;
          img.style.display = 'block';
          if(placeholder) placeholder.style.display = 'none';
      } else {
          img.src = "";
          img.style.display = 'none';
          if(placeholder) placeholder.style.display = 'block';
      }
  };
  
  window.saveImage = async () => {
      const id = (document.getElementById("img-product-id") as HTMLInputElement).value;
      const url = (document.getElementById("img-url-input") as HTMLInputElement).value;
      
      if(!id) return;
      
      try {
          await api.put(`/medicines/${id}`, { image_url: url });
          alert("Imagem atualizada!");
          document.getElementById("image-modal")!.style.display = "none";
          renderProducts(); // Refresh list to show new image thumbnail
      } catch(e: any) {
          alert("Erro ao salvar imagem: " + e.message);
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

    modal.style.display = "flex";
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
                <div class="table-container">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 1rem; min-width: 500px;">
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
                </div>
            `;
      }

      content.innerHTML = `
            <p><strong>ID:</strong> #${order.id}</p>
            <p><strong>Usuário ID:</strong> ${order.user_id}</p>
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

  // User Management Functions
  window.showNewUserForm = () => {
    const modal = document.getElementById("user-form-modal");
    const form = document.getElementById("user-form") as HTMLFormElement;
    const title = document.getElementById("user-modal-title");
    
    if (modal && form && title) {
      title.textContent = "Novo Usuário";
      form.reset();
      (document.getElementById("user-id") as HTMLInputElement).value = "";
      (document.getElementById("user-cpf") as HTMLInputElement).disabled = false;
      modal.style.display = "flex";
    }
  };

  window.editUser = async (id: number) => {
    try {
      const user = await UserService.getById(id);
      const modal = document.getElementById("user-form-modal");
      const form = document.getElementById("user-form") as HTMLFormElement;
      const title = document.getElementById("user-modal-title");
      
      if (modal && form && title) {
        title.textContent = "Editar Usuário";
        (document.getElementById("user-id") as HTMLInputElement).value = String(user.id);
        (document.getElementById("user-name") as HTMLInputElement).value = user.name;
        (document.getElementById("user-email") as HTMLInputElement).value = user.email;
        (document.getElementById("user-phone") as HTMLInputElement).value = user.phone || "";
        (document.getElementById("user-address") as HTMLInputElement).value = user.address || "";
        (document.getElementById("user-role") as HTMLSelectElement).value = user.role;
        (document.getElementById("user-balance") as HTMLInputElement).value = String(user.balance || 0);
        (document.getElementById("user-password") as HTMLInputElement).value = "";
        
        modal.style.display = "flex";
      }
    } catch (err: any) {
      alert("Erro ao carregar usuário: " + err.message);
    }
  };

  window.deleteUser = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) return;
    
    try {
      await UserService.delete(id);
      alert("Usuário excluído com sucesso!");
      renderUsers();
    } catch (err: any) {
      alert("Erro ao excluir usuário: " + err.message);
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
    manageImage?: (id: number) => void;
    previewImageModal?: () => void;
    saveImage?: () => void;
    editUser?: (id: number) => void;
    deleteUser?: (id: number) => void;
    showNewUserForm?: () => void;
  }
} // Removed previous previewImage which is no longer used in global scope logic here
