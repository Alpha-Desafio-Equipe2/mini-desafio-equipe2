import { Medicamento, Venda, ItemCarrinho } from "../../shared/types.js";
import { reduzirEstoque } from "../../medicamento/services/medicamentoservice.js";

let carrinho: ItemCarrinho[] = [];
let vendasRealizadas: Venda[] = [];
let totalVendasDia = 0;

export function getCarrinho() {
  return carrinho;
}

export function getVendas() {
  return vendasRealizadas;
}

export function getTotalVendasDia() {
  return totalVendasDia;
}

export function adicionarItemCarrinho(
  med: Medicamento,
  quantidade: number = 1,
): void {
  const itemExistente = carrinho.find((i) => i.medicamento.id === med.id);

  if (itemExistente) {
    if (itemExistente.quantidade + quantidade > med.estoque) {
      alert(
        `Estoque insuficiente! Apenas ${med.estoque} unidades disponíveis.`,
      );
      return;
    }
    itemExistente.quantidade += quantidade;
  } else {
    if (quantidade > med.estoque) {
      alert(
        `Estoque insuficiente! Apenas ${med.estoque} unidades disponíveis.`,
      );
      return;
    }
    carrinho.push({ medicamento: med, quantidade });
  }
}

export function removerItemCarrinho(index: number) {
  carrinho.splice(index, 1);
}

export function limparCarrinho() {
  carrinho = [];
}

export function processarVenda(cliente: string, crm: string): Venda {
  let total = 0;
  let totalItens = 0;

  carrinho.forEach((item) => {
    total += item.medicamento.preco * item.quantidade;
    totalItens += item.quantidade;
    reduzirEstoque(item.medicamento.id, item.quantidade);
  });

  const venda: Venda = {
    id: Date.now(),
    data: new Date().toLocaleString(),
    cliente: cliente,
    itens: totalItens,
    total: total,
    crm: crm || "-",
  };

  vendasRealizadas.push(venda);
  totalVendasDia += total;

  return venda;
}
