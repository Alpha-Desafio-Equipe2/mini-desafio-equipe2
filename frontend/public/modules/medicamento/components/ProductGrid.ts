import { MedicineService } from "../services/medicamento.service.js";
import { ProductCard } from "../../../shared/components/productcard.js";
import { Product } from "../../../shared/types.js";

export const createProductGrid = (): {
  grid: HTMLElement;
  loadProducts: (search?: string) => Promise<void>;
} => {
  const grid = document.createElement("section");
  grid.id = "products-grid";
  grid.style.cssText =
    "display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem;";

  const loadingMsg = document.createElement("div");
  loadingMsg.style.cssText = "text-align: center; grid-column: 1/-1;";
  loadingMsg.textContent = "Carregando produtos...";
  grid.appendChild(loadingMsg);

  const loadProducts = async (search = "") => {
    grid.innerHTML = ""; // Clear existing

    const loading = document.createElement("div");
    loading.style.cssText = "text-align: center; grid-column: 1/-1;";
    loading.textContent = "Carregando...";
    grid.appendChild(loading);

    try {
      const medicines = await MedicineService.getAll();
      const filtered = search
        ? medicines.filter((m) =>
            m.name.toLowerCase().includes(search.toLowerCase()),
          )
        : medicines;

      grid.innerHTML = ""; // Clear loading

      if (filtered.length === 0) {
        const noResults = document.createElement("p");
        noResults.style.cssText = "text-align: center; grid-column: 1/-1;";
        noResults.textContent = "Nenhum produto encontrado.";
        grid.appendChild(noResults);
        return;
      }

      filtered.forEach((med: any) => {
        const product: Product = {
          id: med.id,
          name: med.name,
          price: med.price,
          quantity: med.stock,
          description: med.manufacturer,
          requires_prescription: Boolean(
            med.requires_prescription || med.requiresPrescription,
          ), // Handle potential case variance
        };
        grid.appendChild(ProductCard(product));
      });
    } catch (error: any) {
      grid.innerHTML = "";
      const errorMsg = document.createElement("p");
      errorMsg.style.cssText =
        "color: var(--error); text-align: center; grid-column: 1/-1;";
      errorMsg.textContent = `Erro ao carregar produtos: ${error.message}`;
      grid.appendChild(errorMsg);
    }
  };

  return { grid, loadProducts };
};
