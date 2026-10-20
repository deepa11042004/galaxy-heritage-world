/**
 * Read-only logical backup: dumps every Prisma model to one JSON file per table.
 * Usage: npx tsx scripts/backup-db.ts
 * Output: backend/backups/<timestamp>/<table>.json  (git-ignored; contains password hashes)
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dir = path.resolve(process.cwd(), 'backups', stamp);
  fs.mkdirSync(dir, { recursive: true });

  const manifest: Record<string, number> = {};
  for (const model of Prisma.dmmf.datamodel.models) {
    const delegate = (prisma as any)[model.name.charAt(0).toLowerCase() + model.name.slice(1)];
    const rows = await delegate.findMany();
    manifest[model.dbName ?? model.name] = rows.length;
    fs.writeFileSync(
      path.join(dir, `${model.dbName ?? model.name}.json`),
      JSON.stringify(rows, (_k, v) => (typeof v === 'bigint' ? v.toString() : v), 2)
    );
  }
  fs.writeFileSync(path.join(dir, '_manifest.json'), JSON.stringify({ createdAt: stamp, rows: manifest }, null, 2));
  console.log('Backup written to', dir);
  console.table(manifest);
}

main().finally(() => prisma.$disconnect());
