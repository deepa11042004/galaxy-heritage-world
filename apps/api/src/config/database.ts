import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'warn' },
        ]
      : [{ emit: 'event', level: 'error' }],
});

// @ts-ignore
prisma.$on('error', (e: any) => {
  logger.error({ err: e }, 'Prisma Database Error');
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('Connected successfully to MySQL database via Prisma');
    return true;
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect to MySQL database');
    return false;
  }
}
