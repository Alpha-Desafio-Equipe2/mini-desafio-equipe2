interface Category {
  id: string;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: "remedios", name: "Remédios", icon: "medication" },
  { id: "beleza", name: "Beleza", icon: "spa" },
  { id: "infantil", name: "Infantil", icon: "child_care" },
  { id: "suplementos", name: "Suplementos", icon: "fitness_center" },
  { id: "vacinas", name: "Vacinas", icon: "vaccines" },
  { id: "primeiros-socorros", name: "Primeiros Socorros", icon: "volunteer_activism" },
];

export const CategoryGrid = (): HTMLElement => {
  const section = document.createElement("section");
  section.className = "category-section";

  const gridHTML = categories
    .map(
      (category) => `
    <a href="/server07/?category=${encodeURIComponent(category.name)}" class="category-card" onclick="window.navigate('/server07/?category=${encodeURIComponent(category.name)}'); return false;">
      <div class="category-icon">
        <span class="material-symbols-outlined">${category.icon}</span>
      </div>
      <span class="category-name">${category.name}</span>
    </a>
  `
    )
    .join("");

  section.innerHTML = `
    <div class="category-container">
      ${gridHTML}
    </div>
  `;

  return section;
};
