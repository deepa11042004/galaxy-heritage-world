import { z } from 'zod';

// ============================================================================
// ROLES & AUTH SCHEMAS
// ============================================================================
export const RoleEnum = z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'SALES', 'SUPPORT']);
export type RoleName = z.infer<typeof RoleEnum>;

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(10, 'Invalid reset token'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

// ============================================================================
// ENQUIRY & LEAD CAPTURE SCHEMAS
// ============================================================================
export const EnquiryStatusEnum = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'CLOSED',
  'SPAM',
]);
export type EnquiryStatus = z.infer<typeof EnquiryStatusEnum>;

export const CreateEnquirySchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters').max(150),
  email: z.string().email('Please enter a valid email address').max(191),
  phone: z
    .string()
    .min(8, 'Please enter a valid phone/mobile number')
    .max(25)
    .regex(/^[+\d\s\-()]+$/, 'Phone number contains invalid characters'),
  city: z.string().min(2, 'Please enter your city').max(100),
  ageGroup: z.string().max(30).optional().nullable(),
  destinationInterest: z.string().max(191).optional().nullable(),
  packageInterest: z.string().max(191).optional().nullable(),
  travelDates: z.string().max(100).optional().nullable(),
  travelersCount: z.coerce.number().int().min(1).max(100).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  sourcePage: z.string().max(255).optional().nullable(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to be contacted to submit this enquiry',
  }),
});
export type CreateEnquiryInput = z.infer<typeof CreateEnquirySchema>;

export const UpdateEnquirySchema = z.object({
  status: EnquiryStatusEnum.optional(),
  notes: z.string().max(5000).optional().nullable(),
});

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name is required').max(150),
  email: z.string().email('Valid email is required').max(191),
  phone: z.string().min(8, 'Valid phone number is required').max(25),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(5, 'Please provide your message').max(3000),
  consent: z.boolean().optional().default(true),
});

export const NewsletterSubscribeSchema = z.object({
  email: z.string().email('Valid email address is required').max(191),
  name: z.string().max(120).optional().nullable(),
});

export const VoucherRedemptionSchema = z.object({
  voucherCode: z.string().min(4, 'Please enter a valid voucher code').max(80),
  name: z.string().min(2, 'Name is required').max(150),
  email: z.string().email('Valid email is required').max(191),
  phone: z.string().min(8, 'Valid phone number is required').max(25),
  city: z.string().min(2, 'City is required').max(100),
  preferredDestination: z.string().min(2, 'Preferred destination is required').max(191),
  preferredDates: z.string().max(100).optional().nullable(),
  message: z.string().max(1000).optional().nullable(),
});

// ============================================================================
// CONTENT MANAGEMENT SCHEMAS
// ============================================================================
// Image references: an uploaded/served path ("/media/...") or an absolute http(s) URL.
const IMAGE_REF = /^(\/(?!\/)|https?:\/\/)/;
const imageRef = z.string().max(500).regex(IMAGE_REF, 'Must be an uploaded image path or an http(s) URL');
// Hotels imported from the catalogue may legitimately have no image yet.
const imageRefOrEmpty = z.union([z.literal(''), imageRef]);
const imageList = z.array(imageRef).max(30).optional().default([]);

export const DestinationSchema = z.object({
  slug: z.string().min(2).max(191).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(191),
  region: z.string().min(2).max(100),
  country: z.string().default('India'),
  type: z.enum(['DOMESTIC', 'INTERNATIONAL']).default('DOMESTIC'),
  tagline: z.string().max(255).optional().nullable(),
  description: z.string().min(10),
  heroImageUrl: imageRef,
  gallery: imageList,
  highlights: z.array(z.string()).optional().default([]),
  bestTimeToVisit: z.string().max(150).optional().nullable(),
  featured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
});

