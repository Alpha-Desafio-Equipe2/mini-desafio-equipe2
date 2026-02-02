import { api } from "../../../shared/http/api.js";
import { User, Order, Customer } from "../../../shared/types.js";
import { SuccessModal } from "../../../shared/components/success-modal.js";
import { ErrorModal } from "../../../shared/components/error-modal.js";
import { AddBalanceModal } from "../../venda/components/add-balance-modal.js";

/**
 * Página de Perfil do Utilizador
 * Responsável por exibir dados pessoais, saldo, estatísticas e histórico de compras.
 */
export const ProfilePage = async (): Promise<HTMLElement> => {
  const div = document.createElement("div");
  div.innerHTML = `<div style="text-align:center; padding: 50px; font-family: sans-serif;">Carregando perfil...</div>`;

  try {
    // 1. Recuperação e Atualização do Usuário
    const userStr = localStorage.getItem("user");
    if (!userStr) throw new Error("Utilizador não encontrado. Por favor, faça login novamente.");
    
    let user: User = JSON.parse(userStr);
    
    // Tenta atualizar os dados do utilizador em tempo real
    try {
        const freshUser = await api.get<User>(`/users/${user.id}`);
        if(freshUser) {
             user = { ...user, ...freshUser };
             localStorage.setItem("user", JSON.stringify(user));
        }
    } catch(e) {
        console.warn("Não foi possível atualizar dados via API, usando cache local.");
    }

    // 2. Busca de Pedidos Corrigida
    let orders: Order[] = [];
    try {
      // Primeiro buscamos o Customer associado ao User
      const customers = await api.get<Customer[]>("/customers");
      const myCustomer = customers.find(c => c.user_id === user.id || c.email === user.email);
      
      const allSales = await api.get<Order[]>("/sales");
      
      if (myCustomer) {
           console.log("Customer encontrado:", myCustomer.id);
           orders = allSales
            .filter(sale => String(sale.customer_id) === String(myCustomer.id))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else {
           console.warn("Nenhum cliente associado encontrado. Tentando fallback pelo ID do usuário.");
           // Fallback legado caso o ID seja igual
           orders = allSales
            .filter(sale => String(sale.customer_id) === String(user.id))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      console.log(`Pedidos encontrados para o usuário ${user.id} (Customer ${myCustomer?.id}):`, orders.length);
    } catch (error) {
      console.error("Erro ao procurar pedidos:", error);
    }
    
    // Estatísticas (Gasto total apenas de pedidos confirmados)
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'confirmed').length;
    const totalSpent = orders
      .filter(o => o.status === 'confirmed')
      .reduce((sum, order) => {
        const value = typeof order.total_value === 'string' ? parseFloat(order.total_value) : order.total_value;
        return sum + (value || 0);
      }, 0);
      
    const balance = Number(user.balance) || 0;

    // Dados de Administrador
    const pharmacyData = user.role === 'admin' ? {
      name: "Farmácia Popular Central",
      cnpj: "12.345.678/0001-90",
      address: "Rua das Flores, 123 - Centro",
      phone: "(11) 3456-7890",
      totalSales: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + (Number(o.total_value) || 0), 0)
    } : null;

    // 3. Renderização da Interface
    div.innerHTML = `
      <style>
        .profile-container { display: grid; gap: 2rem; grid-template-columns: 1fr; padding: 1.5rem; max-width: 1200px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        @media (min-width: 992px) { .profile-container { grid-template-columns: 380px 1fr; } }
        
        .user-card { 
          background: linear-gradient(135deg, #007bff, #0056b3); 
          color: white; border-radius: 16px; padding: 2rem; 
          box-shadow: 0 10px 20px rgba(0,0,0,0.1); 
        }
        
        .user-avatar { width: 90px; height: 90px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; margin: 0 auto 1rem; border: 4px solid rgba(255,255,255,0.3); }
        
        .user-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
        .stat-box { background: rgba(255, 255, 255, 0.15); padding: 1rem; border-radius: 12px; text-align: center; }
        .stat-value { font-size: 1.1rem; font-weight: 700; display: block; overflow: hidden; text-overflow: ellipsis; }
        .stat-label { font-size: 0.65rem; text-transform: uppercase; opacity: 0.9; letter-spacing: 0.5px; }
        
        .info-section { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 1.5rem; border: 1px solid #eee; }
        .section-title { font-size: 1.15rem; font-weight: 700; color: #333; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px; }
        
        .order-card { background: white; border: 1px solid #eee; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; transition: transform 0.2s; }
        .order-card:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.08); }
        
        .status-badge { padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .status-confirmed { background: #d4edda; color: #155724; }
        .status-cancelled { background: #f8d7da; color: #721c24; }
        .status-pending { background: #fff3cd; color: #856404; }
        
        .pharmacy-card { background: linear-gradient(135deg, #28a745, #1e7e34); color: white; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .btn-cancel { background: none; border: 1px solid #dc3545; color: #dc3545; padding: 8px; border-radius: 8px; width: 100%; cursor: pointer; font-weight: 600; margin-top: 10px; transition: 0.2s; }
        .btn-cancel:hover { background: #dc3545; color: white; }
        
        .input-field { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-top: 5px; box-sizing: border-box; }
      </style>
      
      <div class="profile-container">
        <aside>
          <div class="user-card">
            <div class="user-avatar">${user.role === 'admin' ? '👨‍💼' : '👤'}</div>
            <div style="text-align:center;">
              <h2 style="margin:0; font-size: 1.4rem;">${user.name}</h2>
              <p style="opacity:0.8; font-size:0.85rem; margin: 5px 0;">${user.email}</p>
              <span style="background:rgba(255,255,255,0.2); padding:4px 12px; border-radius:20px; font-size:0.75rem;">
                ${user.role === 'admin' ? '🔑 Administrador' : '👤 Cliente'}
              </span>
            </div>
            
            <div class="user-stats">
              <div class="stat-box">
                <span class="stat-value" id="user-balance-display">R$ ${balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                <span class="stat-label">Saldo</span>
                <button id="add-balance-btn" style="background:white; color:#007bff; border:none; border-radius:4px; padding:4px 8px; font-size:9px; cursor:pointer; margin-top:8px; font-weight:bold;">RECARREGAR</button>
              </div>
              <div class="stat-box">
                <span class="stat-value">${totalOrders}</span>
                <span class="stat-label">Pedidos</span>
              </div>
              <div class="stat-box">
                <span class="stat-value">${completedOrders}</span>
                <span class="stat-label">Concluídos</span>
              </div>
              <div class="stat-box" title="Total gasto em pedidos confirmados">
                <span class="stat-value">R$ ${totalSpent.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                <span class="stat-label">Total Gasto</span>
              </div>
            </div>
          </div>

          ${pharmacyData ? `
            <div class="pharmacy-card" style="margin-top: 1.5rem;">
              <h3 style="margin:0 0 10px 0; font-size:1.1rem;">🏥 Gestão Farmácia</h3>
              <div style="font-size:0.8rem; opacity:0.9;">
                <p style="margin:4px 0;"><strong>CNPJ:</strong> ${pharmacyData.cnpj}</p>
              </div>
              <div style="margin-top:15px; display:flex; justify-content:space-between; border-top:1px solid rgba(255,255,255,0.2); padding-top:10px;">
                <div><small>VENDAS</small><br><strong>${pharmacyData.totalSales}</strong></div>
                <div><small>RECEITA</small><br><strong>R$ ${pharmacyData.totalRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong></div>
              </div>
            </div>
          ` : ''}

          <div class="info-section" style="margin-top: 1.5rem;">
            <h3 class="section-title">📝 Dados Cadastrais</h3>
            <form id="profile-form">
              <div style="margin-bottom:12px;">
                <label style="font-size:0.75rem; color:#666; font-weight:700; text-transform: uppercase;">Telefone</label>
                <input type="text" name="phone" value="${user.phone || ''}" class="input-field" placeholder="(00) 00000-0000">
              </div>
              <div style="margin-bottom:12px;">
                <label style="font-size:0.75rem; color:#666; font-weight:700; text-transform: uppercase;">Endereço</label>
                <textarea name="address" class="input-field" rows="2" placeholder="Seu endereço completo">${user.address || ''}</textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%; padding:12px; border-radius:8px; font-weight: bold;">SALVAR ALTERAÇÕES</button>
            </form>
          </div>
        </aside>
        
        <main>
          <div class="info-section">
            <h3 class="section-title">📦 Histórico de Compras</h3>
            
            ${orders.length === 0 ? `
              <div style="text-align:center; padding: 60px 20px; color:#999; background: #fafafa; border-radius: 12px; border: 2px dashed #eee;">
                <div style="font-size:3.5rem; margin-bottom:15px; opacity: 0.5;">🛒</div>
                <p style="margin:0; font-weight: 500;">Você ainda não tem pedidos registrados.</p>
                <p style="font-size: 0.85rem; margin-top: 5px;">Seus pedidos aparecerão aqui automaticamente.</p>
              </div>
            ` : orders.map(order => {
                const statusMap: any = {
                    'confirmed': { label: 'Confirmado', class: 'status-confirmed' },
                    'cancelled': { label: 'Cancelado', class: 'status-cancelled' },
                    'pending': { label: 'Pendente', class: 'status-pending' }
                };
                const status = statusMap[order.status || 'pending'] || statusMap['pending'];
                const date = new Date(order.created_at);

                return `
                  <div class="order-card" id="order-card-${order.id}">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                      <span style="font-weight:700; color:#333;">Pedido #${order.id}</span>
                      <span class="status-badge ${status.class}" id="order-status-${order.id}">${status.label}</span>
                    </div>
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap:15px; font-size:0.8rem; color:#666; padding-bottom:12px; border-bottom:1px solid #f9f9f9;">
                      <div><small style="color: #aaa; font-weight: bold;">DATA</small><br><strong>${date.toLocaleDateString('pt-BR')}</strong></div>
                      <div><small style="color: #aaa; font-weight: bold;">HORA</small><br><strong>${date.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</strong></div>
                      ${order.doctor_crm ? `<div><small style="color: #aaa; font-weight: bold;">CRM</small><br><strong>${order.doctor_crm}</strong></div>` : ''}
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                      <span style="font-weight:600; color:#555;">Valor Total</span>
                      <span style="font-size:1.15rem; font-weight:800; color:#007bff;">R$ ${(Number(order.total_value)).toLocaleString('pt-BR', {minimumFractionDigits:2})}</span>
                    </div>
                    ${order.status === 'pending' ? `
                      <button class="btn-cancel" onclick="event.preventDefault(); window.profileCancelOrder(${order.id})">CANCELAR PEDIDO</button>
                    ` : ''}
                  </div>
                `;
            }).join('')}
          </div>
        </main>
      </div>
    `;

    // 4. Lógica de Eventos
    
    div.querySelector("#add-balance-btn")?.addEventListener("click", () => {
      const modal = AddBalanceModal(() => {
        // Atualizar saldo no DOM sem recarregar
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Atualiza a variável local para manter consistência
            user.balance = parsedUser.balance;
            
            const balanceDisplay = document.getElementById("user-balance-display");
            if (balanceDisplay) {
                balanceDisplay.textContent = `R$ ${Number(user.balance).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
            }
        }
      });
      document.body.appendChild(modal);
    });

    div.querySelector("#profile-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      try {
        // Correção de rota: Garantir que user.id existe
        if (!user.id) throw new Error("ID do usuário inválido.");
        
        await api.put(`/users/${user.id}`, data);
        
        // Atualiza localStorage e objeto local antes de recarregar
        const updatedUser = { ...user, ...data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        document.body.appendChild(SuccessModal({ 
          title: "Perfil Atualizado", 
          message: "Suas informações foram salvas com sucesso." 
        }));
        
        // Pequeno delay para o usuário ver o sucesso antes de recarregar
        setTimeout(() => window.location.reload(), 1500);
      } catch (err: any) {
        console.error("Erro na atualização:", err);
        document.body.appendChild(ErrorModal({ 
          title: "Erro ao Atualizar", 
          message: err.message || "A API retornou um erro ao tentar salvar os dados." 
        }));
      }
    });

    // Função de Cancelamento Global (Renomeada para evitar conflitos)
    (window as any).profileCancelOrder = async (id: number) => {
      const confirmModal = ErrorModal({
        title: "Confirmar Cancelamento",
        message: "Deseja realmente cancelar este pedido?",
        type: "warning"
      });
      document.body.appendChild(confirmModal);
      
      const confirmBtn = document.createElement("button");
      confirmBtn.className = "btn btn-primary";
      confirmBtn.style.cssText = "width: 100%; margin-top: 1rem; background: #dc3545; border:none; padding: 10px; border-radius: 8px; font-weight: bold;";
      confirmBtn.textContent = "SIM, CANCELAR";
      confirmBtn.onclick = async (e: MouseEvent) => {
        if(e) {
             e.preventDefault();
             e.stopPropagation();
        }
        confirmModal.remove();
        try {
          await api.post(`/sales/${id}/cancel`, {});
          document.body.appendChild(SuccessModal({ title: "Pedido Cancelado", message: "O status foi atualizado." }));
          // Atualizar interface sem recarregar
          const orderCard = document.getElementById(`order-card-${id}`);
          if (orderCard) {
            const statusBadge = document.getElementById(`order-status-${id}`);
            if (statusBadge) {
                statusBadge.className = 'status-badge status-cancelled';
                statusBadge.textContent = 'Cancelado';
            }
            
            // Remover botão de cancelar
            const cancelBtn = orderCard.querySelector('.btn-cancel');
            if (cancelBtn) cancelBtn.remove();
          }
        } catch (error: any) {
          document.body.appendChild(ErrorModal({ title: "Erro", message: "Não foi possível cancelar o pedido." }));
        }
      };
      confirmModal.querySelector(".error-modal-content")?.appendChild(confirmBtn);
    };

  } catch (error: any) {
    div.innerHTML = `
      <div style="padding:40px; text-align:center; color:#721c24; background:#f8d7da; border-radius:12px; margin: 20px;">
        <h3>⚠️ Erro ao carregar página</h3>
        <p>${error.message}</p>
        <button onclick="window.location.reload()" class="btn btn-primary" style="margin-top:10px;">Tentar Novamente</button>
      </div>
    `;
  }

  return div;
};