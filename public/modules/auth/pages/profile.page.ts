import { api } from "../../../shared/http/api.js";
import { User, Order } from "../../../shared/types.js";
import { SuccessModal } from "../../../shared/components/success-modal.js";
import { ErrorModal } from "../../../shared/components/error-modal.js";
import { BalanceService } from "../../venda/services/balance.service.js";

export const ProfilePage = async (): Promise<HTMLElement> => {
  const div = document.createElement("div");

  try {
    // Get user from localStorage (saved during login)
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("User not found. Please login again.");
    }
    const user: User = JSON.parse(userStr);
    
    // Get all sales and filter by user
    let orders: Order[] = [];
    try {
      const allSales = await api.get<Order[]>("/sales");
      // Filter sales for current user (assuming customer_id matches user.id)
      orders = allSales.filter(sale => sale.customer_id === user.id);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Continue without orders
    }
    
    const balance = BalanceService.getBalance();

    // Calculate statistics
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status !== 'cancelled').length;
    const totalSpent = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + (order.total_value || 0), 0);

    // Admin pharmacy data (mock data for demo)
    const pharmacyData = user.role === 'admin' ? {
      name: "Farmácia Popular Central",
      cnpj: "12.345.678/0001-90",
      address: "Rua das Flores, 123 - Centro",
      phone: "(11) 3456-7890",
      totalSales: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.total_value || 0), 0)
    } : null;

    div.innerHTML = `
      <style>
        .profile-container {
          display: grid;
          gap: 2rem;
          grid-template-columns: 1fr;
        }
        
        @media (min-width: 768px) {
          .profile-container {
            grid-template-columns: 350px 1fr;
          }
        }
        
        .user-card {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark, #0056b3));
          color: white;
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-lg);
        }
        
        .user-avatar {
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          margin: 0 auto 1.5rem;
          border: 4px solid rgba(255, 255, 255, 0.3);
        }
        
        .user-name {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .user-email {
          text-align: center;
          opacity: 0.9;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .user-role {
          text-align: center;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          display: inline-block;
          margin: 0 auto 1.5rem;
          width: fit-content;
          display: block;
        }
        
        .user-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .stat-box {
          background: rgba(255, 255, 255, 0.15);
          padding: 1rem;
          border-radius: var(--radius-md);
          text-align: center;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.75rem;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .info-section {
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          margin-bottom: 1.5rem;
        }
        
        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .order-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: all 0.2s ease;
        }
        
        .order-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .order-number {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text);
        }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-confirmed {
          background: #d4edda;
          color: #155724;
        }
        
        .status-cancelled {
          background: #f8d7da;
          color: #721c24;
        }
        
        .status-pending {
          background: #fff3cd;
          color: #856404;
        }
        
        .order-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        
        .meta-item {
          display: flex;
          flex-direction: column;
        }
        
        .meta-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }
        
        .meta-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
        }
        
        .order-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid var(--border);
          font-size: 1.125rem;
          font-weight: 700;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
        }
        
        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .pharmacy-card {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          border-radius: var(--radius-lg);
          padding: 2rem;
          margin-bottom: 1.5rem;
        }
      </style>
      
      <div class="profile-container">
        <!-- User Info Sidebar -->
        <div>
          <div class="user-card">
            <div class="user-avatar">${user.role === 'admin' ? '👨‍💼' : '👤'}</div>
            <div class="user-name">${user.name}</div>
            <div class="user-email">${user.email}</div>
            <div class="user-role">${user.role === 'admin' ? '🔑 Administrador' : user.role === 'manager' ? '👔 Gerente' : user.role === 'attendant' ? '🏪 Atendente' : '👤 Cliente'}</div>
            
            <div class="user-stats">
              <div class="stat-box">
                <div class="stat-value">R$ ${balance.toFixed(2)}</div>
                <div class="stat-label">Saldo</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${totalOrders}</div>
                <div class="stat-label">Pedidos</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">${completedOrders}</div>
                <div class="stat-label">Concluídos</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">R$ ${totalSpent.toFixed(2)}</div>
                <div class="stat-label">Total Gasto</div>
              </div>
            </div>
          </div>
          
          ${pharmacyData ? `
            <div class="pharmacy-card">
              <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem;">🏥 ${pharmacyData.name}</h3>
              <div style="font-size: 0.875rem; opacity: 0.9;">
                <p style="margin: 0.5rem 0;"><strong>CNPJ:</strong> ${pharmacyData.cnpj}</p>
                <p style="margin: 0.5rem 0;"><strong>Endereço:</strong> ${pharmacyData.address}</p>
                <p style="margin: 0.5rem 0;"><strong>Telefone:</strong> ${pharmacyData.phone}</p>
              </div>
              <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.3);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div>
                    <div style="font-size: 1.5rem; font-weight: 700;">${pharmacyData.totalSales}</div>
                    <div style="font-size: 0.75rem; opacity: 0.9;">VENDAS TOTAIS</div>
                  </div>
                  <div>
                    <div style="font-size: 1.5rem; font-weight: 700;">R$ ${pharmacyData.totalRevenue.toFixed(2)}</div>
                    <div style="font-size: 0.75rem; opacity: 0.9;">RECEITA</div>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
          
          <!-- User Details Form -->
          <div class="info-section">
            <h3 class="section-title">📋 Informações Pessoais</h3>
            <form id="profile-form">
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nome Completo</label>
                <input type="text" name="name" value="${user.name}" class="input-field" required>
              </div>
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email</label>
                <input type="email" name="email" value="${user.email}" class="input-field" required>
              </div>
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Telefone</label>
                <input type="text" name="phone" value="${user.phone || ""}" class="input-field" placeholder="(00) 00000-0000">
              </div>
              <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Endereço</label>
                <textarea name="address" class="input-field" rows="3" placeholder="Rua, Número, Bairro, Cidade...">${user.address || ""}</textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">💾 Salvar Alterações</button>
            </form>
          </div>
        </div>
        
        <!-- Orders Section -->
        <div>
          <div class="info-section">
            <h3 class="section-title">📦 Histórico de Pedidos</h3>
            
            ${orders.length === 0 ? `
              <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h4>Nenhum pedido ainda</h4>
                <p>Seus pedidos aparecerão aqui após a primeira compra.</p>
                <button onclick="window.navigate('/')" class="btn btn-primary" style="margin-top: 1rem;">
                  🛒 Ir às Compras
                </button>
              </div>
            ` : `
              <div>
                ${orders.map(order => {
                  const status = order.status || 'pending';
                  const statusClass = status === 'cancelled' ? 'status-cancelled' : 
                                     status === 'confirmed' ? 'status-confirmed' : 'status-pending';
                  const statusText = status === 'cancelled' ? 'Cancelado' : 
                                    status === 'confirmed' ? 'Confirmado' : 'Pendente';
                  
                  return `
                    <div class="order-card">
                      <div class="order-header">
                        <div class="order-number">Pedido #${order.id}</div>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                      </div>
                      
                      <div class="order-meta">
                        <div class="meta-item">
                          <span class="meta-label">Data</span>
                          <span class="meta-value">${new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div class="meta-item">
                          <span class="meta-label">Horário</span>
                          <span class="meta-value">${new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        ${order.doctor_crm ? `
                          <div class="meta-item">
                            <span class="meta-label">CRM Médico</span>
                            <span class="meta-value">${order.doctor_crm}</span>
                          </div>
                        ` : ''}
                      </div>
                      
                      <div class="order-total">
                        <span>Total do Pedido</span>
                        <span style="color: var(--primary);">R$ ${(order.total_value || 0).toFixed(2)}</span>
                      </div>
                      
                      ${status === 'pending' ? `
                        <button class="btn btn-secondary" 
                                style="margin-top: 1rem; width: 100%; border-color: var(--error); color: var(--error);" 
                                onclick="window.cancelOrder(${order.id})">
                          ❌ Cancelar Pedido
                        </button>
                      ` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    // Profile form submission
    div.querySelector("#profile-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      try {
        await api.put(`/users/${user.id}`, data);
        
        // Update localStorage with new data
        const updatedUser = { ...user, ...data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        const successModal = SuccessModal({
          title: "Perfil Atualizado!",
          message: "Suas informações foram salvas com sucesso.",
          icon: "✅"
        });
        document.body.appendChild(successModal);
      } catch (error: any) {
        const errorModal = ErrorModal({
          title: "Erro ao Atualizar",
          message: "Não foi possível salvar suas informações.",
          type: "error",
          details: [error.message || "Erro desconhecido"]
        });
        document.body.appendChild(errorModal);
      }
    });

    // Cancel order function
    window.cancelOrder = async (id: number) => {
      const confirmModal = ErrorModal({
        title: "Cancelar Pedido?",
        message: "Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.",
        type: "warning"
      });
      document.body.appendChild(confirmModal);
      
      // Add confirm button to modal
      const confirmBtn = document.createElement("button");
      confirmBtn.className = "btn btn-primary";
      confirmBtn.style.cssText = "width: 100%; margin-top: 1rem; background: var(--error);";
      confirmBtn.textContent = "Sim, Cancelar Pedido";
      confirmBtn.onclick = async () => {
        confirmModal.remove();
        try {
          await api.post(`/sales/${id}/cancel`, {});
          const successModal = SuccessModal({
            title: "Pedido Cancelado",
            message: "O pedido foi cancelado com sucesso.",
            icon: "✅"
          });
          document.body.appendChild(successModal);
          setTimeout(() => window.location.reload(), 1500);
        } catch (error: any) {
          const errModal = ErrorModal({
            title: "Erro ao Cancelar",
            message: "Não foi possível cancelar o pedido.",
            type: "error",
            details: [error.message || "Erro desconhecido"]
          });
          document.body.appendChild(errModal);
        }
      };
      
      confirmModal.querySelector(".error-modal-content")?.appendChild(confirmBtn);
    };
    
  } catch (error: any) {
    div.innerHTML = `<p style="color: var(--error);">Erro ao carregar perfil: ${error.message}</p>`;
    if (error.message.includes("token") || error.message.includes("401") || error.message.includes("not found")) {
      setTimeout(() => window.navigate("/login"), 2000);
    }
  }

  return div;
};
