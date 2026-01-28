import { api } from "../../../shared/http/api.js";
import { ProductCard } from "../../../shared/components/productcard.js";
import { Product } from "../../../shared/types.js";

export const HomePage = async (): Promise<HTMLElement> => {
  const div = document.createElement("div");

  div.innerHTML = `
        <header style="text-align: center; margin-bottom: 3rem;">
            <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-dark);">Bem-vindo à FarmaPro</h1>
            <p style="color: var(--text-muted); font-size: 1.1rem;">Encontre os melhores medicamentos e produtos para sua saúde.</p>
            
            <div style="margin-top: 2rem; display: flex; justify-content: center; gap: 10px;">
                <input type="text" id="search-input" class="input-field" placeholder="Buscar produtos..." style="max-width: 400px;">
                <button id="search-btn" class="btn btn-primary">Buscar</button>
            </div>
        </header>

        <section id="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;">
            <div style="text-align: center; grid-column: 1/-1;">Carregando produtos...</div>
        </section>
    `;

  const loadProducts = async (search = "") => {
    const grid = div.querySelector("#products-grid");
    if (!grid) return;

    grid.innerHTML =
      '<div style="text-align: center; grid-column: 1/-1;">Carregando...</div>';

    try {
      const products = await api.get<Product[]>(
        `/products?search=${encodeURIComponent(search)}`,
      );
      grid.innerHTML = "";

      if (products.length === 0) {
        grid.innerHTML =
          '<p style="text-align: center; grid-column: 1/-1;">Nenhum produto encontrado.</p>';
        return;
      }

      products.forEach((product) => {
        grid.appendChild(ProductCard(product));
      });
    } catch (error: any) {
      grid.innerHTML = `<p style="color: var(--error); text-align: center; grid-column: 1/-1;">Erro ao carregar produtos: ${error.message}</p>`;
    }
  };

  setTimeout(() => loadProducts(), 0);

  const searchBtn = div.querySelector("#search-btn");
  const searchInput = div.querySelector("#search-input") as HTMLInputElement;

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => loadProducts(searchInput.value));
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") loadProducts(searchInput.value);
    });
  }

  return div;
};
