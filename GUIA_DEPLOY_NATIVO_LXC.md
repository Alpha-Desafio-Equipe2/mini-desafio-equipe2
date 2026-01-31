# Guia: Deploy Nativo em Ambientes LXC (Sem Docker)

Este guia é a solução definitiva para servidores onde o Docker apresenta erros de permissão ou "Disk quota exceeded" devido a restrições de virtualização (LXC/LXD).

---

## 1. Instalação das Dependências

Instale o Node.js e o Nginx diretamente no seu sistema Ubuntu:

```bash
sudo apt update
sudo apt install nodejs npm nginx -y
```

Verifique as versões:

```bash
node -v
npm -v
```

---

## 2. Preparação do Backend

Entre na pasta do backend, instale as dependências e gere o build:

```bash
cd /opt/farma-app/backend
npm install
npm run build
```

### 2.1 Rodando o Backend (PM2)

O PM2 garante que sua API continue rodando mesmo se você fechar o terminal.

```bash
sudo npm install -g pm2
pm2 start dist/server.js --name "farma-backend" --env production
pm2 save
pm2 startup
```

---

## 3. Configuração da Homepage (Nginx Nativo)

Agora vamos configurar o Nginx para servir sua interface (Frontend) e encaminhar as chamadas da API.

### 3.1 Editar a configuração do site

```bash
sudo nano /etc/nginx/sites-available/default
```

**Apague todo o conteúdo e cole este bloco:**

```nginx
server {
    listen 80;
    server_name _;

    # Pasta onde estão os arquivos da sua Homepage (Frontend)
    root /opt/farma-app/frontend/public;
    index index.html;

    # Suporte para rotas do Frontend (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy para a API do Backend (Porta 3000)
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 3.2 Validar e Reiniciar o Nginx

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4. Verificação

O seu sistema deve estar agora acessível em:

- **Homepage**: `http://lab.alphaedtech.org.br/server12/`
- **Status do Backend**: `pm2 status`

---

**Vantagem**: Este método não exige permissões especiais de Kernel e funciona perfeitamente dentro de containers LXC.
