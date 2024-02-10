// ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'backend-instance-1',
      script: 'app.js', // Replace with the actual entry point of your application
      instances: 1,
      exec_mode: 'fork', // Run the app in cluster mode to utilize multiple CPU cores
      autorestart: true,
      watch: false, // Disable file watching
      max_memory_restart: '2G', // Restart if the memory usage exceeds 1GB
      env: {
        NODE_ENV: 'production',
        PORT: 3001, // Specify your application's port
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },

    {
      name: 'backend-instance-2',
      script: 'app.js', // Replace with the actual entry point of your application
      instances: 1,
      exec_mode: 'fork', // Run the app in cluster mode to utilize multiple CPU cores
      autorestart: true,
      watch: false, // Disable file watching
      max_memory_restart: '2G', // Restart if the memory usage exceeds 1GB
      env: {
        NODE_ENV: 'production',
        PORT: 3002, // Specify your application's port
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },

    {
      name: 'backend-instance-3',
      script: 'app.js', // Replace with the actual entry point of your application
      instances: 1,
      exec_mode: 'fork', // Run the app in cluster mode to utilize multiple CPU cores
      autorestart: true,
      watch: false, // Disable file watching
      max_memory_restart: '2G', // Restart if the memory usage exceeds 1GB
      env: {
        NODE_ENV: 'production',
        PORT: 3003, // Specify your application's port
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
    },

    {
      name: 'backend-instance-4',
      script: 'app.js', // Replace with the actual entry point of your application
      instances: 1,
      exec_mode: 'fork', // Run the app in cluster mode to utilize multiple CPU cores
      autorestart: true,
      watch: false, // Disable file watching
      max_memory_restart: '2G', // Restart if the memory usage exceeds 1GB
      env: {
        NODE_ENV: 'production',
        PORT: 3004, // Specify your application's port
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3004,
      },
    },
  ]
};
