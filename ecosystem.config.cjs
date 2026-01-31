module.exports = {
  apps: [
    {
      name: 'api-server',
      script: './apps/api/dist/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
