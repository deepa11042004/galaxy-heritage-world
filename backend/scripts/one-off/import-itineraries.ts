/**
 * Step 2 of the itinerary import (step 1: scripts/prepare-itinerary-import.py).
 * Upserts each itinerary by slug (existing ones with the same slug are updated, others are left alone) and
 * replaces the day-by-day schedule of the itineraries it imports. All inside one transaction.
 * Links each itinerary to a destination when one of the places in its location label matches a destination name.
 * Usage: npx tsx scripts/one-off/import-itineraries.ts <itineraries.json>
 */
import 'dotenv/config';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

interface Day { dayNumber: number; title: string; description: string }
interface Item {
  slug: string; title: string; badge: string | null; destination: string; type: 'DOMESTIC' | 'INTERNATIONAL' | null;
  category: string | null; durationDays: number; durationNights: number; bestTime: string | null; summary: string;
  highlights: string[]; inclusions: string[]; days: Day[]; images: string[];
}

const prisma = new PrismaClient();

async function main() {
  const items: Item[] = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));
  const destinations = await prisma.destination.findMany({ where: { deletedAt: null }, select: { id: true, name: true } });
  const idByName = new Map(destinations.map((d) => [d.name.toLowerCase(), d.id]));

  const destinationFor = (label: string) => {
    for (const part of label.split(/,|&| and /i).map((p) => p.trim().toLowerCase()).filter(Boolean)) {
      const id = idByName.get(part);
      if (id) return id;
    }
    return null;
  };

  await prisma.$transaction(
    async (tx) => {
      for (const it of items) {
        const data = {
          title: it.title,
          badgeText: it.badge,
          destinationId: destinationFor(it.destination),
          locationLabel: it.destination,
          durationDays: it.durationDays,
          durationNights: it.durationNights,
          heroImageUrl: it.images[0],
          summary: it.summary,
          overview: it.summary,
          inclusions: it.inclusions,
          highlights: it.highlights,
          gallery: it.images.slice(1),
          bestTime: it.bestTime,
          category: it.category,
          locationType: it.type,
          isPublished: true,
          deletedAt: null,
        };
        const row = await tx.itinerary.upsert({ where: { slug: it.slug }, update: data, create: { slug: it.slug, ...data } });
        await tx.itineraryDay.deleteMany({ where: { itineraryId: row.id } });
        await tx.itineraryDay.createMany({
          data: it.days.map((d) => ({ itineraryId: row.id, dayNumber: d.dayNumber, title: d.title, description: d.description })),
        });
        console.log(it.slug, '->', data.destinationId ? 'linked' : 'no destination', `${it.days.length} days`);
      }
    },
    { timeout: 300_000, maxWait: 60_000 }
  );

  const total = await prisma.itinerary.count({ where: { deletedAt: null } });
  console.log({ imported: items.length, itinerariesInDatabase: total });
}

main().finally(() => prisma.$disconnect());
