import { CartService } from "../services/cart.service.js";
import { api } from "../../../shared/http/api.js";
import { SaleService } from "../services/sale.service.js";
import { CreateSaleDTO, SaleItem } from "../../../shared/types.js";
import { BalanceService } from "../services/balance.service.js";
import { AddBalanceModal } from "../components/add-balance-modal.js";
import { OrderReceiptModal } from "../components/order-receipt-modal.js";
import { ErrorModal } from "../../../shared/components/error-modal.js";

export const CartPage = (): HTMLElement => {
  const div = document.createElement("div");

  // State for Admin POS
  let allCustomers: any[] = [];
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdminOrAttendant =
    user &&
    (user.role === "admin" ||
      user.role === "manager" ||
      user.role === "attendant");

  const render = () => {
    const cart = CartService.getCart();
    const hasPrescriptionItems = cart.some(
      (item) => item.product.requires_prescription,
    );
    const total = CartService.getTotal();
    const balance = BalanceService.getBalance();

    // Customer Select & Payment Logic (Only for Admins)
    let customerSelectHtml = "";
    let paymentSelectHtml = "";
    if (isAdminOrAttendant) {
      customerSelectHtml = `
            <div style="margin-bottom: 0.5rem;">
                <label style="display: block; margin-bottom: 0.5rem;">👤 Selecione o Cliente (Admin)</label>
                <select id="admin-customer-select" class="input-field" style="background: white;">
                    <option value="${user.id}">Eu mesmo (${user.name})</option>
                    ${allCustomers.map((c) => `<option value="${c.id}">${c.name} (CPF: ${c.cpf})</option>`).join("")}
                </select>
            </div>
        `;
      paymentSelectHtml = `
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem;">💰 Método de Pagamento (PDV)</label>
                <select name="payment_method" id="admin-payment-method" class="input-field" style="background: white;">
                    <option value="cash">Dinheiro</option>
                    <option value="debit">Cartão de Débito</option>
                    <option value="credit">Cartão de Crédito</option>
                    <option value="pix">Pix</option>
                </select>
            </div>
        `;
    }

    div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 style="color: var(--primary); margin: 0;">🛒 Carrinho</h2>
                <div style="display: flex; align-items: center; gap: 1rem; background: var(--surface); padding: 1rem 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);">
                    <div style="text-align: right;">
                        <p style="margin: 0; font-size: 0.875rem; color: var(--text-muted);">Saldo Disponível</p>
                        <p style="margin: 0; font-size: 1.5rem; font-weight: 700; color: var(--success);">R$ ${balance.toFixed(2)}</p>
                    </div>
                    <button id="add-balance-btn" class="btn btn-primary" style="padding: 0.5rem 1rem;">
                        ➕ Adicionar
                    </button>
                </div>
            </div>
            
            ${
              cart.length === 0
                ? "<p>Seu carrinho está vazio.</p>"
                : `
                <div style="background: var(--surface); border-radius: var(--radius-md); padding: 1.5rem; box-shadow: var(--shadow-sm);">
                    ${cart
                      .map(
                        (item) => `
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding: 1rem 0;">
                            <div>
                                <h4 style="margin-bottom: 0.5rem;">${item.product.name}</h4>
                                <p style="color: var(--text-muted);">R$ ${item.product.price.toFixed(2)} x ${item.quantity}</p>
                                ${item.product.requires_prescription ? '<span style="color: var(--error); font-size: 0.8rem;">*Requer Receita</span>' : ""}
                            </div>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <input type="number" min="1" max="${item.product.quantity}" value="${item.quantity}" 
                                       onchange="window.updateCartItem(${item.product.id}, this.value)"
                                       style="width: 60px; padding: 5px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
                                <span style="font-size: 0.8rem; color: #777;">(Max: ${item.product.quantity})</span>
                                <button class="btn btn-secondary" onclick="window.removeCartItem(${item.product.id})" style="color: var(--error); border-color: var(--error);">Remover</button>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                    
                    <div style="margin-top: 1.5rem; text-align: right;">
                        <div style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">
                            Total: R$ ${total.toFixed(2)}
                        </div>
                         ${
                           !isAdminOrAttendant && balance < total
                             ? `
                            <div style="background: #fee; color: var(--error); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.875rem; margin-top: 1rem; border-left: 4px solid var(--error);">
                                ⚠️ Saldo insuficiente! Adicione R$ ${(total - balance).toFixed(2)} para completar o pedido.
                            </div>
                        `
                             : ""
                         }
                         ${
                           !isAdminOrAttendant && balance >= total
                             ? `
                            <div style="background: #efe; color: var(--success); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.875rem; margin-top: 1rem; border-left: 4px solid var(--success);">
                                ✅ Saldo suficiente! Você pode finalizar o pedido.
                            </div>
                        `
                             : ""
                         }
                    </div>
                </div>

                <div style="margin-top: 2rem; background: var(--surface); padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                    <h3 style="margin-bottom: 1rem;">Finalizar Pedido</h3>
                    
                    <form id="checkout-form">
                         ${
                           isAdminOrAttendant
                             ? `
                            <div style="background: #e3f2fd; padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; border-left: 4px solid #2196f3;">
                                <h4 style="color: #1565c0; margin-bottom: 1rem;">🛒 Área do Atendente (PDV)</h4>
                                ${customerSelectHtml}
                                ${paymentSelectHtml}
                            </div>
                         `
                             : ""
                         }

                         <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem;">Tipo de Entrega</label>
                            <select name="type" class="input-field" required id="delivery-type">
                                <option value="delivery">Entrega</option>
                                <option value="pickup">Retirada</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 1rem;" id="address-group">
                            <label style="display: block; margin-bottom: 0.5rem;">Endereço de Entrega</label>
                            <input type="text" name="delivery_address" class="input-field" placeholder="Rua, Número, Bairro...">
                        </div>
                        
                        ${
                          hasPrescriptionItems
                            ? `
                            <div style="border: 1px dashed var(--error); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
                                <h4 style="color: var(--error); margin-bottom: 0.5rem;">Dados da Receita Obrigatórios</h4>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    <div>
                                        <label style="display: block; margin-bottom: 0.5rem;">CRM do Médico</label>
                                        <input type="text" name="doctor_crm" class="input-field" required placeholder="Ex: 12345/SP" 
                                               value="${CartService.getPrescriptionData()?.crm || ""}">
                                    </div>
                                    <div>
                                        <label style="display: block; margin-bottom: 0.5rem;">Data da Receita</label>
                                        <input type="date" name="prescription_date" class="input-field" required
                                               value="${CartService.getPrescriptionData()?.date || ""}">
                                    </div>
                                </div>
                            </div>
                        `
                            : ""
                        }
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Confirmar Pedido</button>
                    </form>
                </div>
            `
            }
        `;

    // Event listener para o botão de adicionar saldo
    const addBalanceBtn = div.querySelector("#add-balance-btn");
    if (addBalanceBtn) {
      addBalanceBtn.addEventListener("click", () => {
        const modal = AddBalanceModal(() => {
          render(); // Re-renderiza a página para atualizar o saldo
        });
        document.body.appendChild(modal);
      });
    }

    if (cart.length > 0) {
      window.updateCartItem = (id: number, qty: string) => {
        CartService.updateQuantity(id, parseInt(qty));
        render();
      };
      window.removeCartItem = (id: number) => {
        CartService.removeFromCart(id);
        render();
      };

      const typeSelect = div.querySelector(
        "#delivery-type",
      ) as HTMLSelectElement;
      const addressGroup = div.querySelector("#address-group") as HTMLElement;

      if (typeSelect && addressGroup) {
        typeSelect.addEventListener("change", (e) => {
          const target = e.target as HTMLSelectElement;
          addressGroup.style.display =
            target.value === "delivery" ? "block" : "none";
        });
      }

      const checkoutForm = div.querySelector("#checkout-form");
      if (checkoutForm) {
        checkoutForm.addEventListener("submit", async (e: any) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const type = formData.get("type") as string;
          const delivery_address = formData.get("delivery_address") as string;

          const rawData = Object.fromEntries(formData.entries());

          if (type === "delivery" && !delivery_address) {
            const errorModal = ErrorModal({
              title: "Endereço Não Informado",
              message: "Para entregas, é necessário informar o endereço completo.",
              type: "warning",
              details: ["Por favor, preencha o campo de endereço de entrega"]
            });
            document.body.appendChild(errorModal);
            return;
          }
          // Verificar se há saldo suficiente
                    const total = CartService.getTotal();
                    const currentBalance = BalanceService.getBalance();
                    if (!BalanceService.hasSufficientBalance(total)) {
                      const missing = total - currentBalance;
                      const errorModal = ErrorModal({
                        title: "Saldo Insuficiente",
                        message: "Você não possui saldo suficiente para completar este pedido.",
                        type: "error",
                        details: [
                          `Saldo atual: R$ ${currentBalance.toFixed(2)}`,
                          `Valor do pedido: R$ ${total.toFixed(2)}`,
                          `Faltam: R$ ${missing.toFixed(2)}`,
                          "Clique no botão 'Adicionar' para adicionar saldo"
                        ]
                      });
                      document.body.appendChild(errorModal);
                      return;
                    }

          try {
            if (!user) {
              alert("Usuário não autenticado.");
              return;
            }

            // Logic to determine customer_id
            let customerId = user.id;
            let paymentMethod = "balance"; // default for customers

            // If Admin/Attendant, try to get from dropdown
            if (isAdminOrAttendant) {
              const selectEl = document.getElementById(
                "admin-customer-select",
              ) as HTMLSelectElement;
              if (selectEl && selectEl.value) {
                customerId = parseInt(selectEl.value);
              }

              const payEl = document.getElementById(
                "admin-payment-method",
              ) as HTMLSelectElement;
              if (payEl) paymentMethod = payEl.value;
            } else {
              // Standard user flow: Lookup customer attached to user
              try {
                const customers = await SaleService.getCustomers();
                const foundCustomer = customers.find(
                  (c) => c.user_id === user.id || c.email === user.email,
                );
                if (foundCustomer) {
                  customerId = foundCustomer.id;
                } else {
                  console.warn(
                    "Customer record not found for user. Using User ID as fallback.",
                    user.id,
                  );
                }
              } catch (e) {
                console.error("Failed to lookup customer for standard user", e);
              }
            }

            const items: SaleItem[] = cart.map((item) => ({
              medicine_id: item.product.id,
              quantity: item.quantity,
            }));

            const saleData: CreateSaleDTO = {
              customer_id: customerId,
              branch_id: 1, // Default branch ID to satisfy backend constraint
              items: items,
            };

            if (hasPrescriptionItems) {
              saleData.doctor_crm = rawData.doctor_crm as string;
              saleData.prescription_date = rawData.prescription_date as string;
            }

            console.log("Sending Sale Data:", saleData);


            await SaleService.createSale(saleData);
            // Deduzir o saldo após a confirmação da venda
            BalanceService.deductBalance(total);
            const newBalance = BalanceService.getBalance();

            // Generate order number and date
            const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
            const orderDate = new Date().toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            // Prepare items for receipt
            const receiptItems = cart.map(item => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price
            }));

            // Clear cart before showing modal
            CartService.clearCart();

            // Show receipt modal
            const receiptModal = OrderReceiptModal({
              total,
              newBalance,
              items: receiptItems,
              orderNumber,
              date: orderDate
            });
            document.body.appendChild(receiptModal);
          } catch (error: any) {
            console.error(error);
            const errorModal = ErrorModal({
              title: "Erro ao Finalizar Pedido",
              message: "Não foi possível processar seu pedido. Por favor, tente novamente.",
              type: "error",
              details: [error.message || "Erro desconhecido"]
            });
            document.body.appendChild(errorModal);
          }
        });
      }
    }
  };

  // Init - Fetch Customers if Admin
  if (isAdminOrAttendant) {
    SaleService.getCustomers()
      .then((customers) => {
        allCustomers = customers;
        render(); // Re-render with customer list
      })
      .catch((err) => console.error("Failed to load customers for POS", err));
  }

  render();
  return div;
};
