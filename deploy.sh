#!/bin/bash
set -e
echo "Deploy automático..."

cd /opt/farma-app
git pull origin main
docker compose down || true
docker image prune -f
docker compose up -d --build
sleep 10
docker compose logs --tail=30 backend
echo "✅ Deploy OK! Acesse:"
echo "  Frontend/Nginx: http://$(curl -4 icanhazip.com)"
echo "  API direta: http://$(curl -4 icanhazip.com):3000"
