# 💊 Códigos de Erro (sincronizado com o código fonte)

Lista de códigos internos usados pela API. Valores e mensagens extraídos de `apps/api/src/shared/errors/ErrorCode.ts` e `ErrorMessage.ts`.

| Código | HTTP Status | Domínio / Contexto | Descrição |
|-------:|:-----------:|:-------------------|:----------|
| 1000 | 400 | Clientes | CPF inválido |
| 1001 | 400 | Clientes | Nome do cliente não informado |
| 1002 | 400 | Clientes | Data de nascimento inválida |
| 1003 | 409 | Clientes | CPF já cadastrado |
| 1004 | 409 | Clientes | Email já cadastrado |
| 1005 | 400 | Clientes | Email inválido |
| 1100 | 404 | Clientes | Cliente não encontrado |

| 1200 | 400 | Médicos | CRM inválido |
| 1201 | 400 | Médicos | Nome do médico não informado |
| 1202 | 404 | Médicos | Médico não encontrado |

| 1300 | 400 | Medicamentos | Nome do medicamento não informado |
| 1301 | 409 | Medicamentos | Medicamento sem estoque |
| 1302 | 404 | Medicamentos | Medicamento não encontrado |
| 1303 | 400 | Medicamentos | Preço do medicamento inválido |
| 1304 | 409 | Medicamentos | Estoque insuficiente |
| 1305 | 409 | Medicamentos | SKU já cadastrado |
| 1306 | 409 | Medicamentos | Medicamento já cadastrado |

| 1400 | 400 | Vendas | Receita médica obrigatória |
| 1401 | 400 | Vendas | Cliente não informado |
| 1402 | 400 | Vendas | Filial não informada |
| 1403 | 404 | Vendas | Venda não encontrada |
| 1404 | 409 | Vendas | Venda já finalizada |
| 1405 | 409 | Vendas | Venda cancelada |
| 1406 | 400 | Vendas | Venda sem itens |

| 1500 | 400 | Itens de venda | Quantidade do item inválida |
| 1501 | 400 | Itens de venda | Preço do item inválido |
| 1502 | 404 | Itens de venda | Item da venda não encontrado |
| 1503 | 400 | Itens de venda | Pagamento falhou |

| 1600 | 400 | Prescrições | Prescrição inválida |
| 1601 | 404 | Prescrições | Prescrição não encontrada |
| 1602 | 409 | Prescrições | Receita vencida |
| 1603 | 400 | Prescrições | Nome do médico inválido |

| 1700 | 400 | Filiais | Nome da filial não informado |
| 1701 | 404 | Filiais | Filial não encontrada |

| 1800 | 400 | Endereços | CEP inválido |
| 1801 | 400 | Endereços | Campo obrigatório do endereço não informado |
| 1802 | 404 | Endereços | Endereço não encontrado |

| 1900 | 403 | Autenticação / Usuários | Acesso negado |
| 1901 | 401 | Autenticação / Usuários | Token inválido |
| 1902 | 401 | Autenticação / Usuários | Credenciais inválidas |
| 1903 | 401 | Autenticação / Usuários | Token não fornecido |
| 1904 | 401 | Autenticação / Usuários | Token expirado |
| 1905 | 400 | Usuários | Role de usuário inválido |
| 1906 | 409 | Usuários | Usuário já cadastrado |
| 1907 | 404 | Usuários | Usuário não encontrado |
| 1908 | 400 | Usuários | Nome de usuário inválido |
| 1909 | 400 | Usuários | Senha fraca (mínimo 6 caracteres) |

| 2000 | 500 | Sistema / Geral | Erro interno do servidor |


Observações
- Os códigos e mensagens são definidos no backend e expostos pela camada de erro (handler). Consulte `apps/api/src/shared/errors/ErrorMessage.ts` para traduções completas (mensagem + httpStatus).
- Se adicionar novos erros ao backend, atualize também este arquivo para manter o contrato com o frontend.

