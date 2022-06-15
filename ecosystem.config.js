module.exports = {
  apps: [
    {
      name: "scottylol",
      script: "npm start",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      max_memory_restart: "1G",
      env: {
        PORT: 3000,
        COMMAND_DIR: "./commands",
      },
    },
  ],
  deploy: {
    production: {
      user: "www-data",
      host: "pittsburgh.scottylabs.org",
      key: "deploy.key",
      ref: "origin/main",
      repo: "https://github.com/ScottyLabs/scottylol",
      path: "/opt/github/scottylol",
      "post-deploy":
        "npm install --production=false && npm run build && npm prune && pm2 reload ecosystem.config.js --env production && pm2 save",
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
