# 🗄️ Banco de Dados – Sistema Farmácia Popular

---

## 1️⃣ Tabelas Principais

### **users**
Armazena usuários do sistema (farmacêuticos, atendentes, administradores).

| Campo        | Tipo       | Descrição                                   | Observações                   |
| ------------ | ---------- | ------------------------------------------ | ----------------------------- |
| id           | INTEGER PK | Identificador único                         | Auto incremento               |
| nome         | TEXT       | Nome completo do usuário                     | Obrigatório                   |
| email        | TEXT       | Email de login                              | Único, obrigatório            |
| role         | TEXT       | Perfil do usuário                            | ENUM: ADMIN, FARMACEUTICO, ATENDENTE |
| password_hash| TEXT       | Senha criptografada                          | Obrigatório                   |
| created_at   | DATETIME   | Data de criação do registro                  | Default CURRENT_TIMESTAMP     |
| updated_at   | DATETIME   | Data de atualização do registro             | Atualizado via trigger        |

---

### **medicines**
Armazena medicamentos disponíveis na farmácia.

| Campo         | Tipo       | Descrição                                   | Observações                   |
| ------------- | ---------- | ------------------------------------------ | ----------------------------- |
| id            | INTEGER PK | Identificador único                         | Auto incremento               |
| nome          | TEXT       | Nome do medicamento                          | Obrigatório                   |
| fabricante    | TEXT       | Fabricante do medicamento                    | Opcional                      |
| principio_ativo| TEXT      | Princípio ativo do medicamento               | Opcional                      |
| exige_receita | BOOLEAN    | Se o medicamento exige receita médica       | Default FALSE                 |
| preco         | REAL       | Preço unitário                               | Não negativo                  |
| estoque       | INTEGER    | Quantidade disponível                        | Não negativo                  |
| created_at    | DATETIME   | Data de criação do registro                  | Default CURRENT_TIMESTAMP     |
| updated_at    | DATETIME   | Data de atualização do registro             | Atualizado via trigger        |

**Índices sugeridos:**
```sql
CREATE INDEX idx_medicines_nome ON medicines(nome);
CREATE INDEX idx_medicines_principio_ativo ON medicines(principio_ativo);
```
----------------

## **customers**
Armazena dados de clientes.

| Campo           | Tipo       | Descrição                      | Observações                  |
| --------------- | ---------- | ------------------------------ | ---------------------------- |
| id              | INTEGER PK | Identificador único             | Auto incremento              |
| nome            | TEXT       | Nome completo                   | Obrigatório                  |
| cpf             | TEXT       | CPF do cliente                  | Único, obrigatório           |
| data_nascimento | DATE       | Data de nascimento              | Opcional                     |
| created_at      | DATETIME   | Data de criação                 | Default CURRENT_TIMESTAMP    |
| updated_at      | DATETIME   | Data de atualização             | Atualizado via trigger       |

---

## **doctors**
Armazena médicos que podem prescrever receitas.

| Campo        | Tipo       | Descrição                         | Observações                   |
| ------------ | ---------- | -------------------------------- | ----------------------------- |
| id           | INTEGER PK | Identificador único               | Auto incremento               |
| nome         | TEXT       | Nome completo                     | Obrigatório                   |
| crm          | TEXT       | CRM                               | Único, obrigatório            |
| especialidade| TEXT       | Especialidade do médico           | Opcional                      |
| created_at   | DATETIME   | Data de criação                   | Default CURRENT_TIMESTAMP     |
| updated_at   | DATETIME   | Data de atualização               | Atualizado via trigger        |

---

## **sales**
Armazena vendas realizadas.

| Campo       | Tipo       | Descrição                             | Observações                   |
| ----------- | ---------- | ------------------------------------ | ----------------------------- |
| id          | INTEGER PK | Identificador único                   | Auto incremento               |
| customer_id | INTEGER FK | Cliente que realizou a compra         | FK → customers(id)            |
| branch_id   | INTEGER FK | Filial onde a venda ocorreu           | FK → branches(id)             |
| data_venda  | DATETIME   | Data da venda                         | Default CURRENT_TIMESTAMP     |
| valor_total | REAL       | Soma dos itens vendidos               | Calculado automaticamente     |
| created_at  | DATETIME   | Data de criação do registro           | Default CURRENT_TIMESTAMP     |
| updated_at  | DATETIME   | Data de atualização                   | Atualizado via trigger        |

---

## **sale_items**
Itens de cada venda.

