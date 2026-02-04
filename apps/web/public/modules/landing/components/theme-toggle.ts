export const setupThemeToggle = (): void => {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  if (!themeToggle) return;

  // Inicializar tema baseado em preferência salva ou sistema
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  initializeTheme();

  themeToggle.addEventListener("click", () => {
    html.classList.toggle("dark");
    localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light");
  });
};
