/**
 * Browser-side client for the admin API. Authentication is the httpOnly cookie set by the API at
 * sign-in (credentials: 'include'); no token is ever readable from JavaScript. On a 401 the client
 * silently refreshes the session once and retries.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
export const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, '');

export interface FieldIssue {
  path: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  issues: FieldIssue[];
  constructor(message: string, status: number, issues: FieldIssue[] = []) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
}

let refreshing: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshing) {
    refreshing = fetch(`${API_BASE}/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then((r) => r.ok)
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

async function parse<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(body.error || body.message || `Request failed (${res.status})`, res.status, body.details || []);
  }
  return body as T;
}

export async function adminFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = typeof FormData !== 'undefined' && init.body instanceof FormData;
  const run = () =>
    fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: 'include',
      headers: { ...(isForm || !init.body ? {} : { 'Content-Type': 'application/json' }), ...(init.headers || {}) },
    });

  let res = await run();
  // Reads are safe to retry when the API reports the database as briefly unreachable.
  const isRead = !init.method || init.method === 'GET';
  for (let attempt = 0; isRead && res.status === 503 && attempt < 2; attempt++) {
    await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    res = await run();
  }
  if (res.status === 401 && !path.startsWith('/auth/') && (await refreshSession())) res = await run();
  return parse<T>(res);
}

export const jsonBody = (data: unknown): RequestInit => ({ body: JSON.stringify(data) });

export async function uploadImages(files: File[], folder: string): Promise<{ url: string; name: string }[]> {
  const fd = new FormData();
  fd.append('folder', folder);
  files.forEach((f) => fd.append('files', f));
  const res = await adminFetch<{ data: { url: string; name: string }[] }>('/admin/uploads', { method: 'POST', body: fd });
  return res.data;
}

/** Resolve a stored image path to something the admin UI can display (the API serves /media). */
export function mediaSrc(path?: string | null): string {
  if (!path) return '';
  return /^https?:\/\//.test(path) ? path : `${API_ORIGIN}${path}`;
}

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  SALES: 'Sales',
  SUPPORT: 'Support',
};
