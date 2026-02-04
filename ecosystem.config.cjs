module.exports = {
  apps: [
    {
      name: 'farma-api',
      script: './apps/api/dist/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // As seguintes variáveis devem ser preferencialmente passadas via .env no servidor
        // JWT_SECRET: '...',
        // DB_PATH: '...'
      },
    },
  ],
};
