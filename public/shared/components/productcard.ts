import { CartService } from "../../modules/venda/services/cart.service.js";
import { Product } from "../types.js";

export const ProductCard = (product: Product): HTMLElement => {
  const div = document.createElement("div");
  div.className = "card";

  const image =
    product.image_url || "https://via.placeholder.com/300x200?text=Produto";

  div.innerHTML = `
        <img src="${image}" alt="${product.name}" style="width:100%; height:200px; object-fit:cover; border-radius: var(--radius-sm); margin-bottom: 1rem;">
        <h3 style="margin-bottom: 0.5rem;">${product.name}</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.4; height: 40px; overflow: hidden;">${product.description || "Sem descrição"}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
             <span style="font-weight: 700; color: var(--primary); font-size: 1.2rem;">R$ ${product.price.toFixed(2)}</span>
             <span style="font-size: 0.8rem; color: ${product.quantity > 0 ? "var(--success)" : "var(--error)"}">
                ${product.quantity > 0 ? "Disponível" : "Esgotado"}
            </span>
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
    btn.onclick = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Faça login para comprar.");
        if (window.navigate) window.navigate("/login");
        return;
      }

      const qty = parseInt(input.value) || 1;
      if (qty > 0 && qty <= product.quantity) {
        CartService.addToCart(product, qty);

        toast.style.opacity = "1";
        setTimeout(() => {
          toast.style.opacity = "0";
        }, 2000);
      } else {
        alert("Quantidade inválida.");
      }
    };
  }

  return div;
};
