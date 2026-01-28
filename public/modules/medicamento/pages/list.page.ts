import { MedicineService } from "../services/medicamento.service.js";

export async function renderizarMedicamentos() {
  const tbody = document.getElementById("lista-medicamentos");
  if (!tbody) return;

  tbody.innerHTML =
    "<tr><td colspan='6' style='text-align:center;'>Carregando...</td></tr>";

  try {
    const medicamentos = await MedicineService.getAll();

    tbody.innerHTML = "";
    medicamentos.forEach((med) => {
      // Compatibility with existing type properties if needed
      // Guide uses: requires_prescription, stock
      // Existing code used: receita, estoque
      // I added both in Types, assuming Backend returns guide format but I might need to adapt if the backend actually returns guide format but existing code expects something else.
      // Let's assume the new `Medicine` interface property names are what we get.
      // If the backend follows the guide:
      // requires_prescription -> receita
      // stock -> estoque
      // active_principle -> ativo
      // manufacturer -> fabricante

      const receita = med.requires_prescription;
      const estoque = med.stock;

      const badge = receita
        ? '<span class="badge badge-yes">Controlado (CRM)</span>'
        : '<span class="badge badge-no">Livre</span>';

      const tr = `
        <tr>
            <td><strong>${med.name}</strong><br><small style="color:#777">${med.manufacturer || "N/A"}</small></td>
            <td>${med.active_principle}</td>
            <td>${badge}</td>
            <td>R$ ${med.price.toFixed(2)}</td>
            <td style="color: ${estoque < 10 ? "red" : "green"}; font-weight:bold;">${estoque} un</td>
            <td><button class="btn btn-outline" style="padding: 5px;"><i class="fas fa-edit"></i></button></td>
        </tr>
      `;
      tbody.innerHTML += tr;
    });
  } catch (error) {
    tbody.innerHTML =
      "<tr><td colspan='6' style='text-align:center; color:red;'>Erro ao carregar medicamentos.</td></tr>";
    console.error(error);
  }
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
