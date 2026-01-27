// --- VERIFICAÇÃO DE SEGURANÇA ---
// Descomente a linha abaixo quando tiver a tela de login pronta
// if (!localStorage.getItem('token')) window.location.href = 'login.html';

// Interfaces
interface Medicamento {
  id: number;
  nome: string;
  fabricante: string;
  ativo: string;
  receita: boolean;
  preco: number;
  estoque: number;
}

interface Venda {
  id: number;
  data: string;
  cliente: string;
  itens: number;
  total: number;
  crm: string;
}

// Dados simulados
const medicamentos: Medicamento[] = [
  {
    id: 1,
    nome: "Losartana Potássica 50mg",
    fabricante: "EMS",
    ativo: "Losartana",
    receita: false,
    preco: 4.5,
    estoque: 100,
  },
  {
    id: 2,
    nome: "Amoxicilina 500mg",
    fabricante: "Medley",
    ativo: "Amoxicilina",
    receita: true,
    preco: 22.9,
    estoque: 5,
  },
  {
    id: 3,
    nome: "Dipirona Sódica",
    fabricante: "Neo Química",
    ativo: "Dipirona",
    receita: false,
    preco: 7.0,
    estoque: 50,
  },
  {
    id: 4,
    nome: "Rivotril 2mg",
    fabricante: "Roche",
    ativo: "Clonazepam",
    receita: true,
    preco: 18.5,
    estoque: 15,
  },
];

let carrinho: Medicamento[] = [];
let vendasRealizadas: Venda[] = [];
let totalVendasDia = 0;

// --- FUNÇÕES ---

function logout() {
  if (confirm("Encerrar sessão?")) {
    localStorage.removeItem("token"); // Limpa o token simulado
    window.location.href = "login.html"; // Redireciona para o login
  }
}

function navegar(tela: string, element: HTMLElement) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.add("hidden"));
  document.getElementById("screen-" + tela)?.classList.remove("hidden");
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  element.classList.add("active");

  if (window.innerWidth <= 768) toggleSidebar();
  if (tela === "medicamentos") renderizarMedicamentos();
  if (tela === "historico") renderizarHistorico();
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("mobile-overlay");
  const closeBtn = document.getElementById("mobile-close-btn");

  if (window.innerWidth <= 768) {
    sidebar?.classList.toggle("mobile-open");
    overlay?.classList.toggle("active");
    if (sidebar?.classList.contains("mobile-open")) {
      if (closeBtn) closeBtn.style.display = "block";
    } else {
      if (closeBtn) closeBtn.style.display = "none";
    }
  } else {
    sidebar?.classList.toggle("closed");
  }
}

function renderizarMedicamentos() {
  const tbody = document.getElementById("lista-medicamentos");
  if (!tbody) return;
  tbody.innerHTML = "";

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

function filtrarTabela(termo: string) {
  const linhas = document.querySelectorAll("#lista-medicamentos tr");
  linhas.forEach((linha) => {
    const texto = (linha as HTMLElement).innerText.toLowerCase();
    (linha as HTMLElement).style.display = texto.includes(termo.toLowerCase())
      ? ""
      : "none";
  });
}

function abrirModalMedicamento() {
  document.getElementById("modal-medicamento")?.classList.remove("hidden");
}
function fecharModalMedicamento() {
  document.getElementById("modal-medicamento")?.classList.add("hidden");
}

function salvarMedicamento(e: Event) {
  e.preventDefault();
  const novo: Medicamento = {
    id: Date.now(),
    nome: (document.getElementById("med-nome") as HTMLInputElement).value,
    fabricante: (document.getElementById("med-fabricante") as HTMLInputElement)
      .value,
    ativo: (document.getElementById("med-ativo") as HTMLInputElement).value,
    receita: (document.getElementById("med-receita") as HTMLInputElement)
      .checked,
    preco: parseFloat(
      (document.getElementById("med-preco") as HTMLInputElement).value,
    ),
    estoque: parseInt(
      (document.getElementById("med-estoque") as HTMLInputElement).value,
    ),
  };
  medicamentos.push(novo);
  renderizarMedicamentos();
  fecharModalMedicamento();
  alert("Medicamento cadastrado com sucesso!");
  (e.target as HTMLFormElement).reset();
}

function buscarProduto(termo: string) {
  const resultadosDiv = document.getElementById("resultado-busca");
  if (!resultadosDiv) return;
  if (termo.length < 2) {
    resultadosDiv.style.display = "none";
    return;
  }
  const filtrados = medicamentos.filter(
    (m) =>
      m.nome.toLowerCase().includes(termo.toLowerCase()) ||
      m.ativo.toLowerCase().includes(termo.toLowerCase()),
  );
  resultadosDiv.innerHTML = "";
  if (filtrados.length > 0) {
    resultadosDiv.style.display = "block";
    filtrados.forEach((med) => {
      const div = document.createElement("div");
      div.className = "search-item";
      div.innerHTML = `<span>${med.nome}</span> <b>R$ ${med.preco.toFixed(2)}</b>`;
      div.onclick = () => adicionarAoCarrinho(med);
      resultadosDiv.appendChild(div);
    });
  } else {
    resultadosDiv.style.display = "none";
  }
}

function adicionarAoCarrinho(med: Medicamento) {
  if (med.estoque <= 0) return alert("Produto sem estoque!");
  carrinho.push(med);
  (document.getElementById("input-busca-pdv") as HTMLInputElement).value = "";
  const resultadosDiv = document.getElementById("resultado-busca");
  if (resultadosDiv) resultadosDiv.style.display = "none";
  atualizarCarrinho();
}

function removerDoCarrinho(index: number) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  const areaReceita = document.getElementById("area-receita");
  const crmInput = document.getElementById("venda-crm");
  if (!lista || !areaReceita || !crmInput) return;

  lista.innerHTML = "";
  let total = 0;
  let exigeReceita = false;

  if (carrinho.length === 0)
    lista.innerHTML =
      '<p style="text-align: center; color: #999; margin-top: 40px;">Carrinho vazio</p>';

  carrinho.forEach((item, index) => {
    total += item.preco;
    if (item.receita) exigeReceita = true;
    lista.innerHTML += `
      <div class="cart-item">
          <div><strong>${item.nome}</strong><br><small>${item.receita ? '<span style="color:red; font-weight:bold">CONTROLADO</span>' : "Livre"}</small></div>
          <div style="display:flex; align-items:center; gap:10px;">
              <span>R$ ${item.preco.toFixed(2)}</span>
              <button class="btn btn-danger" style="padding: 5px 10px;" onclick="removerDoCarrinho(${index})">X</button>
          </div>
      </div>`;
  });

  const totalEl = document.getElementById("valor-total");
  const finalEl = document.getElementById("valor-final");
  if (totalEl) totalEl.innerText = total.toFixed(2);
  if (finalEl) finalEl.innerText = total.toFixed(2);

  if (exigeReceita) {
    areaReceita.classList.remove("hidden");
    crmInput.setAttribute("required", "true");
  } else {
    areaReceita.classList.add("hidden");
    crmInput.removeAttribute("required");
  }
}

