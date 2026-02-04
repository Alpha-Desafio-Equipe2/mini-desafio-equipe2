import { App } from "./app/app.js";

// Função global de navegação
window.navigate = (path: string) => {

  document.dispatchEvent(new CustomEvent("navigate", { detail: { path } }));
};

const app = new App();
app.render();