export const HotelSchema = z.object({
  slug: z.string().min(2).max(191).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(191),
  destinationId: z.string().optional().nullable(),
  locationName: z.string().min(2).max(191),
  state: z.string().max(100).optional().nullable(),
  country: z.string().default('India'),
  category: z.enum(['ASSOCIATED', 'INTERNAL', 'EXCHANGE']).default('ASSOCIATED'),
  ratingStars: z.coerce.number().int().min(1).max(5).default(4),
  imageUrl: imageRefOrEmpty,
  gallery: imageList,
  amenities: z.array(z.string()).optional().default([]),
  description: z.string().min(10),
  hotelCode: z.string().max(30).optional().nullable(),
  hotelType: z.string().max(30).optional().nullable(),
  locationType: z.enum(['DOMESTIC', 'INTERNATIONAL']).optional().nullable(),
  address: z.string().optional().nullable(),
  mapLink: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const PackageSchema = z.object({
  slug: z.string().min(2).max(191).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(255),
  subtitle: z.string().max(255).optional().nullable(),
  destinationId: z.string().optional().nullable(),
  locationLabel: z.string().min(2).max(191),
  durationDays: z.coerce.number().int().min(1),
  durationNights: z.coerce.number().int().min(0),
  priceStarting: z.coerce.number().min(0).optional().nullable(),
  priceLabel: z.string().max(100).optional().nullable(),
  category: z.string().default('Holiday Package'),
  heroImageUrl: imageRef,
  overview: z.string().min(10),
  inclusions: z.array(z.string()).optional().default([]),
  exclusions: z.array(z.string()).optional().default([]),
  highlights: z.array(z.string()).optional().default([]),
  featured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const ItineraryDaySchema = z.object({
  dayNumber: z.coerce.number().int().min(1),
  title: z.string().min(2).max(255),
  description: z.string().min(5),
  meals: z.string().max(150).optional().nullable(),
  stayLocation: z.string().max(150).optional().nullable(),
});

export const ItinerarySchema = z.object({
  slug: z.string().min(2).max(191).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(255),
  badgeText: z.string().max(100).optional().nullable(),
  destinationId: z.string().optional().nullable(),
  locationLabel: z.string().min(2).max(191),
  durationDays: z.coerce.number().int().min(1),
  durationNights: z.coerce.number().int().min(0),
  heroImageUrl: imageRef,
  summary: z.string().min(10),
  overview: z.string().min(10),
  inclusions: z.array(z.string()).optional().default([]),
  featured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  days: z.array(ItineraryDaySchema).optional().default([]),
});

export const ActivitySchema = z.object({
  slug: z.string().min(2).max(191).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2).max(255),
  category: z.string().default('Day Outing & Picnic'),
  locationLabel: z.string().min(2).max(191),
  durationLabel: z.string().default('Full Day (9:00 AM - 5:00 PM)'),
  imageUrl: imageRef,
  gallery: imageList,
  videoId: z.string().regex(/^[\w-]{6,30}$/, 'Enter a YouTube video id').optional().nullable(),
  description: z.string().min(10),
  highlights: z.array(z.string()).optional().default([]),
  inclusions: z.array(z.string()).optional().default([]),
  featured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const FaqSchema = z.object({
  question: z.string().min(5).max(500),
  answer: z.string().min(5),
  category: z.string().default('General'),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const TestimonialSchema = z.object({
  customerName: z.string().min(2).max(150),
  customerLocation: z.string().max(150).optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  comment: z.string().min(10),
  tripTitle: z.string().max(191).optional().nullable(),
  avatarUrl: z.string().max(500).optional().nullable(),
  isVerified: z.boolean().default(true),
  isPublished: z.boolean().default(true),
});

export const PageContentSchema = z.object({
  slug: z.string().min(1).max(191),
  title: z.string().min(2).max(255),
  subtitle: z.string().max(500).optional().nullable(),
  contentHtml: z.string().min(1),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  isPublished: z.boolean().default(true),
});