| Campo         | Tipo       | Descrição                          | Observações                   |
| ------------- | ---------- | --------------------------------- | ----------------------------- |
| id            | INTEGER PK | Identificador único                | Auto incremento               |
| sale_id       | INTEGER FK | Venda relacionada                  | FK → sales(id)                |
| medicine_id   | INTEGER FK | Medicamento vendido                | FK → medicines(id)            |
| quantidade    | INTEGER    | Quantidade vendida                 | Não negativo                  |
| preco_unitario| REAL       | Preço unitário no momento da venda | Copiado de medicines.preco    |

---

## **prescriptions**
Receitas médicas para medicamentos controlados.

| Campo        | Tipo       | Descrição                            | Observações                   |
| ------------ | ---------- | ----------------------------------- | ----------------------------- |
| id           | INTEGER PK | Identificador único                  | Auto incremento               |
| doctor_id    | INTEGER FK | Médico prescritor                     | FK → doctors(id)              |
| sale_id      | INTEGER FK | Venda associada                       | FK → sales(id)                |
| numero       | TEXT       | Número da receita                     | Obrigatório                   |
| data_emissao | DATETIME   | Data de emissão                       | Default CURRENT_TIMESTAMP     |

---

## **branches**
Filiais da farmácia.

| Campo       | Tipo       | Descrição                            | Observações                   |
| ----------- | ---------- | ----------------------------------- | ----------------------------- |
| id          | INTEGER PK | Identificador único                  | Auto incremento               |
| nome        | TEXT       | Nome da filial                        | Obrigatório                   |
| endereco_id | INTEGER FK | Endereço da filial                     | FK → addresses(id)            |
| created_at  | DATETIME   | Data de criação                       | Default CURRENT_TIMESTAMP     |
| updated_at  | DATETIME   | Data de atualização                   | Atualizado via trigger        |

---

## **addresses**
Endereços de filiais, clientes ou médicos.

| Campo       | Tipo       | Descrição                             | Observações                   |
| ----------- | ---------- | ------------------------------------ | ----------------------------- |
| id          | INTEGER PK | Identificador único                   | Auto incremento               |
| logradouro  | TEXT       | Rua / Avenida                         | Obrigatório                   |
| numero      | TEXT       | Número do endereço                     | Obrigatório                   |
| complemento | TEXT       | Complemento                           | Opcional                      |
| bairro      | TEXT       | Bairro                                 | Opcional                      |
| cidade      | TEXT       | Cidade                                 | Opcional se usar API CEP      |
| estado      | TEXT       | Estado                                 | Opcional se usar API CEP      |
| cep         | TEXT       | CEP                                     | Obrigatório                   |
| created_at  | DATETIME   | Data de criação                        | Default CURRENT_TIMESTAMP     |
| updated_at  | DATETIME   | Data de atualização                    | Atualizado via trigger        |

---

## **audit_log**
Registro de alterações críticas (opcional, recomendado).

| Campo       | Tipo       | Descrição                             |
| ----------- | ---------- | ------------------------------------ |
| id          | INTEGER PK | Identificador único                  |
| table_name  | TEXT       | Tabela afetada                       |
| record_id   | INTEGER    | ID do registro alterado              |
| action      | TEXT       | Tipo de ação: INSERT, UPDATE, DELETE |
| changed_by  | INTEGER FK | Usuário que realizou a ação           |
| changed_at  | DATETIME   | Data da ação                           |

---

## **Relacionamentos e Regras**

- `sale_items.sale_id → sales.id`  
- `sale_items.medicine_id → medicines.id`  
- `prescriptions.doctor_id → doctors.id`  
- `sales.customer_id → customers.id`  
- `sales.branch_id → branches.id`  
- `branches.endereco_id → addresses.id`  

**Regras de negócio importantes:**
1. Medicamento controlado só pode ser vendido com receita válida.  
2. Estoque deve ser atualizado automaticamente após venda ou transferência.  
3. Venda não é concluída sem estoque suficiente.  
4. Transferência de estoque entre filiais gera registro no `audit_log`.  

---

## **Observações**

- Use **triggers** para atualizar `updated_at` automaticamente.  
- Índices em campos de busca frequente (`nome`, `cpf`, `crm`) aumentam performance.  
- Enum para roles (`users.role`) garante consistência.  
- Campos de data (`created_at`, `updated_at`) permitem auditoria detalhada.  
- Para integração com API de CEP, `cidade` e `estado` podem ser preenchidos automaticamente, mas ainda podem ser armazenados para consulta rápida.  
