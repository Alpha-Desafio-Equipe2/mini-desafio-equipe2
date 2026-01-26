# 💊 Lista de Códigos Internos de Erro – Sistema Farmácia Popular

| Código | HTTP Status | Domínio / Contexto          | Descrição |
|--------|------------|----------------------------|-----------|
| 1000   | 400        | Clientes                   | CPF inválido |
| 1001   | 400        | Clientes                   | Campo `nome` obrigatório |
| 1002   | 400        | Clientes                   | Data de nascimento inválida |
| 1100   | 404        | Clientes                   | Cliente não encontrado |
| 1200   | 400        | Médicos                    | CRM inválido |
| 1201   | 400        | Médicos                    | Campo `nome` obrigatório |
| 1202   | 404        | Médicos                    | Médico não encontrado |
| 1300   | 400        | Medicamentos               | Nome do medicamento obrigatório |
| 1301   | 400        | Medicamentos               | Estoque insuficiente |
| 1302   | 404        | Medicamentos               | Medicamento não encontrado |
| 1303   | 400        | Medicamentos               | Preço inválido |
| 1400   | 400        | Vendas                     | Receita obrigatória para medicamento controlado |
| 1401   | 400        | Vendas                     | Cliente não informado |
| 1402   | 400        | Vendas                     | Filial não informada |
| 1403   | 404        | Vendas                     | Venda não encontrada |
| 1500   | 400        | Itens de Venda             | Quantidade inválida (negativa ou zero) |
| 1501   | 404        | Itens de Venda             | Item de venda não encontrado |
| 1600   | 400        | Prescrições                | Receita inválida |
| 1601   | 404        | Prescrições                | Receita não encontrada |
| 1700   | 400        | Filiais                    | Nome da filial obrigatório |
| 1701   | 404        | Filiais                    | Filial não encontrada |
| 1800   | 400        | Endereços                  | CEP inválido |
| 1801   | 400        | Endereços                  | Logradouro obrigatório |
| 1802   | 404        | Endereços                  | Endereço não encontrado |
| 1900   | 403        | Autenticação / Usuários    | Acesso negado (role insuficiente) |
| 1901   | 401        | Autenticação / Usuários    | Token JWT inválido ou expirado |
| 1902   | 400        | Autenticação / Usuários    | Email ou senha inválidos |
| 2000   | 500        | Sistema / Geral            | Erro interno do servidor |

------------

O sistema da Farmácia Popular adota **códigos internos de erro padronizados**, em conjunto com os códigos HTTP, como parte da estratégia de tratamento de erros e validações.

Os códigos HTTP são utilizados para indicar a **categoria geral do erro** (ex.: erro de validação, autenticação, autorização ou falha interna), enquanto os **códigos internos** permitem identificar de forma **precisa e consistente** a causa do problema dentro do domínio da aplicação.

Essa abordagem traz os seguintes benefícios:

* **Clareza na comunicação entre backend e frontend**, permitindo que a interface reaja de forma específica a cada tipo de erro.
* **Padronização das respostas da API**, evitando mensagens ambíguas ou inconsistentes.
* **Facilidade de manutenção e evolução**, já que novas regras de negócio podem reutilizar códigos existentes ou introduzir novos sem quebrar contratos.
* **Melhor observabilidade e auditoria**, facilitando logs, métricas e análise de falhas.
* **Independência da mensagem exibida ao usuário**, permitindo internacionalização ou ajustes de UX sem alterar a lógica do backend.

Os códigos internos são documentados aqui e tratados centralmente por um `Error Handler`, garantindo consistência em toda a aplicação.

1. Cada código **deve ser único** e **imutável**.
2. HTTP status **reflete a categoria de erro** (400 = client, 401/403 = auth, 404 = not found, 500 = server).
3. Mensagem enviada ao frontend deve ser clara e concisa, o **frontend pode exibir a mensagem ou usar o código para tratamento específico.**
4. Essa lista pode ser usada como **enum no backend**:

```ts

   export enum ErrorCode {
  INVALID_CPF = 1000,
  MISSING_CUSTOMER_NAME = 1001,
  INVALID_BIRTHDATE = 1002,
  CUSTOMER_NOT_FOUND = 1100,
  INVALID_CRM = 1200,
  MEDIC_DOES_NOT_EXIST = 1202,
  MEDICINE_OUT_OF_STOCK = 1301,
  PRESCRIPTION_REQUIRED = 1400,
  SALE_NOT_FOUND = 1403,
  // ... e assim por diante
}

```
5. Fácil de **documentar no Swagger/OpenAPI**, permitindo que o frontend saiba exatamente o que cada código significa.
