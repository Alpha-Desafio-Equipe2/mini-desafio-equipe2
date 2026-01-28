import { getMedicamentos } from "../services/medicamentoservice.js";

export function renderizarMedicamentos() {
  const tbody = document.getElementById("lista-medicamentos");
  if (!tbody) return;

  tbody.innerHTML = "";

  const medicamentos = getMedicamentos();

  medicamentos.forEach((med) => {
    const badge = med.receita
      ? '<span class="badge badge-yes">Controlado (CRM)</span>'
      : '<span class="badge badge-no">Livre</span>';

    const tr = `
      <tr>
          <td><strong>${med.nome}</strong><br><small style="color:#777">${med.fabricante}</small></td>
          <td>${med.ativo}</td>
          <td>${badge}</td>
          <td>R$ ${med.preco.toFixed(2)}</td>
          <td style="color: ${med.estoque < 10 ? "red" : "green"}; font-weight:bold;">${med.estoque} un</td>
          <td><button class="btn btn-outline" style="padding: 5px;"><i class="fas fa-edit"></i></button></td>
      </tr>
    `;
    tbody.innerHTML += tr;
  });
}

export function filtrarTabela(termo: string) {
  const linhas = document.querySelectorAll("#lista-medicamentos tr");
  linhas.forEach((linha) => {
    const texto = (linha as HTMLElement).innerText.toLowerCase();
    (linha as HTMLElement).style.display = texto.includes(termo.toLowerCase())
      ? ""
      : "none";
  });
}
