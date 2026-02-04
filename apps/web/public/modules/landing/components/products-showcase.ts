import { MedicineService } from "../../medicamento/services/medicamento.service.js";
import { ProductCard } from "../../../shared/components/productcard.js";
import { Product } from "../../../shared/types.js";

export const ProductsShowcase = async (): Promise<HTMLElement> => {
  const section = document.createElement("section");
  section.className = "products-showcase-section";

  // HTML Structure matching the Landing Page design
  section.innerHTML = `
    <div class="products-container" data-version="3.0-component">
      <div class="products-header">
        <div>
          <h2 class="products-title">Destaques da Semana</h2>
          <p class="products-subtitle">Produtos selecionados para o seu bem-estar diário.</p>
        </div>
        <a href="/server07/products" class="link-view-all" onclick="window.navigate('/server07/products'); return false;">
          Ver todos <span class="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
      <div class="products-grid" id="landing-products-grid">
         <div style="text-align: center; grid-column: 1/-1; padding: 2rem; color: var(--text-muted);">
            <p>Carregando destaques...</p>
         </div>
      </div>
    </div>
  `;

  try {
      const medicines = await MedicineService.getAll();
      // Select top 4 items for the showcase
      const highlights = medicines.slice(0, 4);

      const grid = section.querySelector("#landing-products-grid");
      if (grid) {
          grid.innerHTML = ""; // Clear loading message
          
          highlights.forEach((med: any) => {
              // Map API data to the shared Product interface
              const product: Product = {
                  id: Number(med.id),
                  name: med.name,
                  price: Number(med.price),
                  quantity: Number(med.stock),
                  description: med.manufacturer || "FarmaPROX",
                  category: med.category,
                  image_url: med.image_url || "/server07/assets/placeholder.png",
                  requires_prescription: Boolean(med.requires_prescription || med.requiresPrescription)
              };

              // Use the shared ProductCard component
              // This component handles:
              // - Image display
              // - Price formatting
              // - Stock status
              // - "Add to Cart" logic (including login check, quantity, prescriptions)
              // - Toast feedback
              const card = ProductCard(product);
              
              // Ensure the card fits the grid layout if necessary
              card.style.height = "100%";
              
              grid.appendChild(card);
          });
      }
      
  } catch (error) {
      console.error("Failed to load highlights", error);
      const grid = section.querySelector("#landing-products-grid");
      if (grid) {
          grid.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; color: var(--error);">
                <p>Não foi possível carregar os destaques.</p>
            </div>
          `;
      }
  }

  return section;
};
