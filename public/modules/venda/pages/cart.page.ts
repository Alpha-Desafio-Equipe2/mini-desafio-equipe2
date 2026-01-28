import { CartService } from "../services/cart.service.js";
import { api } from "../../../shared/http/api.js";
import { SaleService } from "../services/sale.service.js";
import { CreateSaleDTO, SaleItem } from "../../../shared/types.js";

export const CartPage = (): HTMLElement => {
  const div = document.createElement("div");

  const render = () => {
    const cart = CartService.getCart();
    const total = CartService.getTotal();

    div.innerHTML = `
            <h2 style="margin-bottom: 2rem; color: var(--primary);">Seu Carrinho</h2>
            
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
                            </div>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <input type="number" min="1" value="${item.quantity}" 
                                       onchange="window.updateCartItem(${item.product.id}, this.value)"
                                       style="width: 60px; padding: 5px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
                                <button class="btn btn-secondary" onclick="window.removeCartItem(${item.product.id})" style="color: var(--error); border-color: var(--error);">Remover</button>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                    
                    <div style="margin-top: 1.5rem; text-align: right; font-size: 1.2rem; font-weight: 700;">
                        Total: R$ ${total.toFixed(2)}
                    </div>
                </div>

                <div style="margin-top: 2rem; background: var(--surface); padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                    <h3 style="margin-bottom: 1rem;">Finalizar Pedido</h3>
                    <form id="checkout-form">
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
                        <button type="submit" class="btn btn-primary" style="width: 100%;">Confirmar Pedido</button>
                    </form>
                </div>
            `
            }
        `;

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

          if (type === "delivery" && !delivery_address) {
            alert("Por favor, informe o endereço de entrega.");
            return;
          }

          try {
            // Map to CreateSaleDTO structure
            // Assumes user is customer or we use a logged in customer ID.
            // The guide used customer_id in CreateSaleDTO.
            // Ensure we have a customer_id, otherwise we might fail if backend requires it.
            // For now, I'll use a mocked customer_id or try to get it from auth user if they have one.
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            const customerId = user ? user.id : 1; // Fallback to 1 if no user (dev mode)

            const items: SaleItem[] = cart.map((item) => ({
              medicine_id: item.product.id,
              quantity: item.quantity,
            }));

            const saleData: CreateSaleDTO = {
              customer_id: customerId,
              items: items,
            };
            // Adding branch_id if needed, logic for it is missing in guide but present in type

            await SaleService.createSale(saleData);

            CartService.clearCart();
            alert("Pedido realizado com sucesso!");
            window.navigate("/profile");
          } catch (error: any) {
            console.error(error);
            alert("Erro ao finalizar pedido: " + (error.message || error));
          }
        });
      }
    }
  };

  render();
  return div;
};
