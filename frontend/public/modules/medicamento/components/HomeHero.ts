export const createHomeHero = (
  onSearch: (term: string) => void,
): HTMLElement => {
  const header = document.createElement("header");
  header.style.cssText = "text-align: center; margin-bottom: 3rem;";

  const h1 = document.createElement("h1");
  h1.style.cssText =
    "font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-dark);";
  h1.textContent = "Bem-vindo à FarmaPro";
  header.appendChild(h1);

  const p = document.createElement("p");
  p.style.cssText = "color: var(--text-muted); font-size: 1.1rem;";
  p.textContent =
    "Encontre os melhores medicamentos e produtos para sua saúde.";
  header.appendChild(p);

  const searchContainer = document.createElement("div");
  searchContainer.style.cssText =
    "margin-top: 2rem; display: flex; justify-content: center; gap: 10px;";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-input";
  searchInput.className = "input-field";
  searchInput.placeholder = "Buscar produtos...";
  searchInput.style.maxWidth = "400px";
  searchContainer.appendChild(searchInput);

  const searchBtn = document.createElement("button");
  searchBtn.id = "search-btn";
  searchBtn.className = "btn btn-primary";
  searchBtn.textContent = "Buscar";
  searchContainer.appendChild(searchBtn);

  // Event Listeners
  const triggerSearch = () => onSearch(searchInput.value);

  searchBtn.onclick = triggerSearch;
  searchInput.onkeypress = (e) => {
    if (e.key === "Enter") triggerSearch();
  };

  header.appendChild(searchContainer);
  return header;
};
