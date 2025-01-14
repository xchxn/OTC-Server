module.exports = {
  apps: [{
    name: 'OTP Server',
    script: 'dist/main.js',
    instances: 2,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'prod'
    },
    env_production: {
      NODE_ENV: 'prod'
    }
  }]
};