import { api } from "../../../shared/http/api.js";
import { User, Order } from "../../../shared/types.js";
import { SuccessModal } from "../../../shared/components/success-modal.js";
import { ErrorModal } from "../../../shared/components/error-modal.js";
import { AddBalanceModal } from "../../venda/components/add-balance-modal.js";

/**
 * Página de Perfil do Utilizador
 * Responsável por exibir dados pessoais, saldo, estatísticas e histórico de compras.
 * Refatorada para novo design system.
 */
export const ProfilePage = async (): Promise<HTMLElement> => {
  const container = document.createElement("div");
  container.className = "container fade-in";
  container.style.marginTop = "2rem";
  container.style.marginBottom = "4rem";

  // Loading State
  container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; color: var(--text-muted);">
            <span class="material-symbols-outlined" style="font-size: 3rem; margin-bottom: 1rem; animation: spin 1s linear infinite;">progress_activity</span>
            <p>Carregando seu perfil...</p>
        </div>
  `;

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

    // 2. Busca de Pedidos
    let orders: Order[] = [];
    try {
      const allSales = await api.get<Order[]>("/sales");
      
      orders = allSales
        .filter(sale => String(sale.user_id) === String(user.id))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    } catch (error) {
      console.error("Erro ao procurar pedidos:", error);
    }
    
    // Estatísticas
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
    const pharmacyData = user.role === 'ADMIN' ? {
      name: "Farmácia Popular Central",
      cnpj: "12.345.678/0001-90",
      totalSales: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + (Number(o.total_value) || 0), 0)
    } : null;

    // 3. Renderização
    // Layout Grid Responsivo
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            
            <!-- COLUNA ESQUERDA: Resumo do Usuário -->
            <aside style="display: flex; flex-direction: column; gap: 1.5rem;">
                
                <!-- CARD DE USUÁRIO -->
                <div class="card" style="background: linear-gradient(135deg, var(--brand-dark), var(--primary)); color: white; border: none;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                        <div style="
                            width: 80px; height: 80px; 
                            background: rgba(255,255,255,0.2); 
                            border-radius: 50%; 
                            display: flex; align-items: center; justify-content: center; 
                            font-size: 2.5rem;
                            border: 2px solid rgba(255,255,255,0.4);
                        ">
                            ${user.role === 'ADMIN' ? '👨‍💼' : '👤'}
                        </div>
                        <div>
                            <h2 style="margin: 0; font-size: 1.5rem;">${user.name}</h2>
                            <p style="margin: 0; opacity: 0.9; font-size: 0.9rem;">${user.email}</p>
                            <span style="
                                display: inline-block;
                                margin-top: 0.5rem;
                                padding: 0.25rem 0.75rem;
                                background: rgba(255,255,255,0.25);
                                border-radius: 20px;
                                font-size: 0.75rem;
                                font-weight: 700;
                            ">
                                ${user.role === 'ADMIN' ? 'ADMINISTRADOR' : 'CLIENTE VIP'}
                            </span>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">
                            <span style="font-size: 0.8rem; text-transform: uppercase; opacity: 0.8;">Seu Saldo</span>
                            <strong style="display: block; font-size: 1.25rem; margin-top: 0.25rem;" id="user-balance-display">
                                R$ ${balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                            </strong>
                            <button id="add-balance-btn" style="
                                margin-top: 0.5rem;
                                background: white;
                                color: var(--brand-dark);
                                border: none;
                                padding: 4px 12px;
                                border-radius: 4px;
                                font-size: 0.7rem;
                                font-weight: 700;
                                cursor: pointer;
                                width: 100%;
                            ">RECARREGAR</button>
                        </div>
                        <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: var(--radius-sm); text-align: center;">
                            <span style="font-size: 0.8rem; text-transform: uppercase; opacity: 0.8;">Total Gasto</span>
                            <strong style="display: block; font-size: 1.25rem; margin-top: 0.25rem;">
                                R$ ${totalSpent.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                            </strong>
                        </div>
                    </div>
                </div>

                <!-- CARD DA FARMÁCIA (ADMIN ONLY) -->
                ${pharmacyData ? `
                    <div class="card" style="border-left: 4px solid var(--secondary);">
                        <h3 style="font-size: 1.1rem; color: var(--secondary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            <span class="material-symbols-outlined">dataset</span> Gestão da Farmácia
                        </h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <small style="color: var(--text-muted); font-size: 0.75rem; font-weight: 700;">VENDAS TOTAIS</small>
                                <p style="font-size: 1.2rem; font-weight: 700;">${pharmacyData.totalSales}</p>
                            </div>
                            <div>
                                <small style="color: var(--text-muted); font-size: 0.75rem; font-weight: 700;">RECEITA TOTAL</small>
                                <p style="font-size: 1.2rem; font-weight: 700;">R$ ${pharmacyData.totalRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- FORMULÁRIO DE DADOS -->
                <div class="card">
                    <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span class="material-symbols-outlined">edit_note</span> Meus Dados
                    </h3>
                    <form id="profile-form">
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600;">Telefone</label>
                            <input type="text" name="phone" value="${user.phone || ''}" class="input-field" placeholder="(00) 00000-0000">
                        </div>
                        <div style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 600;">Endereço Completo</label>
                            <textarea name="address" class="input-field" rows="3" placeholder="Rua, Número, Bairro, Cidade...">${user.address || ''}</textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Salvar Alterações</button>
                    </form>
                </div>

            </aside>

            <!-- COLUNA DIREITA: Histórico -->
            <main>
                <div class="card">
                    <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span class="material-symbols-outlined">history</span> Histórico de Pedidos
                    </h3>

                    ${orders.length === 0 ? `
                        <div style="text-align: center; padding: 4rem 2rem; color: var(--text-muted); border: 2px dashed var(--border); border-radius: var(--radius-md);">
                            <span class="material-symbols-outlined" style="font-size: 4rem; opacity: 0.2; margin-bottom: 1rem;">shopping_bag</span>
                            <p style="font-weight: 600; font-size: 1.1rem;">Nenhum pedido encontrado</p>
                            <p style="font-size: 0.9rem;">Seus pedidos aparecerão aqui assim que você fizer sua primeira compra.</p>
                            <button class="btn btn-primary" onclick="window.navigate('/server07/products')" style="margin-top: 1.5rem;">
                                Ir para Loja
                            </button>
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            ${orders.map(order => {
                                const statusColors: any = {
                                    'confirmed': 'var(--success)',
                                    'cancelled': 'var(--error)',
                                    'pending': '#f59e0b'
                                };
                                const statusLabels: any = {
                                    'confirmed': 'Confirmado',
                                    'cancelled': 'Cancelado',
                                    'pending': 'Pendente'
                                };
                                const statusKey = order.status || 'pending';
                                const color = statusColors[statusKey] || '#999';
                                const label = statusLabels[statusKey] || statusKey;
                                const date = new Date(order.created_at);

                                return `
                                    <div id="order-card-${order.id}" style="
                                        border: 1px solid var(--border); 
                                        border-radius: var(--radius-sm); 
                                        padding: 1.25rem;
                                        transition: border-color 0.2s;
                                    " onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">
                                        
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                            <div>
                                                <span style="font-weight: 700; font-size: 1.1rem;">Pedido #${order.id}</span>
                                                <div style="font-size: 0.8rem; color: var(--text-muted);">
                                                    ${date.toLocaleDateString()} às ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                            <span style="
                                                background: ${color}20; 
                                                color: ${color}; 
                                                padding: 0.25rem 0.75rem; 
                                                border-radius: 99px; 
                                                font-size: 0.8rem; 
                                                font-weight: 700;
                                                border: 1px solid ${color};
                                            ">${label}</span>
                                        </div>

                                        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                                            <div>
                                                ${order.doctor_crm ? `
                                                    <div style="display: flex; align-items: center; gap: 0.25rem; color: var(--error); font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;">
                                                        <span class="material-symbols-outlined" style="font-size: 1rem;">prescriptions</span>
                                                        Receita: ${order.doctor_crm}
                                                    </div>
                                                ` : ''}
                                                <span style="font-size: 0.9rem; color: var(--text-muted);">Total do Pedido</span>
                                            </div>
                                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);">
                                                R$ ${(Number(order.total_value)).toLocaleString('pt-BR', {minimumFractionDigits:2})}
                                            </div>
                                        </div>

                                        ${statusKey === 'pending' ? `
                                            <button class="btn" onclick="window.profileCancelOrder(${order.id})" style="
                                                width: 100%; 
                                                margin-top: 1rem; 
                                                border: 1px solid var(--error); 
                                                color: var(--error); 
                                                font-size: 0.8rem;
                                                padding: 0.5rem;
                                                background: transparent;
                                            " onmouseover="this.style.background='var(--error)'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='var(--error)'">
                                                Cancelar Pedido
                                            </button>
                                        ` : ''}

                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>
            </main>
        </div>
    `;

    // 4. Lógica de Eventos
    
    // Add Balance
    container.querySelector("#add-balance-btn")?.addEventListener("click", () => {
      const modal = AddBalanceModal(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            user.balance = parsedUser.balance;
            const balanceDisplay = document.getElementById("user-balance-display");
            if (balanceDisplay) {
                balanceDisplay.textContent = `R$ ${Number(user.balance).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
            }
        }
      });
      document.body.appendChild(modal);
    });

    // Profile Form
    container.querySelector("#profile-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = (e.target as HTMLFormElement).querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = btn.textContent;
      btn.textContent = "Salvando...";
      btn.disabled = true;

      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      try {
        if (!user.id) throw new Error("ID do usuário inválido.");
        await api.put(`/users/${user.id}`, data);
        
        const updatedUser = { ...user, ...data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        document.body.appendChild(SuccessModal({ 
          title: "Perfil Atualizado", 
          message: "Suas informações foram salvas com sucesso." 
        }));
        
        setTimeout(() => window.location.reload(), 1500);
      } catch (err: any) {
        btn.textContent = originalText;
        btn.disabled = false;
        document.body.appendChild(ErrorModal({ 
          title: "Erro ao Atualizar", 
          message: err.message || "A API retornou um erro ao tentar salvar os dados." 
        }));
      }
    });

    // Função de Cancelamento Global (Anexada ao Window)
    (window as any).profileCancelOrder = async (id: number) => {
      const confirmModal = ErrorModal({
        title: "Confirmar Cancelamento",
        message: "Deseja realmente cancelar este pedido?",
        type: "warning"
      });
      
      // Customizando o Modal de Erro para ser um Confirm
      const content = confirmModal.querySelector('.error-modal-content');
      if(content) {
          // Remove o botão padrão 'Fechar' se existir e adiciona os nossos
          const existingBtn = content.querySelector('button');
          if(existingBtn) existingBtn.remove();
          
          const actions = document.createElement('div');
          actions.style.cssText = "display: flex; gap: 1rem; margin-top: 1.5rem;";
          
          const title = content.querySelector('h3');
          if(title) title.style.color = "var(--text-main)";

          actions.innerHTML = `
            <button id="confirm-cancel" class="btn" style="flex: 1; background: var(--error); color: white;">Sim, Cancelar</button>
            <button id="abort-cancel" class="btn" style="flex: 1; border: 1px solid var(--border); color: var(--text-main);">Voltar</button>
          `;
          content.appendChild(actions);

          content.querySelector('#abort-cancel')?.addEventListener('click', () => confirmModal.remove());
          content.querySelector('#confirm-cancel')?.addEventListener('click', async () => {
             confirmModal.remove();
             try {
                await api.post(`/sales/${id}/cancel`, {});
                
                // Update UI visually without reload
                const orderCard = document.getElementById(`order-card-${id}`);
                if (orderCard) {
                    // Update Badge
                    const badge = orderCard.querySelector('span[style*="border-radius"]');
                    if (badge) {
                        badge.textContent = "Cancelado";
                        (badge as HTMLElement).style.color = "var(--error)";
                        (badge as HTMLElement).style.background = "rgba(239, 68, 68, 0.1)";
                        (badge as HTMLElement).style.borderColor = "var(--error)";
                    }
                    // Remove Cancel Button
                    const cancelBtn = orderCard.querySelector('button[onclick*="profileCancelOrder"]');
                    if (cancelBtn) cancelBtn.remove();
                }
                
                document.body.appendChild(SuccessModal({ title: "Cancelado", message: "Pedido cancelado com sucesso." }));

             } catch (error) {
                document.body.appendChild(ErrorModal({ title: "Erro", message: "Não foi possível cancelar." }));
             }
          });
      }
      
      document.body.appendChild(confirmModal);
    };

  } catch (error: any) {
     container.innerHTML = `
        <div style="
            text-align: center; 
            padding: 3rem; 
            background: #fff; 
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm);
        ">
            <h3 style="color: var(--error); margin-bottom: 1rem;">Não foi possível carregar seu perfil</h3>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">${error.message}</p>
            <button onclick="window.location.reload()" class="btn btn-primary">Tentar Novamente</button>
        </div>
     `;
  }

  return container;
};