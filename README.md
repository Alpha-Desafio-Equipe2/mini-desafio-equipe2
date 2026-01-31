📦 Deploy — FarmaPro MVP (Monorepo)

Este repositório segue uma arquitetura modular em camadas, pronto para deploy em servidor Ubuntu com Nginx e PM2.

🔗 Repositório
GitHub: https://github.com/Alpha-Desafio-Equipe2/mini-desafio-equipe2.git
Branch: fix/update-deploy (Audited by Antigravity)

🖥️ Servidor Alvo
Ubuntu Server
IP: 192.168.1.5

---

1. Preparar o servidor Ubuntu
   1.1 Atualizar sistema
   sudo apt update && sudo apt upgrade -y

1.2 Instalar dependências básicas
sudo apt install -y git curl build-essential

2. Instalar Node.js (LTS) + PM2
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt install -y nodejs
   sudo npm i -g pm2

3. Instalar e configurar Nginx
   sudo apt install -y nginx
   sudo systemctl enable --now nginx

4. Firewall (UFW)
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable

✅ Isso libera portas 22, 80 e 443. 🚫 NÃO libere a porta 3000.

5. Clonar o repositório
   cd /var/www
   sudo git clone -b fix/update-deploy --single-branch https://github.com/Alpha-Desafio-Equipe2/mini-desafio-equipe2.git mini-desafio
   sudo chown -R $USER:$USER /var/www/mini-desafio

6. Configurar Backend (.env)
   cd /var/www/mini-desafio/apps/api
   nano .env

# Use .env.example como base. JWT_SECRET é obrigatório.

7. Banco de Dados e Build

# O backend cria a pasta /data/ automaticamente se não existir.

npm install
npm run build

8. Rodar com PM2
   cd /var/www/mini-desafio
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup

9. Configurar Nginx
   sudo nano /etc/nginx/sites-available/mini-desafio

# Cole o conteúdo do arquivo nginx.conf presente na raiz deste projeto.

sudo ln -s /etc/nginx/sites-available/mini-desafio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

10. Acesso Externo

- Front: http://192.168.1.5/
- Healthcheck: http://192.168.1.5/api/health
- API via Nginx Proxy: http://192.168.1.5/api/...
