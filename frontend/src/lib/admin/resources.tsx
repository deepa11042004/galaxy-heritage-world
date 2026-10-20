import React from 'react';

export type Row = Record<string, any>;

export type FieldDef =
  | { kind: 'text' | 'textarea' | 'number'; name: string; label: string; required?: boolean; placeholder?: string; help?: string; rows?: number; min?: number; max?: number; half?: boolean; maxLength?: number }
  | { kind: 'slug'; name: string; label: string; from: string; help?: string; half?: boolean }
  | { kind: 'select'; name: string; label: string; options: { value: string; label: string }[] | 'destinations'; required?: boolean; emptyLabel?: string; half?: boolean }
  | { kind: 'combo'; name: string; label: string; suggestions: string[]; required?: boolean; half?: boolean; help?: string }
  | { kind: 'switch'; name: string; label: string; help?: string }
  | { kind: 'list'; name: string; label: string; help?: string; placeholder?: string }
  | { kind: 'image'; name: string; label: string; required?: boolean; help?: string }
  | { kind: 'gallery'; name: string; label: string; help?: string };

export interface Section {
  title: string;
  description?: string;
  fields: FieldDef[];
}

export interface Column {
  label: string;
  className?: string;
  render: (row: Row) => React.ReactNode;
}

export interface FilterDef {
  param: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface ResourceConfig {
  /** API segment under /admin and the admin URL segment */
  key: string;
  /** admin URL segment when it differs from the API key */
  route: string;
  singular: string;
  plural: string;
  titleField: 'name' | 'title';
  /** folder used for uploaded images */
  folder: string;
  /** public site path for "View live" */
  publicPath: (row: Row) => string;
  imageOf: (row: Row) => string | undefined;
  columns: Column[];
  filters: FilterDef[];
  sections: Section[];
  defaults: Row;
}

const Muted = ({ children }: { children: React.ReactNode }) => <span className="text-ink-muted">{children}</span>;

const money = (v: unknown) =>
  v === null || v === undefined || v === '' ? '—' : `₹${Number(v).toLocaleString('en-IN')}`;

const DOMESTIC_INTL = [
  { value: 'DOMESTIC', label: 'Domestic' },
  { value: 'INTERNATIONAL', label: 'International' },
];

// ---------------------------------------------------------------- destinations
export const destinations: ResourceConfig = {
  key: 'destinations',
  route: 'destinations',
  singular: 'Destination',
  plural: 'Destinations',
  titleField: 'name',
  folder: 'destinations',
  publicPath: (r) => `/destinations/${r.slug}`,
  imageOf: (r) => r.heroImageUrl,
  columns: [
    { label: 'Destination', render: (r) => (<><p className="font-semibold text-ink">{r.name}</p><p className="text-xs text-ink-muted">{r.region}, {r.country}</p></>) },
    { label: 'Type', className: 'hidden md:table-cell', render: (r) => <Muted>{r.type === 'DOMESTIC' ? 'Domestic' : 'International'}</Muted> },
    { label: 'Hotels', className: 'hidden lg:table-cell', render: (r) => <Muted>{r._count?.hotels ?? 0}</Muted> },
    { label: 'Packages', className: 'hidden lg:table-cell', render: (r) => <Muted>{r._count?.packages ?? 0}</Muted> },
  ],
  filters: [{ param: 'type', label: 'All types', options: DOMESTIC_INTL }],
  defaults: { type: 'DOMESTIC', country: 'India', isPublished: false, featured: false, gallery: [], highlights: [] },
  sections: [
    {
      title: 'Basics',
      fields: [
        { kind: 'text', name: 'name', label: 'Name', required: true, half: true },
        { kind: 'slug', name: 'slug', label: 'URL slug', from: 'name', half: true, help: 'Used in the page address. Changing it breaks existing links.' },
        { kind: 'text', name: 'region', label: 'State / region', required: true, half: true },
        { kind: 'text', name: 'country', label: 'Country', required: true, half: true },
        { kind: 'select', name: 'type', label: 'Type', options: DOMESTIC_INTL, required: true, half: true },
        { kind: 'text', name: 'bestTimeToVisit', label: 'Best time to visit', half: true, placeholder: 'October to March' },
        { kind: 'text', name: 'tagline', label: 'Tagline', maxLength: 255 },
        { kind: 'textarea', name: 'description', label: 'Description', required: true, rows: 6 },
        { kind: 'list', name: 'highlights', label: 'Highlights', help: 'One per line.' },
      ],
    },
    {
      title: 'Images',
      fields: [
        { kind: 'image', name: 'heroImageUrl', label: 'Cover image', required: true },
        { kind: 'gallery', name: 'gallery', label: 'Gallery' },
      ],
    },
    {
      title: 'SEO',
      description: 'Optional. Leave blank to use the defaults.',
      fields: [
        { kind: 'text', name: 'metaTitle', label: 'Meta title', maxLength: 255 },
        { kind: 'textarea', name: 'metaDescription', label: 'Meta description', rows: 3, maxLength: 500 },
      ],
    },
    {
      title: 'Visibility',
      fields: [
        { kind: 'switch', name: 'isPublished', label: 'Published', help: 'Unpublished destinations are hidden from the website.' },
        { kind: 'switch', name: 'featured', label: 'Featured', help: 'Shown first on listings.' },
      ],
    },
  ],
};

// ---------------------------------------------------------------- hotels
export const hotels: ResourceConfig = {
  key: 'hotels',
  route: 'hotels',
  singular: 'Hotel',
  plural: 'Hotels & Resorts',
  titleField: 'name',
  folder: 'hotels',
  publicPath: (r) => `/hotels-resorts/${r.slug}`,
  imageOf: (r) => r.imageUrl,
  columns: [
    { label: 'Property', render: (r) => (<><p className="font-semibold text-ink">{r.name}</p><p className="text-xs text-ink-muted">{r.locationName}{r.state ? `, ${r.state}` : ''}</p></>) },
    { label: 'Category', className: 'hidden md:table-cell', render: (r) => <Muted>{({ ASSOCIATED: 'Associated', INTERNAL: 'Internal', EXCHANGE: 'Exchange' } as Record<string, string>)[r.category] ?? r.category}</Muted> },
    { label: 'Stars', className: 'hidden lg:table-cell', render: (r) => <Muted>{'★'.repeat(r.ratingStars || 0)}</Muted> },
    { label: 'Destination', className: 'hidden xl:table-cell', render: (r) => <Muted>{r.destination?.name ?? '—'}</Muted> },
  ],
  filters: [
    { param: 'category', label: 'All categories', options: [{ value: 'ASSOCIATED', label: 'Associated' }, { value: 'INTERNAL', label: 'Internal' }, { value: 'EXCHANGE', label: 'Exchange' }] },
    { param: 'locationType', label: 'Domestic & intl.', options: DOMESTIC_INTL },
  ],
  defaults: { category: 'ASSOCIATED', ratingStars: 4, country: 'India', isPublished: false, featured: false, gallery: [], amenities: [], imageUrl: '' },
  sections: [
    {
      title: 'Basics',
      fields: [
        { kind: 'text', name: 'name', label: 'Property name', required: true, half: true },
        { kind: 'slug', name: 'slug', label: 'URL slug', from: 'name', half: true, help: 'Used in the page address. Changing it breaks existing links.' },
        { kind: 'select', name: 'category', label: 'Category', required: true, half: true, options: [{ value: 'ASSOCIATED', label: 'Associated partner' }, { value: 'INTERNAL', label: 'Internal (luxury)' }, { value: 'EXCHANGE', label: 'Exchange' }] },
        { kind: 'select', name: 'ratingStars', label: 'Star rating', required: true, half: true, options: [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n} star${n > 1 ? 's' : ''}` })) },
        { kind: 'textarea', name: 'description', label: 'Description', required: true, rows: 6 },
        { kind: 'list', name: 'amenities', label: 'Amenities', help: 'One per line, e.g. Swimming pool.' },
      ],
    },
    {
      title: 'Location',
      fields: [
        { kind: 'text', name: 'locationName', label: 'City / location', required: true, half: true },
        { kind: 'text', name: 'state', label: 'State', half: true },
        { kind: 'text', name: 'country', label: 'Country', required: true, half: true },
        { kind: 'select', name: 'locationType', label: 'Domestic / international', half: true, options: DOMESTIC_INTL, emptyLabel: 'Not set' },
        { kind: 'select', name: 'destinationId', label: 'Linked destination', options: 'destinations', emptyLabel: 'None' },
        { kind: 'textarea', name: 'address', label: 'Address', rows: 2 },
        { kind: 'text', name: 'mapLink', label: 'Map link', placeholder: 'https://maps.google.com/…' },
      ],
    },
    {
      title: 'Images',
      fields: [
        { kind: 'image', name: 'imageUrl', label: 'Cover image' },
        { kind: 'gallery', name: 'gallery', label: 'Gallery' },
      ],
    },
    {
      title: 'Catalogue',
      description: 'Internal identifiers from the property catalogue.',
      fields: [
        { kind: 'text', name: 'hotelCode', label: 'Hotel code', half: true, maxLength: 30 },
        { kind: 'text', name: 'hotelType', label: 'Hotel type', half: true, maxLength: 30 },
      ],
    },
    {
      title: 'Visibility',
      fields: [
        { kind: 'switch', name: 'isPublished', label: 'Published', help: 'Unpublished hotels are hidden from the website.' },
        { kind: 'switch', name: 'featured', label: 'Featured' },
      ],
    },
  ],
};

// ---------------------------------------------------------------- packages
export const packages: ResourceConfig = {
  key: 'packages',
  route: 'packages',
  singular: 'Package',
  plural: 'Vacation Packages',
  titleField: 'title',
  folder: 'packages',
  publicPath: (r) => `/vacation-packages/${r.slug}`,
  imageOf: (r) => r.heroImageUrl,
  columns: [
    { label: 'Package', render: (r) => (<><p className="font-semibold text-ink">{r.title}</p><p className="text-xs text-ink-muted">{r.locationLabel}</p></>) },
    { label: 'Duration', className: 'hidden md:table-cell', render: (r) => <Muted>{r.durationNights}N / {r.durationDays}D</Muted> },
    { label: 'Price from', className: 'hidden md:table-cell', render: (r) => <Muted>{r.priceLabel || money(r.priceStarting)}</Muted> },
    { label: 'Destination', className: 'hidden xl:table-cell', render: (r) => <Muted>{r.destination?.name ?? '—'}</Muted> },
  ],
  filters: [],
  defaults: { category: 'Holiday Package', durationDays: 3, durationNights: 2, isPublished: false, featured: false, inclusions: [], exclusions: [], highlights: [] },
  sections: [
    {
      title: 'Basics',
      fields: [
        { kind: 'text', name: 'title', label: 'Title', required: true, half: true },
        { kind: 'slug', name: 'slug', label: 'URL slug', from: 'title', half: true, help: 'Used in the page address. Changing it breaks existing links.' },
        { kind: 'text', name: 'subtitle', label: 'Subtitle', maxLength: 255 },
        { kind: 'text', name: 'locationLabel', label: 'Location label', required: true, half: true, placeholder: 'Goa, India' },
        { kind: 'combo', name: 'category', label: 'Category', half: true, required: true, suggestions: ['Holiday Package', 'Honeymoon Package', 'Family Package', 'Adventure Package', 'International Package'] },
        { kind: 'select', name: 'destinationId', label: 'Linked destination', options: 'destinations', emptyLabel: 'None' },
        { kind: 'textarea', name: 'overview', label: 'Overview', required: true, rows: 6 },
      ],
    },
    {
      title: 'Duration & pricing',
      fields: [
        { kind: 'number', name: 'durationDays', label: 'Days', required: true, half: true, min: 1 },
        { kind: 'number', name: 'durationNights', label: 'Nights', required: true, half: true, min: 0 },
        { kind: 'number', name: 'priceStarting', label: 'Starting price (₹)', half: true, min: 0, help: 'Leave blank to show only the label.' },
        { kind: 'text', name: 'priceLabel', label: 'Price label', half: true, maxLength: 100, placeholder: 'On request' },
      ],
    },
    {
      title: 'Details',
      fields: [
        { kind: 'list', name: 'highlights', label: 'Highlights', help: 'One per line.' },
        { kind: 'list', name: 'inclusions', label: 'Inclusions', help: 'One per line.' },
        { kind: 'list', name: 'exclusions', label: 'Exclusions', help: 'One per line.' },
      ],
    },
    { title: 'Images', fields: [{ kind: 'image', name: 'heroImageUrl', label: 'Cover image', required: true }] },
    {
      title: 'Visibility',
      fields: [
        { kind: 'switch', name: 'isPublished', label: 'Published', help: 'Unpublished packages are hidden from the website.' },
        { kind: 'switch', name: 'featured', label: 'Featured' },
      ],
    },
  ],
};

// ---------------------------------------------------------------- day outings (activities table)
export const activities: ResourceConfig = {
  key: 'activities',
  route: 'day-outings',
  singular: 'Day outing',
  plural: 'Day Outings',
  titleField: 'title',
  folder: 'activities',
  publicPath: (r) => `/day-activities/${r.slug}`,
  imageOf: (r) => r.imageUrl,
  columns: [
    { label: 'Outing', render: (r) => (<><p className="font-semibold text-ink">{r.title}</p><p className="text-xs text-ink-muted">{r.locationLabel}</p></>) },
    { label: 'Category', className: 'hidden md:table-cell', render: (r) => <Muted>{r.category}</Muted> },
    { label: 'Duration', className: 'hidden lg:table-cell', render: (r) => <Muted>{r.durationLabel}</Muted> },
  ],
  filters: [
    {
      param: 'category',
      label: 'All categories',
      options: ['Farm Day Outing', 'Day Outing & Picnic', 'Water Park & Amusement'].map((v) => ({ value: v, label: v })),
    },
  ],
  defaults: { category: 'Day Outing & Picnic', durationLabel: 'Full Day (9:00 AM - 5:00 PM)', isPublished: false, featured: false, gallery: [], highlights: [], inclusions: [] },
  sections: [
    {
      title: 'Basics',
      fields: [
        { kind: 'text', name: 'title', label: 'Name', required: true, half: true },
        { kind: 'slug', name: 'slug', label: 'URL slug', from: 'title', half: true, help: 'Used in the page address. Changing it breaks existing links.' },
        { kind: 'combo', name: 'category', label: 'Category', required: true, half: true, suggestions: ['Farm Day Outing', 'Day Outing & Picnic', 'Water Park & Amusement'], help: 'Decides which section of the Day Outings page it appears in.' },
        { kind: 'text', name: 'locationLabel', label: 'Location', required: true, half: true, placeholder: 'Sohna Road, Gurugram' },
        { kind: 'text', name: 'durationLabel', label: 'Duration', required: true },
        { kind: 'textarea', name: 'description', label: 'Description', required: true, rows: 6 },
        { kind: 'list', name: 'highlights', label: 'Highlights', help: 'One per line.' },
        { kind: 'list', name: 'inclusions', label: 'Inclusions', help: 'One per line.' },
      ],
    },
    {
      title: 'Images & video',
      fields: [
        { kind: 'image', name: 'imageUrl', label: 'Cover image', required: true },
        { kind: 'gallery', name: 'gallery', label: 'Gallery', help: 'Outings with a gallery and video get a large featured card.' },
        { kind: 'text', name: 'videoId', label: 'YouTube video id', placeholder: 'xsTXYcZQmmk', help: 'Only the id from the YouTube link (after v=).', maxLength: 30 },
      ],
    },
    {
      title: 'Visibility',
      fields: [
        { kind: 'switch', name: 'isPublished', label: 'Published', help: 'Unpublished outings are hidden from the website.' },
        { kind: 'switch', name: 'featured', label: 'Featured' },
      ],
    },
  ],
};

export const RESOURCES = { destinations, hotels, packages, activities };
