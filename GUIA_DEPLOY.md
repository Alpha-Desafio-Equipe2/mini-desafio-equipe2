# Relatório de Preparação para Deploy e Dockerização

Este documento detalha o estado atual do projeto, os pontos que precisam de correção antes do deploy, o que ainda falta implementar e o guia passo a passo para colocar a aplicação em produção em um servidor Ubuntu via Docker.

## 1. Análise da Estrutura Atual

O projeto encontra-se fragmentado em diversas branches (`backend`, `frontend`, `feature/*`). Para um deploy de sucesso, é fundamental realizar o **merge** de todas as funcionalidades para uma branch estável (ex: `main` ou `develop`).

### Pontos Identificados:

- O banco de dados atual é **SQLite** (`better-sqlite3`). A persistência será garantida através de **volumes do Docker**, mapeando o arquivo `.sqlite` para fora do container para evitar perda de dados em reinicializações.
- A branch `main` atualmente contém apenas documentação.
- Existem erros de sintaxe no `schema.ts`.

---

## 2. O que precisa ser corrigido (Correções)

### Erros Críticos:

1.  **Sintaxe no `src/database/schema.ts`**:
    - Na definição da tabela `sale_items`, há um erro de digitação: `):` em vez de `);` ao fechar o `db.exec`.
2.  **Configuração do Nginx**:
    - O arquivo `nginx.conf` deve estar na raiz para que o Docker Compose o localize corretamente.
3.  **Caminhos no `docker-compose.yml`**:
    - O volume do SQLite deve ser mapeado como `./backend/src/database:/app/src/database` para persistência correta.

### Segurança:

- **Exposição de Portas**: No `docker-compose.yml`, o backend expõe a porta `3000:3000`. Em produção, o backend deve ser acessado apenas via Nginx (porta 80). Remova a exposição da porta 3000 ou mantenha-a apenas para testes locais.

---

## 3. O que falta implementar

1.  **Dockerização do Frontend**:
    - Falta um processo de build (ex: `npm run build`) que gere os arquivos estáticos para o Nginx servir no servidor.
2.  **Variáveis de Ambiente (`.env`)**:
    - Configurar um `.env.example` e garantir que segredos como `JWT_SECRET` sejam gerenciados via volumes ou variáveis de ambiente no Docker.
3.  **Certificado SSL (HTTPS)**:
    - Configuração do Certbot no servidor para acesso via HTTPS.
4.  **Persistência de Logs**:
    - Configurar volumes para logs do container.

---

## 4. Passo a Passo para Deploy (Ubuntu Server)

### Passo 1: Preparação do Servidor (SSH)

1.  Acesse o servidor: `ssh usuario@ip-do-servidor`
2.  Atualize o sistema: `sudo apt update && sudo apt upgrade -y`
3.  Instale o Docker e Docker Compose:
    ```bash
    sudo apt install docker.io docker-compose -y
    sudo systemctl enable --now docker
    ```

### Passo 2: Configuração do Ambiente

1.  Clone o repositório (após o merge das branches):
    ```bash
    git clone https://github.com/usuario/projeto.git /opt/pharmacy-app
    cd /opt/pharmacy-app
    ```
2.  Crie as pastas necessárias:
    ```bash
    mkdir -p data logs
    ```

### Passo 3: Configuração do Docker Compose (SQLite)

O `docker-compose.yml` deve garantir a persistência do SQLite:

```yaml
version: "3.8"

services:
  backend:
    build: .
    volumes:
      - ./data:/app/data # Persistência do SQLite no Host
    environment:
      - NODE_ENV=production
    networks:
      - publica
      - privada
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend
    networks:
      - publica
    restart: unless-stopped

networks:
  publica:
    driver: bridge
  privada:
    internal: true
```

### Passo 4: Executar o Deploy

1.  Dê permissão ao script de deploy:
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```

---

## 5. Resumo da Topologia de Rede

O banco **SQLite** é privado por natureza, pois reside fisicamente no container do Backend e não é exposto via rede. A segmentação garante que:

- O **Nginx** é o único ponto de entrada público (Porta 80).
- O **Backend** processa as requisições e gerencia o arquivo de banco localmente em um volume isolado.

## 6. Comandos Úteis

- **Ver logs**: `docker-compose logs -f backend`
- **Reiniciar containers**: `docker-compose down && docker-compose up -d --build`
- **Acessar o container**: `docker exec -it <container_id> sh`
