import { CartService } from "../../modules/venda/services/cart.service.js";
import { Product } from "../types.js";

export const ProductCard = (product: Product): HTMLElement => {
  const div = document.createElement("div");
  div.className = "card";

  const image =
    product.image_url || "https://placehold.co/300x200?text=Produto";

  div.innerHTML = `
        <div style="position: relative;">
            <img src="${image}" alt="${product.name}" style="width:100%; height:200px; object-fit:cover; border-radius: var(--radius-sm); margin-bottom: 1rem;">
            ${product.category ? `<span style="position: absolute; top: 10px; right: 10px; background: var(--primary); color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">${product.category}</span>` : ""}
        </div>
        <h3 style="margin-bottom: 0.5rem;">${product.name}</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.4; height: 40px; overflow: hidden;">${product.description || "Sem descrição"}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
             <span style="font-weight: 700; color: var(--primary); font-size: 1.2rem;">R$ ${product.price.toFixed(2)}</span>
             <div style="text-align: right;">
                <span style="font-size: 0.8rem; color: ${product.quantity > 0 ? "var(--success)" : "var(--error)"}; display: block;">
                    ${product.quantity > 0 ? "Disponível" : "Esgotado"}
                </span>
                ${product.requires_prescription ? '<span style="font-size: 0.7rem; color: var(--error); font-weight: bold; border: 1px solid var(--error); padding: 2px 4px; border-radius: 4px; margin-top: 4px; display: inline-block;">Receita Obrigatória</span>' : ""}
             </div>
        </div>

        <div style="display: flex; gap: 10px; margin-top: auto;">
            <input type="number" id="qty-${product.id}" value="1" min="1" max="${product.quantity}" 
                   style="width: 60px; padding: 5px; border-radius: var(--radius-sm); border: 1px solid var(--border);"
                   ${product.quantity <= 0 ? "disabled" : ""}>
            
            <button class="btn btn-primary" style="flex: 1;" 
                    id="add-btn-${product.id}"
                    ${product.quantity <= 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ""}>
                Adicionar
            </button>
        </div>
        <div id="toast-${product.id}" style="font-size: 0.8rem; color: var(--success); text-align: center; margin-top: 5px; opacity: 0; transition: opacity 0.3s;">
            Produto adicionado!
        </div>
    `;

  const btn = div.querySelector(`#add-btn-${product.id}`) as HTMLButtonElement;
  const input = div.querySelector(`#qty-${product.id}`) as HTMLInputElement;
  const toast = div.querySelector(`#toast-${product.id}`) as HTMLElement;

  if (btn) {
    btn.onclick = (e) => {
      e.stopPropagation(); // Prevent card click if any


      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("[ProductCard] No token found. Redirecting to login...");
        // Use standard location API as fallback
        if ((window as any).navigate) {
             (window as any).navigate("/server07/login");
        } else {
             window.location.href = "/server07/login";
        }
        return;
      }

      const qty = parseInt(input.value) || 1;

      if (qty <= 0 || qty > product.quantity) {
        alert("Quantidade inválida.");
        return;
      }

      const addToCartAction = () => {

        try {
            CartService.addToCart(product, qty);
            
            // Dispatch event for Navbar update
            window.dispatchEvent(new Event("cart-updated"));

            // Visual feedback
            toast.style.opacity = "1";
            
            // Reset quantity
            input.value = "1";

            setTimeout(() => {
              toast.style.opacity = "0";
            }, 2000);
        } catch (error) {
            console.error("[ProductCard] Error adding to cart:", error);
            alert("Erro ao adicionar ao carrinho.");
        }
      };

      if (product.requires_prescription) {
        // Create and show modal
        const modalId = `modal-presc-${product.id}`;
        const existing = document.getElementById(modalId);
        if (existing) existing.remove();

        const modalDiv = document.createElement("div");
        modalDiv.id = modalId;
        modalDiv.style.cssText =
          "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center;";

        modalDiv.innerHTML = `
            <div style="background: var(--surface); padding: 2rem; border-radius: 1rem; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                <h3 style="margin-bottom: 1rem; color: var(--error); display: flex; align-items: center; gap: 0.5rem;">
                    <span class="material-symbols-outlined">prescriptions</span> Medicamento Controlado
                </h3>
                <p style="margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.9rem;">
                    Este medicamento requer retenção de receita. Por favor, informe os dados abaixo.
                </p>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.85rem;">CRM do Médico</label>
                    <input type="text" id="m-crm-${product.id}" class="input-field" placeholder="Ex: 12345/SP">
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.85rem;">Data da Receita</label>
                    <input type="date" id="m-date-${product.id}" class="input-field">
                </div>

                <div style="display: flex; gap: 1rem;">
                    <button id="m-confirm-${product.id}" class="btn btn-primary" style="flex: 1;">Confirmar</button>
                    <button id="m-cancel-${product.id}" class="btn btn-secondary" style="flex: 1; border: 1px solid var(--border);">Cancelar</button>
                </div>
            </div>
          `;

        document.body.appendChild(modalDiv);

        const confirmBtn = document.getElementById(`m-confirm-${product.id}`);
        const cancelBtn = document.getElementById(`m-cancel-${product.id}`);

        if (confirmBtn)
          confirmBtn.onclick = () => {
            const crm = (
              document.getElementById(`m-crm-${product.id}`) as HTMLInputElement
            ).value;
            const date = (
              document.getElementById(
                `m-date-${product.id}`,
              ) as HTMLInputElement
            ).value;

            if (!crm || !date) {
              alert("Preencha todos os campos.");
              return;
            }

            const storedPrescription = CartService.getPrescriptionData();
            if (
              storedPrescription &&
              (storedPrescription.crm !== crm ||
                storedPrescription.date !== date)
            ) {
              if (
                !confirm(
                  "Você já informou uma receita diferente para outro item. Deseja usar esta nova receita para TODO o pedido?",
                )
              ) {
                return;
              }
            }

            CartService.setPrescriptionData({ crm, date }); // Store it
            addToCartAction();
            modalDiv.remove();
          };

        if (cancelBtn)
          cancelBtn.onclick = () => {
            modalDiv.remove();
          };
      } else {
        addToCartAction();
      }
    };
  }

  return div;
};
