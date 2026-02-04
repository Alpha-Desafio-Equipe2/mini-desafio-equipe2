# 📋 Regras de Negócio – Sistema Farmácia Popular

Este documento descreve as regras de negócio implementadas no código fonte (ver `apps/api/src/modules`), e orientações para manter consistência entre implementação e documentação.

1) Classificação de medicamentos
- Medicamentos têm o campo `requires_prescription` (0/1) no banco.
- Medicamentos controlados (`requires_prescription = 1`) exigem que seja registrado um número/registro de receita e dados do médico (CRM) para que a venda seja permitida.

2) Validação de estoque
- Antes de finalizar uma venda, o backend valida se existe `stock >= quantity` para cada item.
- Se o estoque for insuficiente, a venda é rejeitada com erro específico (ver `ERROR_CODES.md`).

3) Vendas e status
- A tabela `sales` possui campo `status` com valor padrão `'pending'` — o fluxo permite estados para gerenciar pagamentos/confirmações.
- Itens de venda são gravados em `sale_items` com cópia do `unit_price` e `total_price` para preservar histórico.

4) Usuários e permissões
- Perfis suportados: `admin` / `attendant` (valor default em `users.role` é `'attendant'`).
- Rotas sensíveis (`/users`, `/sales`) exigem autenticação (middleware `isAuthenticated`).

5) Integridade e unicidade
- Campos únicos: `users.cpf`, `users.email`, `doctors.crm`.

6) Regras de precificação
- `price` em `medicines` é `REAL NOT NULL` e espera-se valores não-negativos; validações são aplicadas no serviço antes de gravar.

7) Auditoria e histórico
- O esquema atual registra `created_at` e `updated_at` em tabelas principais.
- Não há implementação global de `soft delete` (campo `deleted_at`) por padrão — se necessário, adicionar coluna e ajustar repositórios.

8) Segurança de produção
- Em desenvolvimento o cookie JWT é definido com `httpOnly: false` para facilitar testes; em produção é recomendado `httpOnly: true` e `secure: true`.

9) Transferências entre filiais
- Transferências devem validar origem/destino e quantidade disponível; atualizar estoque em ambas as filiais e registrar operação para auditoria.

10) Exceções e tratamento de erro
- O projeto usa um handler centralizado para mapear erros com códigos e HTTP statuses (ver `apps/api/src/shared/errors`).

Manter estas regras sincronizadas com o código: altere este documento sempre que adicionar/alterar validações em `use-cases` ou `controllers`.
