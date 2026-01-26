# 🏗️ Arquitetura – Sistema Farmácia Popular

## Visão Geral
Este é um sistema full-stack desenvolvido para gerenciamento de uma Farmácia Popular,
permitindo controle de medicamentos, estoque, clientes, médicos e vendas, respeitando regras
de negócio como exigência de receita médica para medicamentos controlados.

A aplicação segue uma arquitetura **modular + MVC**, com separação clara de responsabilidades
entre frontend, backend e persistência de dados.

---

## 🖥️ Frontend (TypeScript)
Responsável pela interação com o usuário e consumo da API REST.

### Funcionalidades principais:
- Cadastro e consulta de medicamentos
- Cadastro de clientes e médicos
- Registro de vendas
- Validação de medicamentos que exigem receita
- Dashboard de controle da farmácia
- Login e autenticação de usuários

### Tecnologias:
- TypeScript
- Fetch API
- Cookies HTTP para autenticação JWT (Cookies são configurados como HttpOnly e Secure, mitigando riscos de XSS).

---

## ⚙️ Backend (Node.js + TypeScript)
API REST responsável pelas regras de negócio, validações e persistência de dados.

### Estrutura Arquitetural
A aplicação segue o padrão **Modular + MVC**, onde cada módulo representa um domínio de negócio:

medicamento
cliente
medico
venda
estoque
usuario (autenticação)

Dentro de cada módulo:

- **Controller:** expõe endpoints REST.
- **Service:** implementa regras de negócio.
- **Repository:** acesso e persistência de dados.
- **Entity:** representação do modelo de domínio.
- **DTOs:** contratos de entrada e saída.

No código, entidades e módulos utilizam nomenclatura em inglês.

---

## 📌 Decisões Técnicas
- TypeScript para tipagem forte e segurança
- Arquitetura modular para escalabilidade
- MVC para separação de responsabilidades
- JWT via cookie para maior segurança no frontend
- Swagger para documentação profissional da API
- SSQLite foi escolhido por simplicidade de setup e consistência relacional, sendo adequado para prototipação e mini-projetos. A arquitetura permite migração futura para PostgreSQL ou MySQL sem impacto nas regras de negócio.

---

### Modelagem de Filiais e Administração

Todas as lojas são modeladas como filiais operacionais, com as mesmas regras de negócio e capacidades.
Não existe uma entidade separada de “matriz” ou “filial principal” no modelo de domínio.

As responsabilidades de administração central são tratadas por meio de usuários com perfis administrativos, o que permite a gestão global do sistema sem a necessidade de introduzir lógicas especiais ou exceções.

Essa abordagem reduz regras condicionais, evita duplicação de lógica e mantém o modelo de domínio mais consistente, simples e fácil de manter.

-------

### Transferência de Estoque entre Filiais

As transferências de estoque entre filiais são tratadas como uma entidade própria do domínio, distinta das vendas. Isso garante uma separação clara entre operações comerciais e processos logísticos internos.

Cada transferência registra a filial de origem, a filial de destino, os itens transferidos e os respectivos registros de data e hora, assegurando total rastreabilidade e preservando a integridade do estoque em todo o sistema.

------

## 📚 Documentação da API
A API é documentada utilizando **Swagger (OpenAPI)**, permitindo:

- Visualização dos endpoints disponíveis
- Testes diretos via interface web
- Visualização de schemas e exemplos de payloads

Endpoint de acesso:
```
/swagger
```
---
## 🔐 Tratamento de Erros

A API utiliza códigos HTTP padrão em conjunto com **códigos internos de erro**, permitindo
identificação precisa de falhas de validação, regras de negócio e problemas de autenticação.

Essa abordagem garante padronização das respostas e facilita a comunicação entre backend
e frontend.

📄 Documentação completa disponível em: [`ERROR_CODES.md`](./ERROR_CODES.md)

-----

## 🔐 Segurança e Autenticação

### Estratégia adotada
- Autenticação via **JWT armazenado em Cookie HTTP**
- Autorização baseada em perfis de usuário
- Proteção de rotas sensíveis

### Perfis de acesso:
- **ADMIN**
- **FARMACEUTICO / GERENTE/ FARMACEUTICO_GESTOR**
- **ATENDENTE**

---

## 🔄 Fluxo de Autenticação
1. Usuário realiza login no sistema.
2. Backend gera um **JWT** contendo:
   - id do usuário
   - perfil de acesso
3. Token é armazenado em **cookie HTTP-only**.
4. A cada requisição protegida:
   - cookie é enviado automaticamente pelo navegador
   - middleware valida o JWT
5. Acesso é liberado conforme o perfil do usuário.

---

## 🗄️ Banco de Dados (SQLite)

### Tabelas principais:

usuarios (
id,
nome,
email,
perfil,
hash_de_senha
)

medicamentos (
id,
nome,
fabricante,
principio_ativo,
exige_receita
)

clientes (
id,
nome,
cpf,
data_nascimento
)

medicos (
id,
nome,
crm,
uf_crm
)

vendas (
id,
cliente_id,
usuario_id,
data_venda,
valor_total
)

itens_venda (
id,
venda_id,
medicamento_id,
quantidade,
preco_unitario
)

estoque (id, filial_id, medicamento_id, quantidade, preço, lote, validade)

receitas (
id,
medico_id,
numero_receita,
data_emissao
)

---

## 🧠 Regras de Negócio Críticas
- Medicamentos podem ser **controlados ou não**
- Medicamentos controlados exigem:
  - CRM do médico válido
  - registro de receita médica
- Venda não é finalizada sem validação de receita quando exigido
- Estoque é atualizado automaticamente após a venda
- Não é permitido vender medicamento sem estoque disponível

## Estratégia de Exclusão
O sistema adota soft delete para entidades críticas (vendas, usuários), preservando histórico e rastreabilidade.

---

## 📦 Organização dos Módulos

```
src/modulos/
├── medicamento
├── cliente
├── medico
├── venda
└── usuario
```

Cada módulo contém:

- Controller
- Service
- Repository
- Entity
- DTOs


---

## 🚀 Comunicação Frontend ↔ Backend
- API REST JSON
- Autenticação via cookie JWT
- CORS configurado para segurança
- Tratamento padronizado de erros

---

## 📈 Escalabilidade e Evolução
A arquitetura foi planejada para permitir:
- adição de novos módulos
- desacoplamento de domínios
- migração futura para microsserviços
- implementação de cache
- mensageria (ex: RabbitMQ)



---

