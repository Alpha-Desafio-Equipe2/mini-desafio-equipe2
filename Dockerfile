FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx tsc  # Compila TS; ajuste se tsconfig diferente

RUN mkdir -p data

EXPOSE 3000
CMD ["npm", "start"]  # Seu script de start/prod