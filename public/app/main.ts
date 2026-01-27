import { realizarLogin, logout } from "../modules/auth/pages/login.page.js";
import {
  renderizarMedicamentos,
  filtrarTabela,
} from "../modules/medicamento/pages/list.page.js";
import {
  abrirModalMedicamento,
  fecharModalMedicamento,
  salvarMedicamento,
} from "../modules/medicamento/pages/form.page.js";
import {
  buscarProduto,
  adicionarAoCarrinho,
  removerDoCarrinho,
  finalizarVenda,
  fecharRecibo,
  atualizarCarrinhoUI,
} from "../modules/venda/pages/pdv.page.js";

import { getMedicamentos } from "../modules/medicamento/services/medicamentoservice.js";
import {
  getVendas,
  getTotalVendasDia,
} from "../modules/venda/services/vendaservice.js";
// import { renderizarHistorico } from "./historico_dummy.js"; // We need to handle 'historico'. I'll inline it or create a file.

// --- GLOBAL APP LOGIC ---

function navegar(tela: string, element: HTMLElement) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.add("hidden"));
  const screen = document.getElementById("screen-" + tela);
  if (screen) screen.classList.remove("hidden");

  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  element.classList.add("active");

  if (window.innerWidth <= 768) {
    toggleSidebar();
  }

  if (tela === "medicamentos") renderizarMedicamentos();
  if (tela === "historico") renderizarHistoricoLocal();
  if (tela === "vendas") atualizarCarrinhoUI();

  atualizarDashboard();
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("mobile-overlay");
  const closeBtn = document.getElementById("mobile-close-btn");

  if (!sidebar || !overlay || !closeBtn) return;

  if (window.innerWidth <= 768) {
    sidebar.classList.toggle("mobile-open");
    overlay.classList.toggle("active");
    closeBtn.style.display = sidebar.classList.contains("mobile-open")
      ? "block"
      : "none";
  } else {
    sidebar.classList.toggle("closed");
  }
}

export function atualizarDashboard() {
  const totalEl = document.getElementById("dash-total");
  const atendimentosEl = document.getElementById("dash-atendimentos");
  const criticoEl = document.getElementById("dash-critico");
  const controladosEl = document.getElementById("dash-controlados");

  const total = getTotalVendasDia();
  const vendas = getVendas();

  if (totalEl) totalEl.innerText = "R$ " + total.toFixed(2);
  if (atendimentosEl) atendimentosEl.innerText = vendas.length.toString();

  const medicamentos = getMedicamentos();
  const criticos = medicamentos.filter((m) => m.estoque < 10).length;
  if (criticoEl) criticoEl.innerText = criticos.toString();

  const controladosVendidos = vendas.filter((v) => v.crm !== "-").length;
  if (controladosEl) controladosEl.innerText = controladosVendidos.toString();
}

// Temporary inline function for Historic until I separate it
function renderizarHistoricoLocal() {
  const tbody = document.getElementById("lista-historico");
  if (!tbody) return;
  const vendas = getVendas();
  tbody.innerHTML = "";
  vendas.forEach((v) => {
    tbody.innerHTML += `
        <tr>
            <td>#${v.id.toString().slice(-4)}</td>
            <td>${v.data}</td>
            <td>${v.cliente}</td>
            <td>${v.itens} itens</td>
            <td>R$ ${v.total.toFixed(2)}</td>
            <td><span class="badge badge-no">Concluído</span></td>
        </tr>
        `;
  });
}

// --- WINDOW EXPORTS ---
(window as any).realizarLogin = realizarLogin;
(window as any).logout = logout;
(window as any).navegar = navegar;
(window as any).toggleSidebar = toggleSidebar;
(window as any).renderizarMedicamentos = renderizarMedicamentos;
(window as any).filtrarTabela = filtrarTabela;
(window as any).abrirModalMedicamento = abrirModalMedicamento;
(window as any).fecharModalMedicamento = fecharModalMedicamento;
(window as any).salvarMedicamento = salvarMedicamento;
(window as any).buscarProduto = buscarProduto;
(window as any).adicionarAoCarrinho = adicionarAoCarrinho;
(window as any).removerDoCarrinho = removerDoCarrinho;
(window as any).finalizarVenda = finalizarVenda;
(window as any).fecharRecibo = fecharRecibo;
(window as any).atualizarDashboard = atualizarDashboard;

// Init
atualizarDashboard();
