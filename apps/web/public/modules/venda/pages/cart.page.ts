import { CartService } from "../services/cart.service.js";
import { api } from "../../../shared/http/api.js";
import { SaleService } from "../services/sale.service.js";
import { UserService } from "../../admin/services/user.service.js";
import { CreateSaleDTO, SaleItem, User } from "../../../shared/types.js";
import { AddBalanceModal } from "../components/add-balance-modal.js";
import { OrderReceiptModal } from "../components/order-receipt-modal.js";
import { ErrorModal } from "../../../shared/components/error-modal.js";
import { SuccessModal } from "../../../shared/components/success-modal.js";

export const CartPage = async (): Promise<HTMLElement> => {
  const container = document.createElement("div");
  container.className = "container fade-in";
  container.style.paddingBlock = "2rem";

  // Inicialização de Estado (Administrador / PDV)
  let allUsers: User[] = [];
  let selectedUserBalance = 0; // Balance do usuário selecionado (inicia zerado)
  
  // Helper para atualizar dados do usuário
  const refreshUserData = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        const parsed = JSON.parse(storedUser);
         if (!['ADMIN', 'MANAGER', 'ATTENDANT'].includes(parsed.role)) {
            try {
                const fresh = await api.get<any>(`/users/${parsed.id}`);
                if (fresh) {
                     const updated = { ...parsed, ...fresh };
                     localStorage.setItem("user", JSON.stringify(updated));
                     return updated;
                }
            } catch (e) {
                console.warn("Falha ao atualizar dados do usuário:", e);
            }
        }
        return parsed;
    }
    return null;
  };

  const render = async () => {
    // Sync user data first
    const user = await refreshUserData();
    
    const cart = CartService.getCart();
    const isAdminOrAttendant =
      user &&
      (user.role === "ADMIN" ||
        user.role === "MANAGER" ||
        user.role === "ATTENDANT");
    
    // Calcula totais
    const total = CartService.getTotal();
    // Para admin, usar o saldo do usuário selecionado (começa zerado)
    const balance = isAdminOrAttendant ? selectedUserBalance : (user ? (Number(user.balance) || 0) : 0);
    const hasPrescriptionItems = cart.some(item => item.product.requires_prescription);

    // HTML para Seleção de Cliente e Pagamento (PDV)
    let adminPanelHtml = "";
    if (isAdminOrAttendant) {
      adminPanelHtml = `
            <div class="card" style="margin-bottom: 2rem; border-left: 4px solid var(--secondary); background: #f8faff;">
                <h3 style="color: var(--secondary); margin-bottom: 1rem; font-size: 1.1rem; font-weight: 700;">
                    <span class="material-symbols-outlined" style="vertical-align: middle;">point_of_sale</span> PDV / Atendimento
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem;">
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 600;">Cliente</label>
                        <select id="admin-customer-select" class="input-field" style="background: white;">
                            <option value="">Selecione um cliente...</option>
                            ${allUsers.map((u) => `<option value="${u.id}">${u.name} (${u.email})</option>`).join("")}
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 600;">Saldo do Cliente</label>
                        <div style="
                            display: flex;
                            align-items: center;
                            padding: 0.75rem 1rem;
                            background: white;
                            border: 1px solid var(--border);
                            border-radius: var(--radius-sm);
                            font-weight: 700;
                            font-size: 1rem;
                            color: var(--primary);
                        ">
                            R$ <span id="selected-user-balance">${selectedUserBalance.toFixed(2)}</span>
                        </div>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 600;">Forma de Pagamento</label>
                        <select name="payment_method" id="admin-payment-method" class="input-field" style="background: white;">
                            <option value="balance">Saldo</option>
                            <option value="cash">Dinheiro</option>
                            <option value="debit">Cartão de Débito</option>
                            <option value="credit">Cartão de Crédito</option>
                            <option value="pix">Pix</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    // Estrutura Principal
    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
             <h2 style="font-size: 2rem; color: var(--text-main);">Seu Carrinho</h2>
             
             <!-- Saldo (Card Pequeno) -->
             <div style="
                background: var(--surface); 
                padding: 0.75rem 1.5rem; 
                border-radius: 99px; 
                box-shadow: var(--shadow-sm); 
                display: flex; 
                align-items: center; 
                gap: 1rem;
                border: 1px solid var(--border);
             ">
                <div style="text-align: right;">
                    <span style="display: block; font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">${isAdminOrAttendant ? 'SALDO DO CLIENTE' : 'SEU SALDO'}</span>
                    <span style="display: block; font-size: 1.1rem; font-weight: 700; color: ${balance >= total ? 'var(--success)' : 'var(--error)'};">R$ ${balance.toFixed(2)}</span>
                </div>
                ${!isAdminOrAttendant ? `<button id="add-balance-btn" style="
                    background: var(--primary); 
                    color: white; 
                    border: none; 
                    width: 32px; height: 32px; 
                    border-radius: 50%; 
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <span class="material-symbols-outlined" style="font-size: 1.2rem;">add</span>
                </button>` : ''}
             </div>
        </div>

        ${adminPanelHtml}

        ${cart.length === 0 ? `
            <div style="text-align: center; padding: 4rem; background: var(--surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                <span class="material-symbols-outlined" style="font-size: 5rem; color: var(--border); margin-bottom: 1.5rem;">shopping_cart_off</span>
                <p style="font-size: 1.25rem; font-weight: 600; color: var(--text-muted);">Seu carrinho está vazio</p>
                <button class="btn btn-primary" onclick="window.navigate('/server07/products')" style="margin-top: 2rem;">
                    Navegar nos Produtos
                </button>
            </div>
        ` : `
            <div style="display: grid; grid-template-columns: 1fr 350px; gap: 2rem; align-items: start;">
                
                <!-- Lista de Itens -->
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${cart.map(item => `
                        <div class="card" style="flex-direction: row; align-items: center; padding: 1.5rem; gap: 1.5rem;">
                            <img src="${item.product.image_url || '/server07/assets/placeholder.png'}" 
                                 style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--border);"
                                 onerror="this.src='/server07/assets/placeholder.png'">
                            
                            <div style="flex: 1;">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                                    <h4 style="margin: 0; font-size: 1.1rem;">${item.product.name}</h4>
                                    <button onclick="window.removeCartItem(${item.product.id})" style="
                                        background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 5px;
                                    " title="Remover Item">
                                        <span class="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                                
                                <div style="display: flex; align-items: center; justify-content: space-between;">
                                    <div>
                                        <p style="margin: 0; font-weight: 700; color: var(--brand-dark);">R$ ${item.product.price.toFixed(2)}</p>
                                        ${item.product.requires_prescription ? `
                                            <span style="font-size: 0.75rem; color: var(--error); font-weight: 600; display: flex; align-items: center; gap: 4px; margin-top: 4px;">
                                                <span class="material-symbols-outlined" style="font-size: 1rem;">prescriptions</span> Receita
                                            </span>
                                        ` : ''}
                                    </div>

                                    <div style="display: flex; align-items: center; gap: 10px; background: var(--background); padding: 5px 10px; border-radius: 99px; border: 1px solid var(--border);">
                                        <button onclick="window.updateCartItem(${item.product.id}, ${Math.max(1, item.quantity - 1)})"
                                            style="background: none; border: none; cursor: pointer; color: var(--primary); font-weight: bold;">-</button>
                                        <span style="font-weight: 600; width: 20px; text-align: center;">${item.quantity}</span>
                                        <button onclick="window.updateCartItem(${item.product.id}, ${Math.min(item.product.quantity || 99, item.quantity + 1)})"
                                            style="background: none; border: none; cursor: pointer; color: var(--primary); font-weight: bold;">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Resumo do Pedido -->
                <div class="card" style="position: sticky; top: 100px;">
                    <h3 style="margin-bottom: 1.5rem; font-size: 1.25rem;">Resumo do Pedido</h3>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.95rem;">
                        <span style="color: var(--text-muted);">Subtotal (${cart.length} itens)</span>
                        <span>R$ ${total.toFixed(2)}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; font-size: 1.25rem; font-weight: 700; border-top: 1px solid var(--border); padding-top: 1rem;">
                        <span>Total</span>
                        <span style="color: var(--brand-dark);">R$ ${total.toFixed(2)}</span>
                    </div>

                    ${(!isAdminOrAttendant && balance < total) ? `
                        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; color: #b91c1c; font-size: 0.9rem;">
                            <strong>Saldo Insuficiente</strong>
                            <p style="margin-top: 0.5rem;">Faltam R$ ${(total - balance).toFixed(2)} para completar o pagamento.</p>
                        </div>
                    ` : ''}

                    <form id="checkout-form">
                        <div style="margin-bottom: 1.25rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">Forma de Entrega</label>
                            <div style="display: flex; gap: 1rem;">
                                <label style="flex: 1; cursor: pointer;">
                                    <input type="radio" name="delivery-type" value="pickup" checked style="margin-right: 5px;"> 
                                    Retirada
                                </label>
                                <label style="flex: 1; cursor: pointer;">
                                    <input type="radio" name="delivery-type" value="delivery" style="margin-right: 5px;"> 
                                    Entrega
                                </label>
                            </div>
                        </div>

                        <div id="address-input-group" style="margin-bottom: 1.5rem; display: none;">
                             <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">Endereço</label>
                             <input type="text" name="delivery_address" class="input-field" placeholder="Digite seu endereço...">
                        </div>

                        ${hasPrescriptionItems ? `
                            <div style="margin-bottom: 1.5rem; padding: 1rem; background: #fff7ed; border: 1px solid #fed7aa; border-radius: var(--radius-sm);">
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 700; color: #9a3412; font-size: 0.85rem;">DADOS DA RECEITA (OBRIGATÓRIO)</label>
                                <div style="display: grid; gap: 10px;">
                                    <input type="text" name="doctor_crm" class="input-field" placeholder="CRM Médico" required value="${CartService.getPrescriptionData()?.crm || ''}">
                                    <input type="date" name="prescription_date" class="input-field" required value="${CartService.getPrescriptionData()?.date || ''}">
                                </div>
                            </div>
                        ` : ''}

                        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; font-size: 1.1rem; padding: 1rem;" 
                            ${(!isAdminOrAttendant && balance < total) ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                            Finalizar Compra
                        </button>
                    </form>
                </div>
            </div>
        `}
    `;

    // --- EVENT LISTENERS E LÓGICA ---
    
    // Admin User Selection - Load user balance
    if (isAdminOrAttendant) {
        const userSelect = container.querySelector("#admin-customer-select") as HTMLSelectElement;
        if (userSelect) {
            userSelect.addEventListener("change", async (e) => {
                const userId = (e.target as HTMLSelectElement).value;
                if (userId) {
                    try {
                        const selectedUser = await UserService.getById(parseInt(userId));
                        selectedUserBalance = selectedUser.balance || 0;
                        const balanceDisplay = container.querySelector("#selected-user-balance");
                        if (balanceDisplay) {
                            balanceDisplay.textContent = selectedUserBalance.toFixed(2);
                        }
                        render(); // Re-render para atualizar o saldo mostrado
                    } catch (err: any) {
                        console.error("Erro ao carregar usuário:", err);
                        alert("Erro ao carregar dados do cliente");
                    }
                } else {
                    selectedUserBalance = 0;
                    const balanceDisplay = container.querySelector("#selected-user-balance");
                    if (balanceDisplay) {
                        balanceDisplay.textContent = "0.00";
                    }
                    render();
                }
            });
        }
    }
    
    // Toggle Address Input
    const radios = container.querySelectorAll('input[name="delivery-type"]');
    const addrGroup = container.querySelector("#address-input-group") as HTMLElement;
    radios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const val = (e.target as HTMLInputElement).value;
            if(addrGroup) addrGroup.style.display = val === 'delivery' ? 'block' : 'none';
        });
    });

    // Add Balance Logic
    container.querySelector("#add-balance-btn")?.addEventListener("click", () => {
        const modal = AddBalanceModal(() => render()); // Re-render on success
        document.body.appendChild(modal);
    });

    // Global Functions for Cart Actions
    (window as any).updateCartItem = (id: number, quantity: number) => {
        const safeQty = Math.max(1, quantity);
        CartService.updateQuantity(id, safeQty);
        render(); // Re-render whole cart
    };
    
    (window as any).removeCartItem = (id: number) => {
        CartService.removeFromCart(id);
        render();
    };

    // Checkout Submit
    container.querySelector("#checkout-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        
        // Validações básicas
        const deliveryType = document.querySelector('input[name="delivery-type"]:checked') as HTMLInputElement;
        const address = formData.get("delivery_address");
        
        if (deliveryType.value === "delivery" && !address) {
            document.body.appendChild(ErrorModal({ title: "Endereço", message: "Informe o endereço para entrega." }));
            return;
        }

        const total = CartService.getTotal();
        
        // DEBUGGING LOGS


        if (!isAdminOrAttendant && balance < total) {
             const msg = `Saldo Insuficiente. Saldo: ${balance}, Total: ${total}`;
             console.warn(msg);
             document.body.appendChild(ErrorModal({ title: "Saldo Insuficiente", message: "Recarregue sua conta para prosseguir." }));
             return;
        }

        try {

            // Preparar Sale Data
            let userId = user.id;
            
            // PDV Override - usar o usuário selecionado
            if (isAdminOrAttendant) {
                const select = document.getElementById("admin-customer-select") as HTMLSelectElement;
                if(select && select.value) {
                    userId = Number(select.value);
                } else {
                    alert("Por favor, selecione um cliente para finalizar a venda.");
                    return;
                }
            }

            const items: SaleItem[] = cart.map(i => ({ medicine_id: i.product.id, quantity: i.quantity }));
            
            const saleData: CreateSaleDTO = {
                user_id: userId,
                items: items
            };



            if (hasPrescriptionItems) {
                saleData.doctor_crm = formData.get("doctor_crm") as string;
                saleData.prescription_date = formData.get("prescription_date") as string;
            }

            await SaleService.createSale(saleData);

            // Sucesso!
            CartService.clearCart();
            document.body.appendChild(SuccessModal({ title: "Sucesso!", message: "Pedido realizado." }));
            setTimeout(() => {
                window.navigate('/server07/profile'); // Reload to refresh balance and orders everywhere
            }, 2000);

        } catch (err: any) {
            console.error(err);
            document.body.appendChild(ErrorModal({ title: "Erro", message: err.message || "Erro ao processar pedido." }));
        }
    });
  };

  // Setup Inicial de Dados (Se Admin)
  const initUserStr = localStorage.getItem("user");
  const initUser = initUserStr ? JSON.parse(initUserStr) : null;
  const initIsAdmin = initUser && ['ADMIN', 'MANAGER', 'ATTENDANT'].includes(initUser.role);

  if (initIsAdmin) {
    try {
      // Carregar lista de usuários para PDV
      allUsers = await UserService.getAll();
    } catch (e) { console.error("Erro carregando usuários", e); }
  }

  // Refresh User Balance if Customer
  if (initUser && !initIsAdmin) {
     try {
         const fresh = await api.get(`/users/${initUser.id}`);
         if(fresh) localStorage.setItem("user", JSON.stringify({ ...initUser, ...fresh }));
     } catch(e) {}
  }

  render(); // Primeira renderização
  return container;
};
