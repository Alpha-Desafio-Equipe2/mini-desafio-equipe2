# Project State: Multi-Agent Global Context

Este documento é a "fonte da verdade" compartilhada entre os agentes.

## Status Atual do Projeto

- **Fase**: Pronto para Produção (MVP)
- **Status SRE**: Nginx e PM2 configurados. Escuta em 127.0.0.1 estabelecida.

## Tabela de Comunicação (Handshake)

| De        | Para             | Artefato                      | Status       |
| --------- | ---------------- | ----------------------------- | ------------ |
| Architect | Backend/Frontend | `swagger.json` / `schema.sql` | ✅ Concluído |
| Backend   | QA               | API Endpoints / Payloads      | ✅ Concluído |
| QA        | SRE              | Validation Report             | ✅ Concluído |
| SRE       | Manager          | Deploy URL / Logs             | ✅ Concluído |

## Decisões de Arquitetura

- [x] Estrutura Monorepo baseada em Workspaces.
- [x] Persistência: better-sqlite3 (WAL mode).
- [x] Arquitetura: Modular e em Camadas (Entidades, Repositórios, Use Cases, Controllers).
- [x] Frontend: SPA puro (TS/HTML/CSS) via Nginx (Porta 80) e caminhos relativos (/api).
- [x] Backend: Node.js/TS via PM2 (Porta 3000) escutando apenas localmente.
- [x] Autenticação: JWT + Bcrypt em camadas separadas.
- [x] Remoção de Docker/Docker-compose (Deploy nativo).

## Log de Decisões

- **2026-01-31**: Refatoração total para arquitetura modular concluída.
- **2026-01-31**: Configuração de deploy (Nginx/PM2) auditada e README finalizado.
