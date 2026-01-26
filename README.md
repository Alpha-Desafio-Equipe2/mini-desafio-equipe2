# 💊 Sistema de Farmácia Popular

## 📑 Índice
- [📌 Descrição](#-descrição)
- [🎯 Objetivo](#-objetivo)
- [🧱 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [📚 Documentação da API (Swagger)](#-documentação-da-api-swagger)
- [👥 Perfis do Sistema](#-perfis-do-sistema)
- [⚙️ Funcionalidades](#️-funcionalidades)
- [🧠 Regras de Negócio](#-regras-de-negócio)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🗄️ Modelo de Dados](#️-modelo-de-dados)
- [▶️ Como Executar o Projeto](#️-como-executar-o-projeto)
- [🧪 Testes](#-testes)
- [📌 Próximos Passos](#-próximos-passos)
- [📚 Documentação complementar](#-documentação-complementar)
- [📌 Contribuidores](#-contribuidores)
- [📄 Licença](#-licença)


## 📌 Descrição
Este é um sistema backend e frontend para gestão de uma Farmácia Popular, permitindo
o controle de medicamentos, estoque, clientes, médicos e vendas, respeitando regras
de negócio como exigência de receita médica para determinados medicamentos.

O projeto foi desenvolvido com foco em **boas práticas de backend**, **modelagem de domínio**,
**validações de negócio** e **documentação de API**.

---

## 🎯 Objetivo
Este projeto tem como objetivo:
- Simular um sistema real de Farmácia Popular
- Praticar regras de negócio e validações
- Aplicar conceitos de API REST
- Documentar endpoints utilizando Swagger (OpenAPI)
- Servir como projeto de estudo e portfólio

---

## 🧱 Tecnologias Utilizadas
- **Linguagem:** TypeScript
- **Framework Backend:** Express
- **Banco de Dados:** SQLite
- **Autenticação:** JWT via Cookie HTTP-only
- **Documentação da API:** Swagger (OpenAPI)
- **Versionamento:** Git e GitHub

---

## 📚 Documentação da API (Swagger)
A documentação interativa da API é gerada automaticamente via Swagger.

Após executar o projeto, acesse:

```
http://localhost:8080/swagger-ui.html
```

ou
```
http://localhost:3000/swagger-ui.html
```
*(dependendo da porta configurada)*

No Swagger é possível:
- Visualizar todos os endpoints
- Ver modelos de requisição e resposta
- Testar as rotas diretamente pelo navegador

---

## 👥 Perfis do Sistema

### Permissões por Perfil
| Ação | Admin | Gerente | Farmacêutico | Atendente |
|----|----|----|----|----|
| Medicamentos | ✔ | ✔ | ✔ | ✖ |
| Estoque | ✔ | ✔ | ✔ | ✖ |
| Clientes | ✔ | ✔ | ✔ | ✔ |
| Médicos | ✔ | ✔ | ✔ | ✔ |
| Vendas | ✔ | ✔ | ✔ | ✔ |

---

## ⚙️ Funcionalidades

### Medicamentos
- Cadastro de medicamentos com:
  - Nome
  - Fabricante
  - Princípio ativo
  - Indicação se exige receita médica
  - Preço
  - Controle de estoque

### Clientes
- Cadastro de clientes
- Consulta de dados para registro de vendas

### Médicos
- Cadastro de médicos
- Validação por CRM

### Vendas
- Registro de venda de medicamentos
- Validação automática:
  - Se o medicamento exigir receita, o sistema solicita:
    - CRM do médico
    - Dados da receita
- Atualização automática do estoque após a venda

---

## 🧠 Regras de Negócio
- Medicamentos podem ou não exigir receita médica
- Vendas de medicamentos controlados **não podem ser finalizadas** sem os dados do médico e da receita
- O estoque é reduzido automaticamente após a confirmação da venda
- Um medicamento não pode ser vendido se não houver estoque disponível

---
## 📂 Estrutura do Projeto
<details>
<summary><strong>ver estrutura completa </strong></summary>

```
src/
 ├── modules/
 │   ├── auth/
 │   │   ├── AuthController.ts
 │   │   ├── AuthService.ts
 │   │   ├── AuthRoutes.ts
 │   │   └── dtos/
 │   │        └── LoginDTO.ts
 │   │
 │   ├── usuario/
 │   │   ├── UsuarioController.ts
 │   │   ├── UsuarioService.ts
 │   │   ├── UsuarioRepository.ts
 │   │   ├── UsuarioEntity.ts
 │   │   ├── UsuarioRoutes.ts
 │   │   └── dtos/
 |   │
 │   ├── medicamento/
 │   │   ├── MedicamentoController.ts
 │   │   ├── MedicamentoService.ts
 │   │   ├── MedicamentoRepository.ts
 │   │   ├── MedicamentoEntity.ts
 │   │   ├── MedicamentoRoutes.ts
 │   │   └── dtos/
 │   │        ├── CreateMedicamentoDTO.ts
 │   │        └── UpdateMedicamentoDTO.ts
 │   │
 │   ├── cliente/
 │   │   ├── ClienteController.ts
 │   │   ├── ClienteService.ts
 │   │   ├── ClienteRepository.ts
 │   │   ├── ClienteEntity.ts
 │   │   ├── ClienteRoutes.ts
 │   │   └── dtos/
 │   │
 │   ├── medico/
 │   │   ├── MedicoController.ts
 │   │   ├── MedicoService.ts
 │   │   ├── MedicoRepository.ts
 │   │   ├── MedicoEntity.ts
 │   │   ├── MedicoRoutes.ts
 │   │   └── dtos/
 │   │
 │   ├── venda/
 │   │   ├── VendaController.ts
 │   │   ├── VendaService.ts
 │   │   ├── VendaRepository.ts
 │   │   ├── VendaEntity.ts
 │   │   ├── ItemVendaEntity.ts
 │   │   ├── VendaRoutes.ts
 │   │   └── dtos/
 │   │
 ├── shared/
 │   ├── middlewares/
 │   │   ├── authMiddleware.ts
 │   │   ├── errorHandler.ts
 │   │   └── validateRequest.ts
 │   │
 │   ├── errors/
 │   │   └── AppError.ts
 │   │
 │   ├── utils/
 │   │   ├── jwt.ts
 │   │   └── password.ts
 │   │
 │   └── constants/
 │
 ├── config/
 │   ├── database.ts
 │   ├── swagger.ts
 │   ├── env.ts
 │   └── app.ts
 │
 ├── routes.ts
 ├── server.ts
 └── index.ts
 ```
</details>

-----
## 🗄️ Modelo de Dados

A documentação das entidades do banco de dados, seus campos, relacionamentos e regras está disponível em:

- [Banco de Dados](docs/DATABASE.md)

-----
## ▶️ Como Executar o Projeto
Pré-requisitos

* **Node.js** (versão 18 ou superior recomendada)
* **Git**
* **Gerenciador de pacotes**: npm ou yarn

ℹ️ O projeto utiliza **SQLite**, portanto **não é necessário** configurar um banco de dados externo.

### Passos para execução local
``` bash
# clonar o repositório
git clone https://github.com/Alpha-Desafio-Equipe2/mini-desafio-equipe2.git

# entrar na pasta do projeto
cd mini-desafio-equipe2

# instalar as dependências
npm install

# executar a aplicação em ambiente de desenvolvimento
npm run dev
```
Após iniciar o projeto, a API estará disponível em:
```bash
http://localhost:3000
```

E a documentação Swagger em:
```bash
http://localhost:3000/swagger
```

### Variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com as configurações necessárias:

```env
PORT=3000
JWT_SECRET=your-secret-key
```

------
## 🧪 Testes

```bash
npm test
```

-----
## 📌 Próximos Passos

- Refinar controle de permissões por perfil
- Adicionar relatórios de vendas
- Implementar testes automatizados
- Migrar banco para PostgreSQL
- Dockerizar a aplicação

----- 
## 📚 Documentação complementar
- [Arquitetura](docs/ARCHITECTURE.md)
- [Guia de Uso](docs/USAGE.md)
- [Diagramas](docs/DIAGRAMS.md)
---

## 📌 Contribuidores
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/breno-wesley">
        <img loading="lazy" src="https://avatars.githubusercontent.com/breno-wesley?v=4" width=115><br>
        <sub>Breno Wesley</sub><br>
      </a>  
    </td>
    <td align="center">
      <!-- <a href="https://github.com/RangelMRK">
        <img loading="lazy" src="https://avatars.githubusercontent.com/RangelMRK?v=4" width=115><br> -->
        <sub>Danilo Martinez</sub><br>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/DGILADS">
        <img loading="lazy" src="https://avatars.githubusercontent.com/DGILADS?v=4" width=115><br>
        <sub>Diego Gil</sub><br>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Elisabete-MO">
        <img loading="lazy" src="https://avatars.githubusercontent.com/Elisabete-MO?v=4" width=115><br>
        <sub>Elisabete Oliveira</sub><br>
      </a>
    </td>
    <td align="center">
      <!-- <a href="https://github.com/RangelMRK">
        <img loading="lazy" src="https://avatars.githubusercontent.com/RangelMRK?v=4" width=115><br> -->
        <sub>Luiz Angelo</sub><br>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/thallis075">
        <img loading="lazy" src="https://avatars.githubusercontent.com/thalus075?v=4" width=115><br>
        <sub>Thallis Ferreira</sub><br>
      </a>
    </td>
  </tr>
</table>

------
## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.
