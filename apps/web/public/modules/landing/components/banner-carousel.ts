/**
 * Banner Carousel Component
 * Componente reutilizável de carrossel com múltiplos banners
 * Segue o padrão de arquitetura do projeto
 */

interface BannerSlide {
  id: string;
  title: string;
  description: string;
  badge: string;
  buttonText: string;
  buttonAction?: string;
  backgroundColor: string;
  textColor: string;
  secondaryColor?: string;
}

const slides: BannerSlide[] = [
  {
    id: "banner-1",
    title: "Cuidado moderno para sua saúde.",
    description:
      "Descubra uma nova experiência em bem-estar com a FarmaPROX. Entrega rápida e consultoria especializada na palma da sua mão.",
    badge: "Lançamento Exclusivo",
    buttonText: "Ver Produtos",
    buttonAction: "/server07/",
    backgroundColor: "linear-gradient(135deg, #135044 0%, #43a46f 100%)",
    textColor: "#ffffff",
  },
  {
    id: "banner-2",
    title: "Medicamentos de Qualidade Garantida.",
    description:
      "Todos os nossos produtos são certificados e selecionados com rigor. Sua saúde é nossa prioridade número um.",
    badge: "Confiança Farmacêutica",
    buttonText: "Confira Medicamentos",
    buttonAction: "/server07/products",
    backgroundColor: "linear-gradient(135deg, #2f8f6a 0%, #43a46f 100%)",
    textColor: "#ffffff",
  },
  {
    id: "banner-3",
    title: "Entrega Rápida e Segura.",
    description:
      "Compre com segurança e receba seus medicamentos no conforto da sua casa. Entrega em até 24 horas na sua região.",
    badge: "Logística Eficiente",
    buttonText: "Saiba Mais",
    buttonAction: "/server07/",
    backgroundColor: "linear-gradient(135deg, #1a5f52 0%, #2f8f6a 100%)",
    textColor: "#ffffff",
  },
];

export const BannerCarousel = (): HTMLElement => {
  const section = document.createElement("section");
  section.className = "banner-carousel-section";

  let currentSlide = 0;

  const createSlideHTML = (slide: BannerSlide): string => {
    return `
      <div class="banner-carousel-item carousel-slide" data-slide-id="${slide.id}" style="display: none;">
        <div class="banner-carousel-container" style="background: ${slide.backgroundColor};">
          <div class="banner-carousel-content">
            <span class="banner-carousel-badge">${slide.badge}</span>
            <h1 class="banner-carousel-title">${slide.title}</h1>
            <p class="banner-carousel-description">${slide.description}</p>
            <div class="banner-carousel-actions">
              <button class="btn btn-primary btn-lg carousel-action-btn" onclick="window.navigate('${slide.buttonAction}'); return false;">
                ${slide.buttonText}
              </button>
              <button class="btn btn-secondary btn-lg">
                Saiba Mais
              </button>
            </div>
          </div>
          <div class="banner-carousel-visual">
            <div class="banner-blur-1"></div>
            <div class="banner-blur-2"></div>
            <div class="banner-blur-3"></div>
          </div>
        </div>
      </div>
    `;
  };

  section.innerHTML = `
    <div class="banner-carousel-wrapper">
      <div class="banner-carousel-slides">
        ${slides.map((slide) => createSlideHTML(slide)).join("")}
      </div>

      <!-- Indicadores de navegação -->
      <div class="banner-carousel-indicators">
        ${slides
          .map(
            (_, index) =>
              `<div class="carousel-indicator ${index === 0 ? "active" : ""}" data-index="${index}"></div>`
          )
          .join("")}
      </div>

      <!-- Botões de navegação -->
      <button class="carousel-nav carousel-nav-prev" aria-label="Slide anterior">
        <span>❮</span>
      </button>
      <button class="carousel-nav carousel-nav-next" aria-label="Próximo slide">
        <span>❯</span>
      </button>
    </div>
  `;

  const updateSlide = (newIndex: number) => {
    // Atualizar slides
    const allSlides = section.querySelectorAll(".carousel-slide");
    allSlides.forEach((slide, index) => {
      const htmlSlide = slide as HTMLElement;
      htmlSlide.style.display = index === newIndex ? "block" : "none";
    });

    // Atualizar indicadores
    const indicators = section.querySelectorAll(".carousel-indicator");
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === newIndex);
    });

    currentSlide = newIndex;
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % slides.length;
    updateSlide(next);
  };

  const prevSlide = () => {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide(prev);
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      updateSlide(index);
    }
  };

  // Event Listeners
  const nextBtn = section.querySelector(".carousel-nav-next") as HTMLButtonElement;
  const prevBtn = section.querySelector(".carousel-nav-prev") as HTMLButtonElement;

  nextBtn?.addEventListener("click", nextSlide);
  prevBtn?.addEventListener("click", prevSlide);

  // Indicators click
  section.querySelectorAll(".carousel-indicator").forEach((indicator, index) => {
    indicator.addEventListener("click", () => goToSlide(index));
  });

  // Auto-rotate (opcional - comentado por padrão)
  // const autoRotateInterval = setInterval(nextSlide, 5000);

  // Inicializar com o primeiro slide
  updateSlide(0);

  return section;
};
