export const AppPromotion = (): HTMLElement => {
  const section = document.createElement("section");
  section.className = "app-promotion-section";

  section.innerHTML = `
    <div class="app-promo-container">
      <div class="promo-content">
        <h2 class="promo-title">FarmaPROX no seu bolso.</h2>
        <p class="promo-description">
          Baixe nosso aplicativo e ganhe 20% de desconto na sua primeira compra. 
          Praticidade e rapidez no atendimento.
        </p>
        <div class="promo-buttons">
          <button class="btn btn-store" type="button">
            <span class="material-symbols-outlined">apple</span> 
            App Store
          </button>
          <button class="btn btn-store" type="button">
            <span class="material-symbols-outlined">play_store</span> 
            Play Store
          </button>
        </div>
      </div>
      <div class="promo-visual">
        <div class="promo-blur"></div>
        <div class="promo-mockup">
          <div class="mockup-content">
            <div class="mockup-bar"></div>
            <div class="mockup-image"></div>
            <div class="mockup-bar-small"></div>
            <div class="mockup-button"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add animation to mockup on hover
  const mockup = section.querySelector(".promo-mockup");
  if (mockup) {
    mockup.addEventListener("mouseenter", () => {
      mockup.classList.add("rotate-active");
    });
    mockup.addEventListener("mouseleave", () => {
      mockup.classList.remove("rotate-active");
    });
  }

  return section;
};
