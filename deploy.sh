#!/bin/bash
# Deploy Script for AlphaEdTech Server (/server07)
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting deployment to AlphaEdTech Server..."

# Configuration
SERVER_USER="desafio07"
SERVER_HOST="desafio07.alphaedtech"
SERVER_PATH="/var/www/mini-desafio"
NGINX_CONF="/etc/nginx/sites-available/server07"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Build locally
echo -e "${YELLOW}📦 Building project locally...${NC}"
npm run build --workspace=apps/api
npm run build --workspace=apps/web

# Step 2: Create deployment package
echo -e "${YELLOW}📁 Creating deployment package...${NC}"
mkdir -p deploy-package
cp -r apps deploy-package/
cp package.json deploy-package/
cp ecosystem.config.cjs deploy-package/
cp nginx-server07.conf deploy-package/
cp .env.example deploy-package/apps/api/

# Create tarball
tar -czf deploy.tar.gz -C deploy-package .
rm -rf deploy-package

echo -e "${GREEN}✅ Deployment package created: deploy.tar.gz${NC}"

# Step 3: Transfer to server
echo -e "${YELLOW}📤 Transferring files to server...${NC}"
scp deploy.tar.gz ${SERVER_USER}@${SERVER_HOST}:/tmp/

# Step 4: Deploy on server
echo -e "${YELLOW}🔧 Deploying on server...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
set -e

echo "Creating directory structure..."
sudo mkdir -p /var/www/mini-desafio
cd /var/www/mini-desafio

echo "Extracting deployment package..."
sudo tar -xzf /tmp/deploy.tar.gz -C /var/www/mini-desafio
sudo chown -R desafio07:desafio07 /var/www/mini-desafio

echo "Installing backend dependencies..."
cd /var/www/mini-desafio/apps/api
npm install --production

echo "Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please edit /var/www/mini-desafio/apps/api/.env with production values"
fi

echo "Creating data directory for SQLite..."
mkdir -p /var/www/mini-desafio/data
chmod 755 /var/www/mini-desafio/data

echo "Configuring PM2..."
cd /var/www/mini-desafio/apps/api
pm2 delete farmacia-backend 2>/dev/null || true
pm2 start ../../ecosystem.config.cjs
pm2 save

echo "Configuring Nginx..."
sudo cp /var/www/mini-desafio/nginx-server07.conf ${NGINX_CONF}
sudo ln -sf ${NGINX_CONF} /etc/nginx/sites-enabled/server07
sudo nginx -t
sudo systemctl reload nginx

echo "Cleaning up..."
rm /tmp/deploy.tar.gz

echo "✅ Deployment completed successfully!"
echo "🌐 Application available at: https://lab.alphaedtech.org.br/server07"
ENDSSH

# Cleanup local
rm deploy.tar.gz

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${GREEN}🌐 Access your application at: https://lab.alphaedtech.org.br/server07${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. SSH into server: ssh ${SERVER_USER}@${SERVER_HOST}"
echo "2. Edit .env file: nano /var/www/mini-desafio/apps/api/.env"
echo "3. Restart PM2: pm2 restart farmacia-backend"
echo "4. Check logs: pm2 logs farmacia-backend"
