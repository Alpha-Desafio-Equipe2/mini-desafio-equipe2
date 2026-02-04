# 🧾 Fluxo de Venda – Sistema FarmaProx

Este documento descreve o fluxo de venda implementado no backend e esperado pelo frontend.

1. Seleção do Cliente
- O usuário (atendente/farmacêutico) seleciona ou cadastra um cliente antes de iniciar a venda.

2. Seleção de Medicamentos
- O usuário adiciona um ou mais medicamentos ao carrinho. Cada item inclui `medicine_id` e `quantity`.

3. Verificação de Estoque
- Para cada item o backend valida `medicines.stock >= quantity`.
- Se houver item com estoque insuficiente, a API retorna um erro (código 1301 / mensagem apropriada) e a operação é abortada.

4. Verificação de Receita (quando aplicável)
- Se `medicine.requires_prescription = 1`, o sistema exige dados do médico (`doctor_crm`) e número/registro da receita.
- A validação é feita no serviço de vendas antes de criar o registro em `sales`.

5. Registro da Venda
- A API cria um registro em `sales` com `total_value`, `user_id` (operador), `status` (padrão `pending`) e demais metadados.
- Em seguida são criados os `sale_items` com `unit_price` copiado do `medicines.price` para preservar histórico de preço.

6. Atualização de Estoque
- Ao confirmar a venda, o backend deduz as quantidades vendidas do `medicines.stock`.

7. Resposta ao Frontend
- A API retorna o objeto da venda (com itens) e status. O frontend deve tratar estados de erro (estoque insuficiente, receita inválida, etc.).

8. Observações operacionais
- O campo `sales.status` permite fluxos com confirmação de pagamento ou cancelamento.
- Logs e auditoria devem ser ativados em produção para rastrear vendas críticas.
