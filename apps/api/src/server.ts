import { app } from './app.js';
import { config } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/database.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`Galaxy Heritage World API running on port ${PORT} [${config.env}]`);
  logger.info(`Swagger API docs available at http://localhost:${PORT}/api/v1/docs`);
  logger.info(`Health check at http://localhost:${PORT}/api/v1/health`);
});

async function shutdown(signal: string) {
  logger.info(`Received ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Prisma database client disconnected.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forcefully terminating process after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
