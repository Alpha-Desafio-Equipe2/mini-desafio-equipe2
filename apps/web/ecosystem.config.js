module.exports = {
  apps: [
    {
      name: "farma-web",
      script: "npx",
      args: "http-server dist -p 3001 -c-1 --cors",
      interpreter: "none",
      cwd: "/var/www/mini-desafio/apps/web",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