function finalizarVenda() {
  if (carrinho.length === 0) return alert("Carrinho vazio!");
  const temReceita = carrinho.some((i) => i.receita);
  let crm = "";
  if (temReceita) {
    crm = (document.getElementById("venda-crm") as HTMLInputElement).value;
    if (!crm)
      return alert("ERRO: Informe o CRM para medicamentos controlados!");
  }
  const cliente = (document.getElementById("venda-cliente") as HTMLInputElement)
    .value;
  const total = parseFloat(
    document.getElementById("valor-final")?.innerText || "0",
  );

  carrinho.forEach((item) => {
    const prod = medicamentos.find((m) => m.id === item.id);
    if (prod) prod.estoque--;
  });

  vendasRealizadas.push({
    id: Date.now(),
    data: new Date().toLocaleString(),
    cliente,
    itens: carrinho.length,
    total,
    crm: crm || "-",
  });
  totalVendasDia += total;
  mostrarRecibo(cliente, total, crm);
  carrinho = [];
  (document.getElementById("venda-crm") as HTMLInputElement).value = "";
  (document.getElementById("venda-medico-nome") as HTMLInputElement).value = "";
  atualizarCarrinho();
  atualizarDashboard();
}

function mostrarRecibo(cliente: string, total: number, crm: string) {
  const divItens = document.getElementById("recibo-itens");
  if (!divItens) return;
  divItens.innerHTML = "";
  carrinho.forEach((item) => {
    divItens.innerHTML += `<div class="receipt-item"><span>${item.nome.substring(0, 20)}</span><span>R$ ${item.preco.toFixed(2)}</span></div>`;
  });
  const totalEl = document.getElementById("recibo-total");
  const clienteEl = document.getElementById("recibo-cliente");
  if (totalEl) totalEl.innerText = "R$ " + total.toFixed(2);
  if (clienteEl) clienteEl.innerText = cliente;

  const crmEl = document.getElementById("recibo-crm");
  if (crm && crmEl) {
    crmEl.classList.remove("hidden");
    const valEl = document.getElementById("recibo-crm-valor");
    if (valEl) valEl.innerText = crm;
  } else if (crmEl) {
    crmEl.classList.add("hidden");
  }
  document.getElementById("modal-recibo")?.classList.remove("hidden");
}

function fecharRecibo() {
  document.getElementById("modal-recibo")?.classList.add("hidden");
}

function atualizarDashboard() {
  const totalEl = document.getElementById("dash-total");
  const atendimentosEl = document.getElementById("dash-atendimentos");
  const criticoEl = document.getElementById("dash-critico");
  const controladosEl = document.getElementById("dash-controlados");

  if (totalEl) totalEl.innerText = "R$ " + totalVendasDia.toFixed(2);
  if (atendimentosEl)
    atendimentosEl.innerText = vendasRealizadas.length.toString();
  if (criticoEl)
    criticoEl.innerText = medicamentos
      .filter((m) => m.estoque < 10)
      .length.toString();
  if (controladosEl)
    controladosEl.innerText = vendasRealizadas
      .filter((v) => v.crm !== "-")
      .length.toString();
}

function renderizarHistorico() {
  const tbody = document.getElementById("lista-historico");
  if (!tbody) return;
  tbody.innerHTML = "";
  vendasRealizadas.forEach((v) => {
    tbody.innerHTML += `<tr><td>#${v.id.toString().slice(-4)}</td><td>${v.data}</td><td>${v.cliente}</td><td>${v.itens} itens</td><td>R$ ${v.total.toFixed(2)}</td><td><span class="badge badge-no">Concluído</span></td></tr>`;
  });
}

// INICIALIZAÇÃO
// Carrega dados iniciais se estiver na tela
if (document.getElementById("screen-dashboard")) {
  atualizarDashboard();
}

// EXPONDO FUNÇÕES GLOBAIS PARA O HTML
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
