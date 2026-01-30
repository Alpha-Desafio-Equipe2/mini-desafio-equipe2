# Guia Completo: Configuração de Servidor Ubuntu para Deploy com Docker

Este guia detalha o passo a passo para preparar um servidor Ubuntu do absoluto zero, instalar todas as dependências necessárias e realizar o deploy do projeto **Farmácia Popular** utilizando Docker e Docker Compose.

---

## 1. Preparação Inicial e Acesso

### Acesso ao Servidor via SSH

Substitua `usuario` e `ip-do-servidor` pelos dados fornecidos pelo seu provedor (DigitalOcean, AWS, Google Cloud, Linode, etc).

```bash
ssh usuario@ip-do-servidor
```

### Atualização do Sistema

Sempre comece atualizando os índices de pacotes e os pacotes instalados.

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 2. Instalação do Docker e Docker Compose

O Docker é a ferramenta de conteinerização, e o Docker Compose permite gerenciar múltiplos containers (Backend e Nginx) de forma simples.

### Passo 1: Remover versões antigas (se houver)

```bash
sudo apt remove docker docker-engine docker.io containerd runc
```

### Passo 2: Instalar dependências necessárias

```bash
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release -y
```

### Passo 3: Adicionar a chave GPG oficial do Docker

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

### Passo 4: Configurar o repositório

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### Passo 5: Instalação final

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
```

### Passo 6: Verificar instalação

```bash
docker --version
docker compose version
```

---

## 3. Preparação do Projeto e Estrutura de Branches

Atualmente, o projeto está fragmentado em diversas branches. **Antes do deploy**, você deve consolidar o código.

### Branches Principais:

- `backend`: Lógica da API.
- `frontend`: Arquivos estáticos da interface.
- `feature/deploy-docker`: Configurações de Docker atualizadas.
- `main`: Branch de documentação (pode ser usada como alvo do merge final).

### Fluxo de Consolidação (No seu computador local ou no servidor):

1. Crie uma branch de produção (ou use a `main`):
   ```bash
   git checkout main
   git merge backend
   git merge frontend
   git merge feature/deploy-docker
   # Resolva conflitos se houver
   git push origin main
   ```

---

## 4. Passo a Passo do Deploy no Servidor (Detalhado)

Este passo assume que você já consolidou o código em uma branch (ex: `main`) e está logado no servidor via SSH.

### 4.1. Clonando o Repositório

Utilizaremos a pasta `/opt/farma-app` como padrão para a aplicação.

```bash
# Criar o diretório e dar as permissões ao seu usuário
sudo mkdir -p /opt/farma-app
sudo chown $USER:$USER /opt/farma-app
cd /opt/farma-app

# Clonar o repositório (substitua pelo seu link real)
git clone https://github.com/usuario/mini-desafio-equipe2.git .
```

### 4.2. Preparando o Banco de Dados e Logs

O SQLite e os logs do container precisam de pastas físicas no servidor para que os dados não sejam apagados quando o container reiniciar.

```bash
# Criar pastas para persistência
mkdir -p backend/src/database
mkdir -p logs

# Garantir que o Docker tenha permissão de escrita nessas pastas
chmod 777 backend/src/database logs
```

### 4.3. Configurando Segredos (.env)

O arquivo `.env` nunca deve ser enviado para o GitHub. Você deve criá-lo manualmente no servidor.

```bash
# Criar o arquivo de ambiente
nano .env
```

Dentro do editor `nano`, cole e ajuste as seguintes variáveis:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=coloque_uma_frase_muito_longa_e_aleatoria_aqui
```

_Dica: Pressione `CTRL + O` para salvar e `CTRL + X` para sair do nano._

### 4.4. Verificação Pré-Voo

Antes de rodar o Docker, verifique se os arquivos essenciais estão presentes na raiz da pasta:

```bash
ls -la
```

Você **DEVE** ver estes arquivos:

- `docker-compose.yml`: Define como os serviços (Backend/Nginx) se conectam.
- `Dockerfile`: Instruções de como "instalar" o seu Node.js dentro da imagem.
- `package.json`: Lista de dependências que o Docker irá instalar.
- `nginx.conf`: Configurações de Proxy do servidor web.

---

## 5. Comandos Essenciais do Docker

### Subir a Aplicação

O comando abaixo constrói as imagens e sobe os containers em segundo plano (`-d`).

```bash
docker compose up -d --build
```

### Verificar Status

```bash
docker compose ps
```

### Logs em Tempo Real

Para ver o que o backend está processando ou se há erros:

```bash
docker compose logs -f backend
```

### Parar a Aplicação

```bash
docker compose down
```

### Entrar no Container (Debugging)

Se precisar executar comandos dentro da máquina virtual da aplicação:

```bash
docker compose exec backend sh
```

---

## 6. Manutenção e Atualização

Para atualizar o servidor com novas commits do GitHub:

```bash
git pull origin main
docker compose up -d --build
```

### Limpeza de Imagens Antigas

Docker pode ocupar muito espaço em disco com o tempo. Use este comando para remover imagens sem uso:

```bash
docker image prune -f
```

---

## 7. Topologia de Rede (Segurança)

- **Porta 80**: Aberta para o Nginx (Público).
- **Porta 3000**: Usada internamente entre Nginx e Backend.
- **SQLite**: Fica isolado dentro do volume local, inacessível via rede externa.

**Guia Gerado por Antigravity AI**
