import { MedicineService } from "../services/medicamento.service.js";
import { ProductCard } from "../../../shared/components/productcard.js";
import { Product } from "../../../shared/types.js";
import { Footer } from "../../landing/components/footer.js";
export const ProductsPage = async (): Promise<HTMLElement> => {
  const container = document.createElement("div");
  container.className = "home-page";

  // Styled Header Section to match Landing Page aesthetic
  const header = document.createElement("header");
  header.style.cssText = "background: linear-gradient(135deg, rgba(0,201,167,0.1) 0%, #ffffff 100%); padding: 4rem 1rem; text-align: center; border-bottom: 1px solid var(--border); margin-bottom: 2rem;";
  header.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-dark); font-weight: 800;">Nossos Produtos</h1>
          <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2rem;">Encontre tudo o que você precisa para sua saúde e bem-estar com a qualidade FarmaPROX.</p>
          
          <div style="position: relative; max-width: 500px; margin: 0 auto;">
              <input type="text" id="search-input" class="input-field" placeholder="Buscar medicamentos..." style="padding-right: 100px; border-radius: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <button id="search-btn" class="btn btn-primary" style="position: absolute; right: 5px; top: 5px; bottom: 5px; border-radius: 40px; padding: 0 1.5rem;">
                  Buscar
              </button>
          </div>
      </div>
  `;
  container.appendChild(header);

  // Products Grid Section with loading state
  const section = document.createElement("section");
  section.className = "container";
  section.style.minHeight = "60vh"; // Ensure footer pushed down
  section.innerHTML = `
      <div id="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; padding-bottom: 3rem;">
          <div style="text-align: center; grid-column: 1/-1; padding: 3rem; color: var(--text-muted);">
            <span class="material-symbols-outlined spin" style="font-size: 3rem; margin-bottom: 1rem; display: inline-block;">progress_activity</span>
            <p>Carregando catálogo completo...</p>
          </div>
      </div>
  `;
  container.appendChild(section);

  // Load Logic
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category") || "";
  const initialSearch = params.get("search") || "";

  const loadProducts = async (search = "", category = "") => {
    const grid = section.querySelector("#products-grid");
    if (!grid) return;
    
    if(grid.children.length === 0 || grid.innerHTML.includes("Carregando")) {
         grid.innerHTML = '<div style="text-align: center; grid-column: 1/-1; padding: 3rem;"><span class="material-symbols-outlined spin">progress_activity</span><p>Buscando...</p></div>';
    }

    try {
      const medicines = await MedicineService.getAll();
      let filtered = medicines;

      if (category) {
        filtered = filtered.filter(m => m.category === category);
        // Update header if filtering by category
        const title = header.querySelector("h1");
        if (title) title.textContent = `Produtos: ${category}`;
      }

      if (search) {
        filtered = filtered.filter((m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.active_principle?.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      grid.innerHTML = "";
      
      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="text-align: center; grid-column: 1/-1; padding: 4rem 1rem;">
             <span class="material-symbols-outlined" style="font-size: 4rem; color: var(--text-muted); margin-bottom: 1rem;">search_off</span>
             <h3 style="color: var(--text-muted);">Nenhum produto encontrado</h3>
             <p style="color: var(--text-muted);">Tente buscar por outro termo ou categoria.</p>
          </div>
        `;
        return;
      }

      filtered.forEach((med: any) => {
        const product: Product = {
          id: med.id,
          name: med.name,
          price: med.price,
          quantity: med.stock,
          description: med.manufacturer,
          category: med.category,
          image_url: med.image_url,
          requires_prescription: Boolean(med.requires_prescription || med.requiresPrescription),
        };
        const card = ProductCard(product);
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "all 0.5s ease";
        grid.appendChild(card);
        
        setTimeout(() => {
             card.style.opacity = "1";
             card.style.transform = "translateY(0)";
        }, 50);
      });
    } catch (error: any) {
      grid.innerHTML = `<p style="color: var(--error); text-align: center; grid-column: 1/-1;">Erro ao carregar produtos: ${error.message}</p>`;
    }
  };

  // Bind Events
  const searchBtn = header.querySelector("#search-btn");
  const searchInput = header.querySelector("#search-input") as HTMLInputElement;

  // Initialize load
  if (searchInput) {
    if (initialSearch) {
      searchInput.value = initialSearch;
    } else if (initialCategory) {
      searchInput.value = initialCategory;
    }
  }
  
  setTimeout(() => loadProducts(initialSearch, initialCategory), 0);

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
        // When searching manually, we clear the category header title
        const title = header.querySelector("h1");
        if (title) title.textContent = "Nossos Produtos";
        loadProducts(searchInput.value);
    });
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
          const title = header.querySelector("h1");
          if (title) title.textContent = "Nossos Produtos";
          loadProducts(searchInput.value);
      }
    });
  }

  // Footer
  container.appendChild(Footer());

  return container;
};
