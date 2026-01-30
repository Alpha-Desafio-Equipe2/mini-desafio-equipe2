# 📘 Guia de Uso – Sistema Farmácia Popular

Este documento descreve como os diferentes perfis de usuários interagem com o sistema, detalhando as principais funcionalidades disponíveis para cada papel.

---

## 👤 Farmacêutico / Atendente

Perfil responsável pela operação diária da farmácia.

### Principais ações:
- Realizar login no sistema.
- Cadastrar e atualizar medicamentos, informando:
  - nome
  - fabricante
  - princípio ativo
  - exigência de receita médica
- Controlar preços dos medicamentos.
- Gerenciar o estoque disponível.
- Cadastrar clientes.
- Cadastrar médicos.
- Registrar vendas de medicamentos.
- Validar receitas médicas para medicamentos controlados.
- Dar baixa automática no estoque após a conclusão da venda.

---

## 👤 Gerente / Administrador

Perfil com permissões administrativas e de supervisão.

### Principais ações:
- Realizar login como administrador.
- Gerenciar usuários do sistema (criação, atualização e desativação).
- Definir perfis e permissões de acesso.
- Gerenciar medicamentos e seus dados cadastrais.
- Monitorar níveis de estoque.
- Visualizar relatórios de vendas.
- Acompanhar métricas operacionais por meio de dashboard.
- Supervisionar operações críticas do sistema.
- Consultar registros de auditoria (quando habilitado).

---

## 👤 Cliente (Interação Indireta)

Clientes não acessam o sistema diretamente, mas seus dados são registrados para fins de controle e rastreabilidade das vendas.

### Dados cadastrados:
- Nome completo
- CPF
- Data de nascimento
- Histórico de compras

---

## 👤 Médico (Interação Indireta)

Médicos também não acessam o sistema diretamente. Seus dados são utilizados para validação de receitas médicas.

### Dados cadastrados:
- Nome completo
- CRM
- Especialidade

---

## 🔄 Fluxo de Venda de Medicamentos

1. O usuário seleciona o cliente.
2. O usuário seleciona um ou mais medicamentos.
3. O sistema verifica a disponibilidade de estoque.
4. Caso o medicamento exija receita médica:
   - os dados do médico (CRM) são solicitados;
   - os dados da receita médica são registrados.
5. A venda é confirmada.
6. O estoque é atualizado automaticamente.
7. A venda é registrada para fins de histórico e auditoria.

---

## 🔐 Autenticação e Autorização

- A autenticação é realizada por meio de **JWT armazenado em cookie HTTP-only**.
- Cada requisição a rotas protegidas valida o token de autenticação.
- O acesso às funcionalidades é controlado conforme o perfil do usuário.
- Ações não autorizadas são bloqueadas pelo sistema.

---

## ⚠️ Regras de Negócio Importantes

- Medicamentos podem ser classificados como controlados ou não.
- Medicamentos controlados exigem receita médica válida.
- Não é permitido finalizar vendas sem estoque disponível.
- Vendas de medicamentos controlados sem receita são bloqueadas.
- Regras críticas são sempre validadas no backend.

---

## 🧭 Observações

- Este documento descreve o **uso do sistema**, não detalhes de implementação.
- Informações sobre arquitetura, banco de dados e fluxos técnicos estão documentadas separadamente.
- O sistema foi projetado para permitir evolução futura, como múltiplas filiais e transferência de estoque.

