import { buscarMedicamentosPorTermo } from "../../medicamento/services/medicamentoservice.js";
import { Medicamento, ItemCarrinho } from "../../shared/types.js";
import {
  adicionarItemCarrinho,
  getCarrinho,
  removerItemCarrinho,
  processarVenda,
  limparCarrinho,
} from "../services/vendaservice.js";
import { atualizarDashboard } from "../../../app/main.js";

export function buscarProduto(termo: string) {
  const resultadosDiv = document.getElementById("resultado-busca");
  if (!resultadosDiv) return;

  if (termo.length < 2) {
    resultadosDiv.style.display = "none";
    return;
  }

  const filtrados = buscarMedicamentosPorTermo(termo);

  resultadosDiv.innerHTML = "";
  if (filtrados.length > 0) {
    resultadosDiv.style.display = "block";
    filtrados.forEach((med) => {
      const div = document.createElement("div");
      div.className = "search-item";
      div.innerHTML = `<span>${med.nome}</span> <b>R$ ${med.preco.toFixed(2)}</b>`;
      div.addEventListener("click", () => adicionarAoCarrinho(med));
      resultadosDiv.appendChild(div);
    });
  } else {
    resultadosDiv.style.display = "none";
  }
}

export function adicionarAoCarrinho(med: Medicamento) {
  if (med.estoque <= 0) {
    alert("Produto sem estoque!");
    return;
  }

  const qtdInput = document.getElementById("input-qtd-pdv") as HTMLInputElement;
  const quantidade = qtdInput ? parseInt(qtdInput.value) : 1;

  if (isNaN(quantidade) || quantidade <= 0) {
    alert("Quantidade inválida");
    return;
  }

  adicionarItemCarrinho(med, quantidade);

  const inputBusca = document.getElementById(
    "input-busca-pdv",
  ) as HTMLInputElement;
  if (inputBusca) inputBusca.value = "";
  if (qtdInput) qtdInput.value = "1"; // Reset quantity

  const resultadosDiv = document.getElementById("resultado-busca");
  if (resultadosDiv) resultadosDiv.style.display = "none";

  atualizarCarrinhoUI();
}

export function removerDoCarrinho(index: number) {
  removerItemCarrinho(index);
  atualizarCarrinhoUI();
}

export function atualizarCarrinhoUI() {
  const lista = document.getElementById("lista-carrinho");
  const areaReceita = document.getElementById("area-receita");
  const crmInput = document.getElementById("venda-crm");

  if (!lista || !areaReceita || !crmInput) return;

  lista.innerHTML = "";
  let total = 0;
  let exigeReceita = false;
  const carrinho = getCarrinho(); // Now returns ItemCarrinho[]

  if (carrinho.length === 0)
    lista.innerHTML =
      '<p style="text-align: center; color: #999; margin-top: 40px;">Carrinho vazio</p>';

  carrinho.forEach((item, index) => {
    total += item.medicamento.preco * item.quantidade;
    if (item.medicamento.receita) exigeReceita = true;

    lista.innerHTML += `
      <div class="cart-item">
          <div>
              <strong>${item.quantidade}x ${item.medicamento.nome}</strong><br>
              <small>${item.medicamento.receita ? '<span style="color:red; font-weight:bold">CONTROLADO</span>' : "Livre"}</small>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
              <span>R$ ${(item.medicamento.preco * item.quantidade).toFixed(2)}</span>
              <button class="btn btn-danger" style="padding: 5px 10px;" onclick="(window as any).removerDoCarrinho(${index})">X</button>
          </div>
      </div>
    `;
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

export function finalizarVenda() {
  const carrinho = getCarrinho();
  if (carrinho.length === 0) return alert("Carrinho vazio!");

  const temReceita = carrinho.some((i) => i.medicamento.receita);
  let crm = "";
  if (temReceita) {
    crm = (document.getElementById("venda-crm") as HTMLInputElement).value;
    if (!crm)
      return alert("ERRO: Informe o CRM para medicamentos controlados!");
  }

  const cliente = (document.getElementById("venda-cliente") as HTMLInputElement)
    .value;

  const venda = processarVenda(cliente, crm);

  mostrarRecibo(venda);

  limparCarrinho();

  (document.getElementById("venda-crm") as HTMLInputElement).value = "";
  (document.getElementById("venda-medico-nome") as HTMLInputElement).value = "";

  atualizarCarrinhoUI();

  if ((window as any).atualizarDashboard) {
    (window as any).atualizarDashboard();
  }
}

export function mostrarRecibo(venda: any) {
  const divItens = document.getElementById("recibo-itens");
  const modalRecibo = document.getElementById("modal-recibo");
  if (!divItens || !modalRecibo) return;

  divItens.innerHTML = "";

  // NOTE: In a real app we would pass the items snapshot in the Venda object.
  // Since we just cleared the cart in finalize, and the Venda object only has item count...
  // Wait, in previous step I noted this logic flaw.
  // However, since we are showing receipt IMMEDIATELY after processarVenda, logic in processarVenda
  // pushed to history but didn't clear cart inside the service.
  // 'finalizarVenda' clears cart AFTER calls to processarVenda and mostrarRecibo.
  // So getCarrinho() should still have items here?
  // YES. finalizarVenda calls: processarVenda -> mostrarRecibo -> limparCarrinho.
  // So this is safe.

  const carrinho = getCarrinho();
  carrinho.forEach((item) => {
    divItens.innerHTML += `
       <div class="receipt-item">
           <span>${item.quantidade}x ${item.medicamento.nome.substring(0, 20)}</span>
           <span>R$ ${(item.medicamento.preco * item.quantidade).toFixed(2)}</span>
       </div>
     `;
  });

  const totalEl = document.getElementById("recibo-total");
  const clienteEl = document.getElementById("recibo-cliente");
  if (totalEl) totalEl.innerText = "R$ " + venda.total.toFixed(2);
  if (clienteEl) clienteEl.innerText = venda.cliente;

  const crmEl = document.getElementById("recibo-crm");
  const crmValEl = document.getElementById("recibo-crm-valor");

  if (venda.crm && venda.crm !== "-" && crmEl && crmValEl) {
    crmEl.classList.remove("hidden");
    crmValEl.innerText = venda.crm;
  } else if (crmEl) {
    crmEl.classList.add("hidden");
  }

  modalRecibo.classList.remove("hidden");
}

export function fecharRecibo() {
  const modal = document.getElementById("modal-recibo");
  if (modal) modal.classList.add("hidden");
}
