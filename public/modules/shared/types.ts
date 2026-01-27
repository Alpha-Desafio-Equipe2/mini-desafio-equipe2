export interface Medicamento {
  id: number;
  nome: string;
  fabricante: string;
  ativo: string;
  receita: boolean;
  preco: number;
  estoque: number;
}

export interface Venda {
  id: number;
  data: string;
  cliente: string;
  itens: number;
  total: number;
  crm: string;
}

export interface ItemCarrinho {
  medicamento: Medicamento;
  quantidade: number;
}
