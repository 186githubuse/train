const app = require('./app');
const { env } = require('./config/env');

const server = app.listen(env.port, () => {
  console.log(`[backend] listening on port ${env.port}`);
});

server.on('error', (error) => {
  console.error('[backend] failed to start', error);
  process.exit(1);
});
