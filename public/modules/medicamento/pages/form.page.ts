import {
  adicionarMedicamento,
  getMedicamentos,
} from "../services/medicamentoservice.js";
import { Medicamento } from "../../shared/types.js";
import { renderizarMedicamentos } from "./list.page.js";

export function abrirModalMedicamento() {
  const modal = document.getElementById("modal-medicamento");
  if (modal) modal.classList.remove("hidden");
}

export function fecharModalMedicamento() {
  const modal = document.getElementById("modal-medicamento");
  if (modal) modal.classList.add("hidden");
}

export function salvarMedicamento(e: Event) {
  e.preventDefault();
  const nome = (document.getElementById("med-nome") as HTMLInputElement).value;
  const fabricante = (
    document.getElementById("med-fabricante") as HTMLInputElement
  ).value;
  const ativo = (document.getElementById("med-ativo") as HTMLInputElement)
    .value;
  const preco = parseFloat(
    (document.getElementById("med-preco") as HTMLInputElement).value,
  );
  const estoque = parseInt(
    (document.getElementById("med-estoque") as HTMLInputElement).value,
  );
  const receita = (document.getElementById("med-receita") as HTMLInputElement)
    .checked;

  const novo: Medicamento = {
    id: Date.now(),
    nome,
    fabricante,
    ativo,
    receita,
    preco,
    estoque,
  };

  adicionarMedicamento(novo);
  renderizarMedicamentos(); // Re-render list
  fecharModalMedicamento();
  alert("Medicamento cadastrado com sucesso!");
  (e.target as HTMLFormElement).reset();
}
