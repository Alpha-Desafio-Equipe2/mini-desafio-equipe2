# Guia mestre: Deploy do Zero absoluto no Ubuntu Server

Este guia foi criado para quem acabou de contratar um servidor (VPS/Dedicado) com **Ubuntu Server** e precisa colocar o sistema da Farmácia Popular no ar. Siga rigorosamente a ordem abaixo.

---

## 1. Acesso e Segurança Inicial

Acesse seu servidor via terminal (substitua pelo IP real):

```bash
ssh root@seu-ip-aqui
```

### 1.1 Atualização do Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 2. Instalação Manual das Ferramentas (Passo Crucial)

Como o servidor está "vazio", precisamos do Docker para rodar tudo.

### 2.1 Instalar dependências de rede e segurança

```bash
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release git -y
```

### 2.2 Adicionar Chave e Repositório do Docker

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 2.3 Instalar Motores do Docker

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
```

---

## 3. Preparação do Ambiente e Código

### 3.1 Criar a pasta do projeto

```bash
sudo mkdir -p /opt/farma-app
sudo chown $USER:$USER /opt/farma-app
cd /opt/farma-app
```

### 3.2 Clonar o repositório

```bash
git clone https://github.com/Alpha-Desafio-Equipe2/mini-desafio-equipe2.git .
```

### 3.3 Criar pastas de persistência manual

O Docker precisa que essas pastas existam para salvar o banco e os logs:

```bash
mkdir -p backend/src/database
mkdir -p logs
chmod 777 backend/src/database logs
```

### 3.4 Configurar Variavéis de Ambiente (.env)

Este arquivo é o único que o Git não traz (por segurança). Você deve criar o seu:

```bash
nano .env
```

Copie e cole este conteúdo (mude a senha do JWT!):

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=SuaSenhaSuperSecretaECompridaAqui
```

_Pressione `Ctrl+O`, `Enter` e depois `Ctrl+X` para salvar e sair._

---

## 4. O Script `deploy.sh`

O script `deploy.sh` automatiza o build, mas na primeira vez, você precisa dar permissão para ele rodar.

### 4.1 Permissão de execução

```bash
chmod +x deploy.sh
```

### 4.2 Executando o primeiro Deploy

```bash
./deploy.sh
```

---

## 5. O que fazer se algo der errado?

### Ver logs em tempo real

Se o site não abrir, veja o que o backend está dizendo:

```bash
docker compose logs -f backend
```

### Reinicialização forçada

Se quiser apagar tudo e recomeçar o build:

```bash
docker compose down
docker compose up -d --build
```

### 5.3 Problemas com LXC/LXD (Permission Denied / OverlayFS)

Se o seu servidor for um container LXC (comum em laboratórios e VPS específicas), o Docker pode falhar ao montar imagens.
**Solução:**

```bash
sudo apt install fuse-overlayfs -y
sudo nano /etc/docker/daemon.json
```

Coloque este conteúdo:

```json
{
  "storage-driver": "fuse-overlayfs"
}
```

Depois: `sudo systemctl restart docker`.

### Firewall (Se necessário)

Se o firewall do Ubuntu estiver ativo, libere as portas 80 (Web) e 3000 (API):

```bash
sudo ufw allow 80/tcp
sudo ufw allow 3000/tcp
```

---

## 6. URLs de Acesso

- **Administração/Interface**: `http://seu-ip-do-servidor` (O Nginx lida com isso na porta 80).
- **Documentação API**: `http://seu-ip-do-servidor:3000/api-docs` (Se estiver configurado).

---

**Importante**: Sempre mantenha seu arquivo `.env` seguro. Nunca o envie para repositórios públicos.
