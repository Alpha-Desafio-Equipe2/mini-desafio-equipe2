# FarmaProx — visão rápida

FarmaPro é um sistema simples para gestão de farmácia popular: cadastro de medicamentos, controle de estoque, registro de vendas e cadastro de clientes e médicos.

O repositório está organizado como um monorepo com duas aplicações principais:

- `apps/api` — API em Node.js/TypeScript (backend)
- `apps/web` — interface web (frontend)

Objetivo deste README: mostrar como começar localmente e onde encontrar a documentação.

## Começando (modo rápido)

### ⚙️ Configuração de ambiente

Antes de rodar o sistema, crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

``` .env
NODE_ENV=production
PORT=3000
DATABASE_PATH=/var/www/mini-desafio/data/database.sqlite
JWT_SECRET="seu_segredo"
ADMIN_PASSWORD="senha1"
CLIENT_PASSWORD="senha2"
```
Depois disso, inicie o sistema conforme orientações abaixo

1. Backend (desenvolvimento)

```bash
cd apps/api
npm install
npm run dev
```

2. Frontend (desenvolvimento)

```bash
cd apps/web
npm install
npm run dev
```

Após isso, a interface web aponta para a API localmente. Consulte as saídas dos terminais para portas exatas.

## Estrutura simples de pastas

```
.
├── apps/
│   ├── api/        # backend (Node.js/TypeScript)
│   └── web/        # frontend
├── data/           # arquivos SQLite e dados locais
├── docs/           # documentação de alto nível
├── packages/       # pacotes internos / types
└── README.md
```

## Arquivo de dados

O projeto usa SQLite para armazenar dados (arquivo em `data/` e esquemas em `apps/api/src/database/schema.ts`). Isso facilita testes locais — para produção recomenda-se migrar para um banco gerenciado.

## Documentação e fluxos

Toda a documentação de alto nível está na pasta `docs/` (arquitetura, esquema do banco, regras de negócio e fluxos de venda/transferência). Veja `docs/ARCHITECTURE.md` para instruções rápidas.

## Autenticação

O sistema usa JWTs para autenticação, enviados via cookie. Observação importante: no código atual de desenvolvimento o cookie é criado com `httpOnly: false` e `secure: false` para facilitar testes pelo frontend. Em produção altere para `httpOnly: true` e `secure: true` no `AuthController`.

## Deploy (resumo)

Existem scripts e um arquivo `ecosystem.config.cjs` para execução com PM2 e exemplos de configuração de proxy reverso (Nginx). Substitua hosts, caminhos e domínios por valores do seu ambiente antes de aplicar em produção.

## Onde mexer

- Código backend: `apps/api/src`
- Esquema do banco: `apps/api/src/database/schema.ts`
- Documentação de alto nível: `docs/`


Consulte a documentação em `docs/` para mais detalhes.
