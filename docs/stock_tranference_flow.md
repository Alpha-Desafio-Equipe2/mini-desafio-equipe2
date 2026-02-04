# 🔁 Fluxo de Transferência de Estoque entre Filiais

Este documento descreve o fluxo de transferência de estoque entre filiais (conceito e passos esperados).

1. Seleção de Filial Origem e Destino
- O usuário seleciona a filial origem e a filial destino para a transferência.

2. Seleção de Itens e Quantidades
- Seleciona-se o(s) medicamento(s) e a quantidade a ser transferida.

3. Validação de Estoque na Origem
- O backend valida se a filial de origem possui `stock >= quantidade` para cada item.

4. Criação da Requisição de Transferência
- Se validado, cria-se um registro de transferência (registro lógico — implementação específica depende do serviço de filiais).

5. Atualização de Estoques
- O sistema decrementa o `stock` na filial de origem e incrementa o `stock` na filial destino.

6. Auditoria e Registro
- Todas as transferências críticas devem criar um registro de auditoria contendo: filial origem, filial destino, items, quantidades, usuário e timestamp.

7. Mensagens ao Frontend
- O frontend deve exibir confirmação e resultados por item (sucesso/falha), e tratar erros relacionados a estoque insuficiente ou destino inválido.

Observação: o schema atual (schema.ts) modela `medicines.stock` como quantidade global; para suporte multi-filial é necessário modelar `stock` por filial (ex.: tabela `stock` com `branch_id`, `medicine_id`, `quantity`).
