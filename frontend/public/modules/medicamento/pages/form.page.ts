import { MedicineService } from "../services/medicamento.service.js";
import { renderizarMedicamentos } from "./list.page.js";

export function abrirModalMedicamento() {
  const modal = document.getElementById("modal-medicamento");
  if (modal) modal.classList.remove("hidden");
}

export function fecharModalMedicamento() {
  const modal = document.getElementById("modal-medicamento");
  if (modal) modal.classList.add("hidden");
}

export async function salvarMedicamento(e: Event) {
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

  const novo: any = {
    name: nome, // Mapping to new interface
    manufacturer: fabricante,
    active_principle: ativo,
    requires_prescription: receita,
    price: preco,
    stock: estoque,
  };

  try {
    await MedicineService.create(novo);
    renderizarMedicamentos(); // Re-render list
    fecharModalMedicamento();
    alert("Medicamento cadastrado com sucesso!");
    (e.target as HTMLFormElement).reset();
  } catch (error: any) {
    alert("Erro ao cadastrar: " + (error.message || error));
  }
}
