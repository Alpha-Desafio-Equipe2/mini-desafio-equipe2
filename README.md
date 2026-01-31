# 📦 FarmaPro MVP - Guia de Deploy

Sistema de gerenciamento de farmácia popular desenvolvido em arquitetura monorepo com backend Node.js/Express e frontend moderno.

## 🔗 Repositório

- **GitHub**: [Alpha-Desafio-Equipe2/mini-desafio-equipe2](https://github.com/Alpha-Desafio-Equipe2/mini-desafio-equipe2.git)
- **Branch Principal**: `fix/update-deploy`

---

## 📋 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Deploy Local (Raiz)](#-deploy-local-raiz)
3. [Deploy Remoto (AlphaEdTech /server07)](#-deploy-remoto-alphaedtech-server07)
4. [Configuração de Ambiente](#-configuração-de-ambiente)
5. [Verificação e Troubleshooting](#-verificação-e-troubleshooting)

---

## 🛠️ Pré-requisitos

### Servidor Ubuntu (18.04+)

```bash
# 1. Atualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependências básicas
sudo apt install -y git curl build-essential

# 3. Instalar Node.js LTS (v18+)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Instalar PM2 globalmente
sudo npm install -g pm2

# 5. Instalar e habilitar Nginx
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# 6. Configurar Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

> ⚠️ **IMPORTANTE**: NÃO exponha a porta 3000 externamente. O backend deve ser acessado apenas via proxy Nginx.

---

## 🏠 Deploy Local (Raiz)

Deploy para servidor local servindo a aplicação na raiz do domínio (ex: `http://192.168.1.5/`).

### 1. Clonar Repositório

```bash
cd /var/www
sudo git clone -b fix/update-deploy --single-branch \
  https://github.com/Alpha-Desafio-Equipe2/mini-desafio-equipe2.git mini-desafio
sudo chown -R $USER:$USER /var/www/mini-desafio
cd /var/www/mini-desafio
```

### 2. Configurar Variáveis de Ambiente

```bash
cd /var/www/mini-desafio/apps/api
nano .env
```

**Exemplo de `.env`**:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=seu_secret_super_seguro_aqui_min_32_chars
DB_PATH=../../data/database.sqlite
```

> 🔐 **CRÍTICO**: Gere um `JWT_SECRET` forte e único para produção!

### 3. Build da Aplicação

```bash
cd /var/www/mini-desafio

# Instalar dependências do backend
cd apps/api
npm install --production
npm run build

# Instalar dependências do frontend
cd ../web
npm install
npm run build
```

### 4. Iniciar com PM2

```bash
cd /var/www/mini-desafio
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # Seguir instruções exibidas
```

### 5. Configurar Nginx (Raiz)

```bash
sudo nano /etc/nginx/sites-available/mini-desafio
```

**Cole o conteúdo do arquivo `nginx.conf`** (disponível na raiz do projeto):

```nginx
server {
    listen 80;
    server_name 192.168.1.5;  # Ajuste para seu IP/domínio

    # Frontend - Servir arquivos estáticos
    root /var/www/mini-desafio/apps/web/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Proxy reverso
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Ativar configuração**:

```bash
sudo ln -s /etc/nginx/sites-available/mini-desafio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Acessar Aplicação

- **Frontend**: http://192.168.1.5/
- **API Health**: http://192.168.1.5/api/health
- **Swagger Docs**: http://192.168.1.5/api/docs

---

## 🌐 Deploy Remoto (AlphaEdTech /server07)

Deploy para o servidor AlphaEdTech servindo a aplicação no subpath `/server07`.

### Opção A: Deploy Automatizado (Recomendado)

```bash
# No seu ambiente local
cd /Users/diegogil/miniDesafio/mini-desafio-equipe2
./deploy.sh
```

O script `deploy.sh` automatiza:

- ✅ Build local do projeto
- ✅ Criação de pacote de deploy
- ✅ Transferência via SCP
- ✅ Instalação no servidor
- ✅ Configuração PM2 e Nginx

### Opção B: Deploy Manual

#### 1. Build Local

```bash
# No seu ambiente local
npm run build --workspace=apps/api
npm run build --workspace=apps/web
```

#### 2. Transferir Arquivos

```bash
# Criar pacote
tar -czf deploy.tar.gz \
  apps/api/dist \
  apps/web/dist \
  apps/api/package.json \
  ecosystem.config.cjs \
  nginx-server07.conf

# Enviar para servidor
scp deploy.tar.gz desafio07@desafio07.alphaedtech:/tmp/
```

#### 3. Configurar no Servidor

```bash
# SSH no servidor
ssh desafio07@desafio07.alphaedtech

# Extrair arquivos
sudo mkdir -p /var/www/mini-desafio
cd /var/www/mini-desafio
sudo tar -xzf /tmp/deploy.tar.gz
sudo chown -R desafio07:desafio07 /var/www/mini-desafio

# Instalar dependências
cd apps/api
npm install --production

# Configurar .env
nano .env
```

**Exemplo `.env` para AlphaEdTech**:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=seu_secret_super_seguro_aqui_min_32_chars
DB_PATH=../../data/database.sqlite
BASE_PATH=/server07
```

#### 4. Configurar PM2

```bash
cd /var/www/mini-desafio
pm2 delete farma-api 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
```

#### 5. Configurar Nginx (Subpath /server07)

```bash
sudo nano /etc/nginx/sites-available/server07
```

**Cole o conteúdo do arquivo `nginx-server07.conf`**:

```nginx
# Frontend - Servir arquivos estáticos de /server07
location /server07 {
    alias /var/www/mini-desafio/apps/web/dist;
    try_files $uri $uri/ /server07/index.html;

    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API - Proxy para Node.js
location /server07/api/ {
    rewrite ^/server07/api/(.*) /$1 break;
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Health check
location /server07/health {
    rewrite ^/server07/health$ /health break;
    proxy_pass http://127.0.0.1:3000;
    access_log off;
}
```

**Ativar configuração**:

```bash
sudo ln -sf /etc/nginx/sites-available/server07 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. Acessar Aplicação

- **Frontend**: https://lab.alphaedtech.org.br/server07
- **API Health**: https://lab.alphaedtech.org.br/server07/health
- **Swagger Docs**: https://lab.alphaedtech.org.br/server07/api/docs

---

## ⚙️ Configuração de Ambiente

### Variáveis Obrigatórias (.env)

| Variável     | Descrição                        | Exemplo                      |
| ------------ | -------------------------------- | ---------------------------- |
| `NODE_ENV`   | Ambiente de execução             | `production`                 |
| `PORT`       | Porta do backend                 | `3000`                       |
| `JWT_SECRET` | Chave secreta JWT (min 32 chars) | `abc123...`                  |
| `DB_PATH`    | Caminho do banco SQLite          | `../../data/database.sqlite` |
| `BASE_PATH`  | Subpath da aplicação (opcional)  | `/server07`                  |

### Estrutura de Diretórios

```
/var/www/mini-desafio/
├── apps/
│   ├── api/
│   │   ├── dist/          # Backend compilado
│   │   ├── .env           # Variáveis de ambiente
│   │   └── package.json
│   └── web/
│       └── dist/          # Frontend compilado
├── data/
│   └── database.sqlite    # Banco de dados SQLite
└── ecosystem.config.cjs   # Configuração PM2
```

---

## 🔍 Verificação e Troubleshooting

### Verificar Status dos Serviços

```bash
# PM2
pm2 status
pm2 logs farma-api
pm2 monit

# Nginx
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log

# Testar endpoints
curl http://localhost:3000/health
curl http://192.168.1.5/api/health
```

### Problemas Comuns

#### ❌ Erro 502 Bad Gateway

**Causa**: Backend não está rodando ou PM2 falhou.

**Solução**:

```bash
pm2 restart farma-api
pm2 logs farma-api --lines 50
```

#### ❌ Erro 404 em rotas do frontend

**Causa**: Configuração `try_files` do Nginx incorreta.

**Solução**: Verificar se o `try_files` está apontando para `/index.html` (raiz) ou `/server07/index.html` (subpath).

#### ❌ CORS errors

**Causa**: Frontend tentando acessar backend diretamente na porta 3000.

**Solução**: Garantir que o frontend usa `/api/` (raiz) ou `/server07/api/` (subpath) nas requisições.

#### ❌ JWT_SECRET não configurado

**Causa**: Variável `JWT_SECRET` ausente no `.env`.

**Solução**:

```bash
cd /var/www/mini-desafio/apps/api
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
pm2 restart farma-api
```

### Logs Úteis

```bash
# Logs do PM2
pm2 logs farma-api --lines 100

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs do sistema
journalctl -u nginx -f
```

### Comandos de Manutenção

```bash
# Reiniciar serviços
pm2 restart farma-api
sudo systemctl restart nginx

# Atualizar código
cd /var/www/mini-desafio
git pull origin fix/update-deploy
npm run build --workspace=apps/api
npm run build --workspace=apps/web
pm2 restart farma-api

# Backup do banco de dados
cp /var/www/mini-desafio/data/database.sqlite \
   /var/www/mini-desafio/data/database.sqlite.backup.$(date +%Y%m%d)
```

---

## 📞 Suporte

Para problemas ou dúvidas, consulte:

- **Documentação da API**: `/api/docs` (Swagger)
- **Logs do sistema**: `pm2 logs` e `/var/log/nginx/`
- **Repositório**: [GitHub Issues](https://github.com/Alpha-Desafio-Equipe2/mini-desafio-equipe2/issues)
