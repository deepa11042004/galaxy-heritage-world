import { Request, Response, NextFunction, RequestHandler } from 'express';
import { prisma } from '../config/database.js';

/** Wrap an async handler so rejections reach the central error handler. */
export const h =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 150);
}

export async function audit(
  req: Request,
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: req.user?.id,
      action,
      entityType,
      entityId,
      details: details as any,
      ipAddress: req.ip,
    },
  });
}

export function intParam(value: unknown, fallback: number, min: number, max: number): number {
  const n = parseInt(String(value), 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}
