# 🔄 Workflow de Desenvolvimento – Sistema Farmácia Popular

**Período do projeto:**  
📅 Início: 24/01/2026  
📅 Entrega final: 04/02/2026  

Este documento define o fluxo de trabalho do time, organização de **milestones, branches, commits, issues e PRs**, considerando **frontend e backend**.

---

## **1️⃣ Estrutura de Milestones**

| Milestone                     | Backend                                                               | Frontend                                                     | Data final |
| ----------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| Infra & Setup                 | Configuração do repositório, banco SQLite, ORM, CI/CD inicial          | Setup do frontend (TypeScript/React ou Angular), roteamento, integração inicial com backend | 26/01/26   |
| Autenticação & Usuários       | Login, JWT, roles (ADMIN, FARMACEUTICO, ATENDENTE)                    | Telas de login e cadastro, fluxo de JWT, validação de sessão | 27/01/26   |
| Gestão de Medicamentos        | CRUD de medicamentos, regras de receita, preços, controle de estoque  | Telas de cadastro e listagem de medicamentos                | 29/01/26   |
| Clientes & Médicos            | CRUD de clientes e médicos                                            | Telas de cadastro e consulta                                  | 30/01/26   |
| Vendas & Receita Médica       | Registro de vendas, validação de receita, baixa automática de estoque | Fluxo de venda, seleção de cliente e medicamentos            | 01/02/26   |
| Filiais & Estoque             | Controle de estoque por filial, transferência entre filiais           | Visualização de estoque por filial                            | 03/02/26   |
| Documentação & Finalização    | Swagger, ajustes finais, auditoria básica                             | Revisão geral e ajustes visuais                               | 04/02/26   |

---

## **2️⃣ Labels sugeridas**

### Por área
- `backend`
- `frontend`
- `fullstack`

### Por domínio
- `auth`
- `medicines`
- `stock`
- `sales`
- `customers`
- `doctors`
- `branches`

### Por tipo de tarefa
- `bug`
- `feature`
- `documentation`
- `refactor`

### Por prioridade
- `urgent`
- `low-priority`

---

## **3️⃣ Fluxo de criação de Issues**

1. Criar uma **issue** usando os templates em `.github/ISSUE_TEMPLATE/`:
   - `bug_report.yml`
   - `feature_request.yml`
2. Associar a issue a uma **milestone** correspondente
3. Aplicar **labels adequadas** (área, domínio, tipo)
4. Designar **assignee** responsável

### 💡 Exemplo:
> Venda de medicamento controlado sem validação de receita  
Labels: `bug`, `backend`, `sales`  
Milestone: *Vendas & Receita Médica*

---

## **4️⃣ Estrutura de Branches**

### Branch principal
- **`main`** → branch estável, apenas merges via Pull Request

### Branches integradora
- **`develop`** → integração de features dp back antes do merge final
- **`frontend`** → integração de features do front antes do merge final

### Branches de Feature

**Padrão:**  
`feature/<dominio>/<descricao>`

**Exemplos:**
- `feature/auth/login`
- `feature/medicines/create`
- `feature/stock/transfer`
- `feature/sales/register-sale`
- `feature/medicines-list`
- `feature/sales-flow`

---

### Branches de Bugfix

**Padrão:**  
`bugfix/<dominio>/<descricao>`

**Exemplos:**
- `bugfix/auth/token-expiration`
- `bugfix/stock/negative-quantity`
- `bugfix/sales/price-calculation`
- `bugfix/login-error`

---

### Branches de Documentação

**Padrão:**  
`docs/<area>/<descricao>`

**Exemplos:**
- `docs/api/swagger`
- `docs/architecture/update`
- `docs/workflow/project-workflow`

---

### Branches Experimentais / Testes

**Padrão:**  
`experiment/<descricao>`

**Exemplo:**  
`experiment/ai-prescription-check` → testar integração com IA para validação de receitas

---

## **5️⃣ Regras de Nomenclatura**

1. Tudo em **lowercase**
2. Usar `/` para separar categoria
3. Usar `-` na descrição
4. Evitar nomes genéricos ou caracteres especiais
5. Sempre referenciar a **issue relacionada** na PR

---

## **6️⃣ Fluxo de Branches e Pull Requests**

1. Criar branch a partir de `main` ou `develop`:

```bash
git checkout main
git pull origin main
git checkout -b feature/medicines/create
```
2. Implementar a funcionalidade
3. Criar commits pequenos e claros
```
feat(medicines): add medicine creation endpoint
fix(stock): block sale without stock
feat(frontend/sales): implement sales flow page

```
4. Subir para o repositório remoto
```
git push origin feature/medicines/create
```
5. Abrir **Pull Request** contra `main` ou `develop`
6. Preencher **PULL_REQUEST_TEMPLATE.md**
7. Revisão obrigatória por pelo menos 1 colega
8. Merge aprovado → deletar branch

## 7️⃣ Boas Práticas

- PRs pequenos e focados
- Commits seguindo **Conventional Commits**
- Milestones sempre atualizadas
- Nenhum push direto na **main**
- Documentar fluxos críticos (ex.: venda, transferência de estoque)
- Testes automáticos sempre que possível (backend e frontend)

---

## 8️⃣ Conventional Commits

**Formato:**

<tipo>(escopo): descrição


### Tipos principais

| Tipo     | Uso                            | Exemplo                                           |
| -------- | ------------------------------ | ------------------------------------------------ |
| feat     | Nova funcionalidade            | `feat(sales): register medicine sale`           |
| fix      | Correção de bug                | `fix(stock): block sale without stock`          |
| docs     | Documentação                   | `docs(workflow): add development workflow`      |
| refactor | Refatoração                    | `refactor(auth): simplify jwt validation`       |
| test     | Testes                         | `test(sales): add unit tests for sale service`  |
| chore    | Manutenção/configuração        | `chore(ci): configure github actions`           |
| perf     | Melhorias de performance       | `perf(stock): optimize stock update query`      |

---

## 9️⃣ Proteção de Branch

**Branch protegida:** `main`, `develop`

### Regras:

- PR obrigatório
- Pelo menos 1 review aprovado
- Status checks obrigatórios
- Push direto bloqueado

---

## 🔟 Visão Geral do Workflow

```
Milestone
   ↓
Issue
   ↓
Branch (feature/bugfix/docs)
   ↓
Commit
   ↓
Push
   ↓
Pull Request
   ↓
Review + CI/CD
   ↓
Merge na main
   ↓
Branch deletada
```


---

## ✅ Observações finais

Este workflow garante:

- Organização clara do time
- Coordenação entre frontend e backend
- Cumprimento das datas de milestone
- Registro completo para auditoria e avaliação acadêmica
