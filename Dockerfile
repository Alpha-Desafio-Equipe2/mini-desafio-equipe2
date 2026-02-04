# Build Stage
FROM node:20-slim AS build

WORKDIR /app

# Install build dependencies for better-sqlite3 (native modules)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./backend/
RUN cd backend && npm ci

COPY backend/ ./backend/
RUN cd backend && npm run build

# Runtime Stage
FROM node:20-slim

WORKDIR /app

# Copy production dependencies and build artifacts
COPY backend/package*.json ./
RUN npm ci --only=production && rm -rf /root/.npm

COPY --from=build /app/backend/dist ./dist

# Create database directory
RUN mkdir -p src/database

EXPOSE 3000
CMD ["npm", "start"]