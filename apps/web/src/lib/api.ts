const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window === 'undefined' ? 'http://127.0.0.1:4000/api/v1' : 'http://localhost:4000/api/v1');

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  message?: string;
  referenceNumber?: string;
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error(`API Fetch Error on ${endpoint}:`, error);
    throw error;
  }
}

// Destination endpoints
export async function getDestinations(params?: { type?: string; featured?: boolean }) {
  const query = new URLSearchParams();
  if (params?.type) query.set('type', params.type);
  if (params?.featured) query.set('featured', 'true');
  const qs = query.toString() ? `?${query.toString()}` : '';
  return fetchApi<any[]>(`/destinations${qs}`);
}

export async function getDestinationBySlug(slug: string) {
  return fetchApi<any>(`/destinations/${slug}`);
}

// Packages endpoints
export async function getPackages(params?: { destinationId?: string; featured?: boolean }) {
  const query = new URLSearchParams();
  if (params?.destinationId) query.set('destinationId', params.destinationId);
  if (params?.featured) query.set('featured', 'true');
  const qs = query.toString() ? `?${query.toString()}` : '';
  return fetchApi<any[]>(`/packages${qs}`);
}

export async function getPackageBySlug(slug: string) {
  return fetchApi<any>(`/packages/${slug}`);
}

// Hotels & Resorts endpoints
export interface HotelListParams {
  category?: string;
  featured?: boolean;
  locationType?: string;
  location?: string;
  hotelType?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getHotels(params?: HotelListParams) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.featured) query.set('featured', 'true');
  if (params?.locationType) query.set('locationType', params.locationType);
  if (params?.location) query.set('location', params.location);
  if (params?.hotelType) query.set('hotelType', params.hotelType);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString() ? `?${query.toString()}` : '';
  return fetchApi<any[]>(`/hotels${qs}`);
}

export async function getHotelFilters() {
  return fetchApi<{ locationType: string | null; location: string; country: string; count: number; imageUrl: string | null }[]>(
    '/hotels/filters',
  );
}

export async function getHotelBySlug(slug: string) {
  return fetchApi<any>(`/hotels/${slug}`);
}

// Itineraries endpoints
export async function getItineraries(params?: { featured?: boolean }) {
  const query = new URLSearchParams();
  if (params?.featured) query.set('featured', 'true');
  const qs = query.toString() ? `?${query.toString()}` : '';
  return fetchApi<any[]>(`/itineraries${qs}`);
}

export async function getItineraryBySlug(slug: string) {
  return fetchApi<any>(`/itineraries/${slug}`);
}

// Activities endpoints
export async function getActivities(params?: { category?: string; featured?: boolean }) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.featured) query.set('featured', 'true');
  const qs = query.toString() ? `?${query.toString()}` : '';
  return fetchApi<any[]>(`/activities${qs}`);
}

export async function getActivityBySlug(slug: string) {
  return fetchApi<any>(`/activities/${slug}`);
}

// FAQs
export async function getFaqs(category?: string) {
  const qs = category ? `?category=${encodeURIComponent(category)}` : '';
  return fetchApi<any[]>(`/faqs${qs}`);
}

// Testimonials
export async function getTestimonials() {
  return fetchApi<any[]>('/testimonials');
}

// Settings
export async function getSettings() {
  return fetchApi<Record<string, string>>('/settings');
}

// Search
export async function searchContent(query: string) {
  return fetchApi<{
    destinations: any[];
    packages: any[];
    hotels: any[];
    itineraries: any[];
    activities: any[];
  }>(`/search?q=${encodeURIComponent(query)}`);
}

// CMS Pages
export async function getPageBySlug(slug: string) {
  return fetchApi<any>(`/settings/pages/${slug}`);
}

// Enquiry Submission
export async function submitEnquiry(payload: any) {
  return fetchApi<any>('/enquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
}

// Voucher Redemption Submission
export async function submitVoucherRedemption(payload: any) {
  return fetchApi<any>('/enquiries/voucher', {
    method: 'POST',
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
}

// Newsletter Subscription
export async function submitNewsletter(payload: any) {
  return fetchApi<any>('/enquiries/newsletter', {
    method: 'POST',
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
}
