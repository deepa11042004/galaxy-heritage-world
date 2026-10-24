import { z } from 'zod';
import { prisma } from '../config/database.js';
import { DestinationSchema, HotelSchema, ActivitySchema, ItinerarySchema } from '../shared/index.js';

export interface ResourceConfig {
  /** URL segment under /api/v1/admin */
  key: string;
  /** audit_logs.entity_type */
  entity: string;
  delegate: any;
  /** Create schema; slug may be omitted and is then generated from `titleField`. */
  schema: z.ZodObject<any>;
  titleField: 'name' | 'title';
  searchFields: string[];
  /** Query-string filters the list endpoint accepts: param -> prisma where fragment. */
  filters: Record<string, (value: string) => Record<string, unknown> | undefined>;
  sortable: string[];
  defaultSort: Record<string, 'asc' | 'desc'>;
  /** Optional string columns where '' must be stored as NULL (e.g. unique codes). */
  nullifyEmpty?: string[];
  include?: Record<string, unknown>;
  /** Number of live records that depend on this one (blocks deletion when > 0). */
  dependents?: (id: string) => Promise<{ count: number; label: string }>;
  /** Field holding a destination id that must exist. */
  destinationField?: 'destinationId';
  /** One-to-many child rows edited together with the record (e.g. an itinerary's days). Replaced wholesale on update. */
  children?: { field: string; delegate: any; fk: string; orderBy: Record<string, 'asc' | 'desc'> };
}

const eq = (field: string, allowed?: string[]) => (v: string) =>
  !v || (allowed && !allowed.includes(v)) ? undefined : { [field]: v };

export const resources: Record<string, ResourceConfig> = {
  destinations: {
    key: 'destinations',
    entity: 'Destination',
    delegate: prisma.destination,
    schema: DestinationSchema,
    titleField: 'name',
    searchFields: ['name', 'region', 'country', 'slug'],
    filters: {
      type: eq('type', ['DOMESTIC', 'INTERNATIONAL']),
      country: eq('country'),
    },
    sortable: ['name', 'updatedAt', 'createdAt'],
    defaultSort: { updatedAt: 'desc' },
    include: { _count: { select: { hotels: { where: { deletedAt: null } }, packages: { where: { deletedAt: null } } } } },
    dependents: async (id) => {
      const [hotels, packages] = await Promise.all([
        prisma.hotel.count({ where: { destinationId: id, deletedAt: null } }),
        prisma.package.count({ where: { destinationId: id, deletedAt: null } }),
      ]);
      return { count: hotels + packages, label: `${hotels} hotel(s) and ${packages} package(s)` };
    },
  },
  hotels: {
    key: 'hotels',
    entity: 'Hotel',
    delegate: prisma.hotel,
    schema: HotelSchema,
    titleField: 'name',
    searchFields: ['name', 'locationName', 'state', 'hotelCode', 'slug'],
    filters: {
      category: eq('category', ['ASSOCIATED', 'INTERNAL', 'EXCHANGE']),
      locationType: eq('locationType', ['DOMESTIC', 'INTERNATIONAL']),
      destinationId: eq('destinationId'),
      stayType: (v) => (/^[a-z-]{2,40}$/.test(v) ? { stayTypes: { array_contains: v } } : undefined),
    },
    sortable: ['name', 'locationName', 'updatedAt', 'createdAt', 'ratingStars'],
    defaultSort: { updatedAt: 'desc' },
    nullifyEmpty: ['hotelCode', 'hotelType', 'locationType', 'destinationId', 'state', 'address', 'mapLink'],
    include: { destination: { select: { id: true, name: true } } },
    destinationField: 'destinationId',
  },
  activities: {
    key: 'activities',
    entity: 'Activity',
    delegate: prisma.activity,
    schema: ActivitySchema,
    titleField: 'title',
    searchFields: ['title', 'locationLabel', 'category', 'slug'],
    filters: { category: eq('category') },
    sortable: ['title', 'updatedAt', 'createdAt'],
    defaultSort: { updatedAt: 'desc' },
    nullifyEmpty: ['videoId'],
  },
  itineraries: {
    key: 'itineraries',
    entity: 'Itinerary',
    delegate: prisma.itinerary,
    schema: ItinerarySchema,
    titleField: 'title',
    searchFields: ['title', 'locationLabel', 'category', 'slug'],
    filters: {
      locationType: eq('locationType', ['DOMESTIC', 'INTERNATIONAL']),
      category: eq('category'),
      destinationId: eq('destinationId'),
    },
    sortable: ['title', 'updatedAt', 'createdAt', 'durationDays'],
    defaultSort: { updatedAt: 'desc' },
    nullifyEmpty: ['destinationId', 'badgeText', 'bestTime', 'category', 'locationType'],
    include: { destination: { select: { id: true, name: true } }, _count: { select: { days: true } } },
    destinationField: 'destinationId',
    children: { field: 'days', delegate: prisma.itineraryDay, fk: 'itineraryId', orderBy: { dayNumber: 'asc' } },
  },
};
