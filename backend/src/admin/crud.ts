import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { ResourceConfig } from './resources.js';
import { audit, intParam, slugify } from './helpers.js';
import { notifyFrontend } from './revalidate.js';

const idOf = (req: Request): string => String(req.params.id);

function nullify(cfg: ResourceConfig, data: Record<string, unknown>): Record<string, unknown> {
  for (const key of cfg.nullifyEmpty ?? []) if (data[key] === '') data[key] = null;
  return data;
}

async function uniqueSlug(cfg: ResourceConfig, base: string): Promise<string> {
  const root = slugify(base) || 'item';
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const clash = await cfg.delegate.findFirst({ where: { slug: candidate }, select: { id: true } });
    if (!clash) return candidate;
  }
  throw new AppError('Could not generate a unique slug; please enter one manually', 409);
}

async function assertDestination(cfg: ResourceConfig, data: Record<string, unknown>): Promise<void> {
  const id = cfg.destinationField && data[cfg.destinationField];
  if (!id) return;
  const found = await prisma.destination.findFirst({ where: { id: String(id), deletedAt: null }, select: { id: true } });
  if (!found) throw new AppError('Selected destination does not exist', 400);
}

/** Split child rows (e.g. days) out of a parsed payload and number them 1..n in the order given. */
function splitChildren(cfg: ResourceConfig, data: Record<string, any>): { data: Record<string, any>; rows?: Record<string, any>[] } {
  if (!cfg.children) return { data };
  const { [cfg.children.field]: rows, ...rest } = data;
  if (!Array.isArray(rows)) return { data: rest };
  return { data: rest, rows: rows.map((r, i) => ({ ...r, dayNumber: i + 1 })) };
}

export function makeCrud(cfg: ResourceConfig) {
  const createSchema = cfg.schema.partial({ slug: true });
  const updateSchema = cfg.schema.partial();
  const withInclude = cfg.include ? { include: cfg.include } : {};
  // The detail view also loads the child rows so the edit form can show them.
  const withDetail = cfg.children
    ? { include: { ...(cfg.include ?? {}), [cfg.children.field]: { orderBy: cfg.children.orderBy } } }
    : withInclude;

  return {
    async list(req: Request, res: Response) {
      const page = intParam(req.query.page, 1, 1, 100000);
      const limit = intParam(req.query.limit, 20, 1, 100);
      const where: Record<string, any> = { deletedAt: null };

      const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
      if (search) where.OR = cfg.searchFields.map((f) => ({ [f]: { contains: search } }));

      const status = req.query.status;
      if (status === 'published') where.isPublished = true;
      else if (status === 'draft') where.isPublished = false;
      if (req.query.featured === 'true') where.featured = true;

      for (const [param, build] of Object.entries(cfg.filters)) {
        const v = req.query[param];
        if (typeof v === 'string' && v) Object.assign(where, build(v) ?? {});
      }

      const sort = typeof req.query.sort === 'string' && cfg.sortable.includes(req.query.sort) ? req.query.sort : undefined;
      const dir = req.query.dir === 'asc' ? 'asc' : 'desc';
      const orderBy = sort ? { [sort]: dir } : cfg.defaultSort;

      const [total, data] = await Promise.all([
        cfg.delegate.count({ where }),
        cfg.delegate.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit, ...withInclude }),
      ]);

      res.json({ success: true, data, total, page, limit, pages: Math.max(Math.ceil(total / limit), 1) });
    },

    async get(req: Request, res: Response) {
      const row = await cfg.delegate.findFirst({ where: { id: idOf(req), deletedAt: null }, ...withDetail });
      if (!row) throw new AppError(`${cfg.entity} not found`, 404);
      res.json({ success: true, data: row });
    },

    async create(req: Request, res: Response) {
      const parsed = createSchema.parse(req.body) as Record<string, any>;
      nullify(cfg, parsed);
      await assertDestination(cfg, parsed);
      if (parsed.slug) {
        const taken = await cfg.delegate.findFirst({ where: { slug: parsed.slug }, select: { id: true } });
        if (taken) throw new AppError('That slug is already used by another record', 409);
      } else {
        parsed.slug = await uniqueSlug(cfg, parsed[cfg.titleField]);
      }

      const { data: fields, rows } = splitChildren(cfg, parsed);
      const row = await cfg.delegate.create({
        data: rows && rows.length ? { ...fields, [cfg.children!.field]: { create: rows } } : fields,
      });
      await audit(req, `CREATE_${cfg.entity.toUpperCase()}`, cfg.entity, row.id, { title: row[cfg.titleField] });
      notifyFrontend();
      res.status(201).json({ success: true, data: row });
    },

    async update(req: Request, res: Response) {
      const id = idOf(req);
      const existing = await cfg.delegate.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
      if (!existing) throw new AppError(`${cfg.entity} not found`, 404);

      const parsed = updateSchema.parse(req.body) as Record<string, any>;
      nullify(cfg, parsed);
      await assertDestination(cfg, parsed);
      if (parsed.slug) {
        const taken = await cfg.delegate.findFirst({ where: { slug: parsed.slug, NOT: { id } }, select: { id: true } });
        if (taken) throw new AppError('That slug is already used by another record', 409);
      }

      const { data: fields, rows } = splitChildren(cfg, parsed);
      let row;
      if (rows && cfg.children) {
        // Replace the child rows together with the record, atomically.
        const { delegate, fk } = cfg.children;
        [row] = await prisma.$transaction([
          cfg.delegate.update({ where: { id }, data: fields }),
          delegate.deleteMany({ where: { [fk]: id } }),
          ...(rows.length ? [delegate.createMany({ data: rows.map((r) => ({ ...r, [fk]: id })) })] : []),
        ]);
      } else {
        row = await cfg.delegate.update({ where: { id }, data: fields });
      }
      await audit(req, `UPDATE_${cfg.entity.toUpperCase()}`, cfg.entity, id, { fields: Object.keys(parsed) });
      notifyFrontend();
      res.json({ success: true, data: row });
    },

    async setPublished(req: Request, res: Response) {
      const id = idOf(req);
      const { isPublished } = z.object({ isPublished: z.boolean() }).parse(req.body);
      const existing = await cfg.delegate.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
      if (!existing) throw new AppError(`${cfg.entity} not found`, 404);

      const row = await cfg.delegate.update({ where: { id }, data: { isPublished } });
      await audit(req, `${isPublished ? 'PUBLISH' : 'UNPUBLISH'}_${cfg.entity.toUpperCase()}`, cfg.entity, id);
      notifyFrontend();
      res.json({ success: true, data: row });
    },

    async remove(req: Request, res: Response) {
      const id = idOf(req);
      const existing = await cfg.delegate.findFirst({ where: { id, deletedAt: null }, select: { id: true } });
      if (!existing) throw new AppError(`${cfg.entity} not found`, 404);

      if (cfg.dependents) {
        const dep = await cfg.dependents(id);
        if (dep.count > 0) {
          throw new AppError(`Cannot delete: it is still used by ${dep.label}. Reassign or remove them first.`, 409);
        }
      }

      // Soft delete: the row is kept (restorable from the database) but disappears everywhere.
      await cfg.delegate.update({ where: { id }, data: { deletedAt: new Date(), isPublished: false } });
      await audit(req, `DELETE_${cfg.entity.toUpperCase()}`, cfg.entity, id);
      notifyFrontend();
      res.json({ success: true, message: `${cfg.entity} deleted` });
    },
  };
}
