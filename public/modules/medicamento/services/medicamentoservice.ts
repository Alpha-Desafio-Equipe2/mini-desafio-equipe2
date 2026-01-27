import { Medicamento } from "../../shared/types.js";

export const medicamentos: Medicamento[] = [
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

export function getMedicamentos(): Medicamento[] {
  return medicamentos;
}

export function adicionarMedicamento(novo: Medicamento): void {
  medicamentos.push(novo);
}

export function buscarMedicamentosPorTermo(termo: string): Medicamento[] {
  if (termo.length < 2) return [];
  return medicamentos.filter(
    (m) =>
      m.nome.toLowerCase().includes(termo.toLowerCase()) ||
      m.ativo.toLowerCase().includes(termo.toLowerCase()),
  );
}

export function obterMedicamentoPorId(id: number): Medicamento | undefined {
  return medicamentos.find((m) => m.id === id);
}

export function reduzirEstoque(id: number, quantidade: number = 1): void {
  const prod = obterMedicamentoPorId(id);
  if (prod) prod.estoque -= quantidade;
}
