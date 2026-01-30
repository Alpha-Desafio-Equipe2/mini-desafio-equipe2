# 📘 Projeto Sistema Farmácia Popular

---

## 🔹 Milestones Backend

### **Infra & Setup (até 26/01/26)**

- Configuração do repositório backend – `infra`
- Configuração do banco de dados SQLite – `infra`
- Setup do CI/CD – `infra`
- Integração inicial do backend – `infra`, `fullstack`

---

### **Autenticação & Perfis (até 26/01/26)**

- Cadastro de usuário – `backend`, `api`
    - `POST /auth/register` – Cria novo usuário com role
- Login de usuário – `backend`, `api`
    - `POST /auth/login` – Retorna JWT
- Middleware de roles – `backend`, `api`
    - Controla acesso baseado no JWT e perfil (`ADMIN`, `FARMACEUTICO`, `ATENDENTE`)

---

### **Gestão de Medicamentos (até 28/01/26)**

- CRUD de medicamentos – `backend`, `api`
    - `POST /medicines` – Adiciona medicamento
    - `GET /medicines` – Lista medicamentos
    - `GET /medicines/{id}` – Detalhes
    - `PUT /medicines/{id}` – Atualiza medicamento
    - `DELETE /medicines/{id}` – Remove medicamento
- Controle de estoque – `backend`, `api`
    - Atualização automática após vendas e transferências
- Controle de preços – `backend`, `api`

---

### **Gestão de Clientes e Médicos (até 28/01/26)**

- CRUD de clientes – `backend`, `api`
    - `POST/GET/PUT/DELETE /customers`
- CRUD de médicos – `backend`, `api`
    - `POST/GET/PUT/DELETE /doctors`

---

### **Vendas & Receitas (até 30/01/26)**

- Registrar venda de medicamentos – `backend`, `api`
    - `POST /sales` – Inclui itens, calcula total
- Validação de receita para medicamentos controlados – `backend`, `api`
    - Requer dados do médico e número da receita
- Atualização de estoque automaticamente – `backend`, `api`
- Registro de itens vendidos – `backend`, `api`
- Histórico de vendas – `backend`, `api`

---

### **Filiais & Transferências (até 01/02/26)**

- CRUD de filiais – `backend`, `api`
    - `POST/GET/PUT/DELETE /branches`
- Transferência de estoque entre filiais – `backend`, `api`
    - `POST /branches/transfer` – Valida origem, destino e quantidade
    - Atualiza estoque das duas filiais automaticamente
- Registro de auditoria de transferências

---

### **Extras Backend (até 04/02/26)**

- Relatórios de vendas e estoque – `backend`, `api`, `admin`
    - `GET /reports/sales-overview`
    - `GET /reports/stock-status`
- Busca avançada de medicamentos – `backend`, `api`
    - `GET /medicines/search`
- Alertas de estoque baixo – `backend`, `api`

---

## 🔹 Milestones Frontend

### **Infra & Setup (até 26/01/26)**

- Configuração do projeto frontend – `frontend`, `infra`
- Integração com backend via API – `frontend`, `fullstack`
- Autenticação via JWT e cookies HTTP – `frontend`, `fullstack`

---

### **Dashboard & Autenticação (até 28/01/26)**

- Tela de login – `frontend`, `usuario`
- Redirecionamento baseado no perfil – `frontend`, `usuario`
- Dashboard principal do usuário – `frontend`, `usuario`
    - Exibe resumo de vendas, estoque ou tarefas do dia

---

### **Gestão de Medicamentos (até 30/01/26)**

- Tela de listagem de medicamentos – `frontend`, `farmaceutico`, `atendente`
- Tela de cadastro/edição de medicamento – `frontend`, `farmaceutico`
- Visualização de estoque e preços – `frontend`, `farmaceutico`, `atendente`
- Busca de medicamentos – `frontend`, `farmaceutico`, `atendente`

---

### **Gestão de Clientes & Médicos (até 30/01/26)**

- Tela de listagem e cadastro de clientes – `frontend`, `farmaceutico`, `atendente`
- Tela de listagem e cadastro de médicos – `frontend`, `farmaceutico`

---

### **Registro de Vendas (até 01/02/26)**

- Tela de vendas – `frontend`, `farmaceutico`, `atendente`
    - Seleção de cliente e medicamentos
    - Validação de receita para medicamentos controlados
    - Atualização de estoque e registro de venda

---

### **Filiais & Transferências (até 02/02/26)**

- Tela de seleção de filial origem/destino – `frontend`, `farmaceutico`
- Fluxo de transferência de estoque – `frontend`, `farmaceutico`
- Confirmação e registro da operação

---

### **Extras Frontend (até 04/02/26)**

- Relatórios visuais – `frontend`, `admin`
    - Gráficos de vendas e estoque
- Alertas visuais de estoque baixo – `frontend`, `farmaceutico`
- Funcionalidade de Dark Mode – `frontend`, todos os perfis
- Interface responsiva e amigável para tablets e desktops
