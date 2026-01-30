import { createHomeHero } from "../components/HomeHero.js";
import { createProductGrid } from "../components/ProductGrid.js";

export const HomePage = async (): Promise<HTMLElement> => {
  const container = document.createElement("div");

  // 1. Setup Grid Component first (needed for search callback)
  const { grid, loadProducts } = createProductGrid();

  // 2. Setup Hero with Search Callback
  const hero = createHomeHero((term) => loadProducts(term));
  container.appendChild(hero);

  // 3. Append Grid
  container.appendChild(grid);

  // Initial Load
  setTimeout(() => loadProducts(), 0);

  return container;
};
