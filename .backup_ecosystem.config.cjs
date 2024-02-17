// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'app.js', // Replace with the actual entry point of your application
      instances: 4,
      exec_mode: 'fork', // Run the app in cluster mode to utilize multiple CPU cores
      autorestart: true,
      watch: false, // Disable file watching
      max_memory_restart: '2G', // Restart if the memory usage exceeds 1GB
      env: {
        NODE_ENV: 'production',
        PORT: 3000, // Specify your application's port
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ]
};
