# Project State: Multi-Agent Global Context

Este documento é a "fonte da verdade" compartilhada entre os agentes.

## Status Atual do Projeto

- **Fase**: Inicialização
- **Próxima Etapa**: Definição da Arquitetura (Architect)

## Tabela de Comunicação (Handshake)

| De        | Para             | Artefato                      | Status      |
| --------- | ---------------- | ----------------------------- | ----------- |
| Architect | Backend/Frontend | `swagger.json` / `schema.sql` | ⏳ Pendente |
| Backend   | QA               | API Endpoints / Payloads      | ⏳ Pendente |
| QA        | SRE              | Validation Report             | ⏳ Pendente |
| SRE       | Manager          | Deploy URL / Logs             | ⏳ Pendente |

## Decisões de Arquitetura

- [x] Estrutura Monorepo baseada em Workspaces.
- [x] Persistência: better-sqlite3 (WAL mode).
- [x] Arquitetura: Modular e em Camadas (Microservices Readiness).
- [x] Frontend: SPA puro (TS/HTML/CSS) via Nginx (Porta 80).
- [x] Backend: Node.js/TS via PM2 (Porta 3000).
- [x] Autenticação: JWT + Bcrypt.
- [x] Remoção de Docker/Docker-compose (Deploy nativo).

## Log de Decisões

- **2026-01-31**: Inicialização do monorepo e criação das personas dos agentes.
