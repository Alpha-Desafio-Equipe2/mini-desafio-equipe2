#!/bin/bash
# Manual Deployment Guide for AlphaEdTech Server
# Use this if the automated deploy.sh script fails

echo "📚 Manual Deployment Guide for /server07"
echo "=========================================="
echo ""

# Server Info
echo "🖥️  SERVER INFORMATION"
echo "Host: desafio07.alphaedtech"
echo "User: desafio07"
echo "Password: Code2025\$@"
echo "Domain: https://lab.alphaedtech.org.br/server07"
echo ""

# Step 1
echo "STEP 1: Build Project Locally"
echo "------------------------------"
echo "cd /Users/diegogil/miniDesafio/mini-desafio-equipe2"
echo "npm run build --workspace=apps/api"
echo "npm run build --workspace=apps/web"
echo ""

# Step 2
echo "STEP 2: Transfer Files to Server"
echo "---------------------------------"
echo "# Option A: Using SCP"
echo "scp -r apps desafio07@desafio07.alphaedtech:/tmp/"
echo "scp package.json ecosystem.config.cjs nginx-server07.conf desafio07@desafio07.alphaedtech:/tmp/"
echo ""
echo "# Option B: Using rsync (recommended)"
echo "rsync -avz --progress apps/ desafio07@desafio07.alphaedtech:/tmp/apps/"
echo "rsync -avz package.json ecosystem.config.cjs nginx-server07.conf desafio07@desafio07.alphaedtech:/tmp/"
echo ""

# Step 3
echo "STEP 3: Connect to Server"
echo "-------------------------"
echo "ssh desafio07@desafio07.alphaedtech"
echo "# Password: Code2025\$@"
echo ""

# Step 4
echo "STEP 4: Setup on Server (run these commands after SSH)"
echo "-------------------------------------------------------"
cat << 'EOF'

# Create directory structure
sudo mkdir -p /var/www/mini-desafio
sudo chown -R desafio07:desafio07 /var/www/mini-desafio

# Move files from /tmp
mv /tmp/apps /var/www/mini-desafio/
mv /tmp/package.json /var/www/mini-desafio/
mv /tmp/ecosystem.config.cjs /var/www/mini-desafio/
mv /tmp/nginx-server07.conf /var/www/mini-desafio/

# Install backend dependencies
cd /var/www/mini-desafio/apps/api
npm install --production

# Setup environment variables
cp .env.example .env
nano .env  # Edit with your production values

# Create database directory
mkdir -p /var/www/mini-desafio/data
chmod 755 /var/www/mini-desafio/data

# Configure PM2
cd /var/www/mini-desafio/apps/api
pm2 delete farmacia-backend 2>/dev/null || true
pm2 start ../../ecosystem.config.cjs
pm2 save
pm2 startup  # Follow instructions if needed

# Configure Nginx
sudo cp /var/www/mini-desafio/nginx-server07.conf /etc/nginx/sites-available/server07
sudo ln -sf /etc/nginx/sites-available/server07 /etc/nginx/sites-enabled/server07
sudo nginx -t
sudo systemctl reload nginx

EOF
echo ""

# Step 5
echo "STEP 5: Verify Deployment"
echo "-------------------------"
echo "# Check PM2 status"
echo "pm2 status"
echo "pm2 logs farmacia-backend"
echo ""
echo "# Check Nginx status"
echo "sudo systemctl status nginx"
echo "sudo nginx -t"
echo ""
echo "# Test the application"
echo "curl http://localhost:3000/health"
echo "curl http://localhost/server07/"
echo ""
echo "# Access from browser"
echo "https://lab.alphaedtech.org.br/server07"
echo ""

# Troubleshooting
echo "🔧 TROUBLESHOOTING"
echo "-----------------"
echo "# If PM2 fails:"
echo "pm2 logs farmacia-backend --lines 50"
echo "pm2 restart farmacia-backend"
echo ""
echo "# If Nginx fails:"
echo "sudo nginx -t"
echo "sudo tail -f /var/log/nginx/error.log"
echo ""
echo "# Check file permissions:"
echo "ls -la /var/www/mini-desafio"
echo "sudo chown -R desafio07:desafio07 /var/www/mini-desafio"
echo ""
echo "# Database issues:"
echo "ls -la /var/www/mini-desafio/data"
echo "chmod 755 /var/www/mini-desafio/data"
echo ""

echo "✅ Manual deployment guide complete!"
