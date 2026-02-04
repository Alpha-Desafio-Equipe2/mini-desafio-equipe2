/**
 * Landing Header Component
 * Header com busca e título, seguindo o padrão do Products Page
 */

export const LandingHeader = (): HTMLElement => {
  const header = document.createElement("header");
  header.style.cssText =
    "background: linear-gradient(135deg, rgba(67,164,111,0.1) 0%, #ffffff 100%); padding: 4rem 1rem; text-align: center; border-bottom: 1px solid var(--border); margin-bottom: 2rem;";

  header.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-dark); font-weight: 800;">Nossos Produtos</h1>
      <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 2rem;">Encontre tudo o que você precisa para sua saúde e bem-estar com a qualidade FarmaPROX.</p>

      <div style="position: relative; max-width: 500px; margin: 0 auto;">
        <input
          type="text"
          id="search-input-landing"
          class="input-field"
          placeholder="Buscar medicamentos..."
          style="padding-right: 100px; border-radius: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);"
        />
        <button
          id="search-btn-landing"
          class="btn btn-primary"
          style="position: absolute; right: 5px; top: 5px; bottom: 5px; border-radius: 40px; padding: 0 1.5rem;"
        >
          Buscar
        </button>
      </div>
    </div>
  `;

  // Adicionar event listeners
  const searchBtn = header.querySelector("#search-btn-landing") as HTMLButtonElement;
  const searchInput = header.querySelector("#search-input-landing") as HTMLInputElement;

  const handleSearch = () => {
    const searchTerm = searchInput?.value || "";
    if (searchTerm.trim()) {
      // Redirecionar para produtos com termo de busca
      window.navigate(`/server07/products?search=${encodeURIComponent(searchTerm)}`);
    } else {
      // Se vazio, ir para produtos normalmente
      window.navigate("/server07/products");
    }
  };

  searchBtn?.addEventListener("click", handleSearch);
  searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  return header;
};
