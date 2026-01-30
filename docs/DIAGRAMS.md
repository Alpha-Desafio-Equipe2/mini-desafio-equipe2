# 📊 Diagramas – Sistema Farmácia Popular

Este arquivo apresenta os principais diagramas do sistema, representando **entidades, fluxos e arquitetura** do Sistema de Farmácia Popular.

---

## 1️⃣ Diagrama de Arquitetura Geral

```text
Frontend (TypeScript)
    │
    │  HTTP/REST JSON
    ▼
Backend (Node.js + TypeScript)
 ├── Módulo: Medicamentos
 ├── Módulo: Clientes
 ├── Módulo: Médicos
 ├── Módulo: Vendas
 ├── Módulo: Usuários
 └── Módulo: Filiais / Estoque
    │
    ▼
Banco de Dados (SQLite)
```

**Observações:**

* O frontend consome endpoints REST do backend.
* O backend aplica todas as regras de negócio e validações.
* O banco armazena dados persistentes, incluindo estoque, vendas, clientes e médicos.
* Cada módulo no backend segue **MVC + Modular**: Controller → Service → Repository → Entity → DTOs.

------
## 2️⃣ Diagrama de Entidades (ER)
```
Users
┌─────────────┐
│ id          │
│ nome        │
│ email       │
│ role        │
│ password    │
└─────────────┘

Medicines
┌─────────────┐
│ id          │
│ nome        │
│ fabricante  │
│ principio   │
│ exige_receita│
│ preco       │
│ estoque     │
└─────────────┘

Customers
┌─────────────┐
│ id          │
│ nome        │
│ cpf         │
│ data_nasc   │
└─────────────┘

Doctors
┌─────────────┐
│ id          │
│ nome        │
│ crm         │
│ especialidade│
└─────────────┘

Sales
┌─────────────┐
│ id          │
│ customer_id │
│ data_venda  │
│ valor_total │
└─────────────┘

Sale_Items
┌──────────────┐
│ id           │
│ sale_id      │
│ medicine_id  │
│ quantidade   │
│ preco_unit   │
└──────────────┘

Prescriptions
┌─────────────┐
│ id          │
│ doctor_id   │
│ numero      │
│ data_emissao│
└─────────────┘
```

**Relacionamentos principais:**

* Um `sale` pode ter vários `sale_items`.
* Um `sale_item` refere-se a um `medicine`.
* `Medicines` controlados exigem `prescriptions` ligadas a um `doctor`.
* Cada `sale` está associado a um `customer`.

-------
## 3️⃣ Diagrama de Fluxo de Venda
```
[Usuário seleciona cliente]
            │
            ▼
[Seleciona medicamento(s)]
            │
            ▼
[Verifica estoque disponível] ──> [Se estoque insuficiente] ──> [Exibir erro]
            │
            ▼
[Medicamento exige receita?] ──> [Sim] ──> [Solicitar dados do médico e receita]
            │
            ▼
[Registrar venda no backend]
            │
            ▼
[Atualizar estoque automaticamente]
            │
            ▼
[Confirmar venda e gerar histórico]
```
**Observações:**
* Fluxo automatiza validação de receita médica.
* Estoque é sempre atualizado em tempo real.
* Todos os passos críticos ficam registrados para auditoria.

------
## 4️⃣ Diagrama de Fluxo de Transferência entre Filiais
```
[Selecionar filial origem] → [Selecionar medicamento e quantidade]
            │
            ▼
[Verificar estoque da filial origem]
            │
            ▼
[Criar requisição de transferência]
            │
            ▼
[Confirmar envio]
            │
            ▼
[Atualizar estoque da filial origem e destino]
            │
            ▼
[Registro de auditoria da transferência]
```

------
## 5️⃣ Observações Finais

* Diagramas simplificam entendimento do sistema para novos desenvolvedores.
* Fluxos e ER podem ser complementados com **diagramas UML** ou **ferramentas visuais** (draw.io, Lucidchart) se necessário.
* Fluxos críticos (venda e transferência de estoque) estão documentados para **auditoria e validação de regras de negócio**.