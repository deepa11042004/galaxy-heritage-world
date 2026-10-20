import { test, expect, Page } from '@playwright/test';

/**
 * Admin panel end-to-end tests. Needs ADMIN_E2E_EMAIL / ADMIN_E2E_PASSWORD (a Super Admin) in the
 * environment. Records are named "zz-e2e ..." so they can be removed with backend/scripts/cleanup-test-data.ts.
 */
const EMAIL = process.env.ADMIN_E2E_EMAIL ?? '';
const PASSWORD = process.env.ADMIN_E2E_PASSWORD ?? '';
const API = 'http://localhost:4000/api/v1';
const NAME = `zz-e2e Atlantis ${Date.now()}`;
const SLUG = NAME.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// 64x48 solid PNG
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAEAAAAAwCAIAAAAuKetIAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAfklEQVRoge2SQQkAQRDDSvwrOm15nIwybCECktL4cZrUDVwA9RXdhbhL6gYugPqK7kLcJXUDF0B9RXch7pK6gQugvqK7EHdJ3cAFUF/RXYi7pG7gAqiv6C7EXVI3cAHUV3QX4i6pG7gA6iu6C3GX1A1cAPUV3YW4S+oGPh7wA7vgoS1jymVhAAAAAElFTkSuQmCC',
  'base64'
);

test.skip(!EMAIL || !PASSWORD, 'ADMIN_E2E_EMAIL / ADMIN_E2E_PASSWORD not set');

async function login(page: Page) {
  await page.goto('/login');
  await page.getByPlaceholder('admin@galaxyheritageworld.com').fill(EMAIL);
  await page.getByPlaceholder('••••••••••••').fill(PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/admin');
}

test('unauthenticated visitors are sent to the login page', async ({ page }) => {
  await page.goto('/admin/hotels');
  await page.waitForURL(/\/login\?next=%2Fadmin%2Fhotels/);
});

test('public site chrome is hidden inside the panel but kept on the public site', async ({ page }) => {
  await login(page);
  await expect(page.getByRole('navigation', { name: 'Admin' })).toBeVisible();
  await expect(page.getByText('Toll Free: 1800-843-6114')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByText('1800-843-6114').first()).toBeVisible();
});

test('dashboard shows real database counts', async ({ page }) => {
  await login(page);
  const hotels = await page.evaluate(async (api) => {
    const r = await fetch(`${api}/admin/stats`, { credentials: 'include' });
    return (await r.json()).data.hotels.total as number;
  }, API);
  await expect(page.getByText(hotels.toLocaleString('en-IN'), { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Hotels & Resorts').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recent activity' })).toBeVisible();
});

test('lists search, filter and paginate', async ({ page }) => {
  await login(page);
  await page.goto('/admin/hotels');
  await expect(page.getByText('Page 1 of')).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Page 2 of')).toBeVisible();

  await page.goto('/admin/day-outings');
  await page.getByLabel('Search Day Outings').fill('Rangmanch');
  await expect(page.getByRole('row', { name: /Rangmanch Farms/ })).toBeVisible();
  await page.getByLabel('Search Day Outings').fill('definitely-no-match-xyz');
  await expect(page.getByText('Nothing matches your filters')).toBeVisible();
});

test('list thumbnails actually load (cross-origin image embedding is allowed)', async ({ page }) => {
  await login(page);
  await page.goto('/admin/day-outings');
  const thumbs = page.locator('tbody img');
  await expect(thumbs.first()).toBeVisible();
  await expect
    .poll(async () => thumbs.evaluateAll((imgs) => (imgs as HTMLImageElement[]).filter((i) => i.complete && i.naturalWidth > 0).length), { timeout: 20_000 })
    .toBeGreaterThan(5);
});

test('form validation shows inline errors', async ({ page }) => {
  await login(page);
  await page.goto('/admin/destinations/new');
  await page.getByRole('button', { name: /create destination/i }).click();
  await expect(page.getByText('Name is required')).toBeVisible();
  await expect(page.getByText('Description is required')).toBeVisible();
  await expect(page.getByText('Cover image is required')).toBeVisible();
});

test('create, upload image, publish, see on website, unpublish, delete', async ({ page }) => {
  await login(page);
  await page.goto('/admin/destinations/new');

  await page.locator('#f-name').fill(NAME);
  await expect(page.locator('#f-slug')).toHaveValue(SLUG);
  await page.locator('#f-region').fill('Test Region');
  await page.locator('#f-description').fill('A fictional destination created by the end-to-end test suite.');
  await page.locator('input[type=file][aria-label="Choose image"]').setInputFiles({ name: 'zz-e2e-cover.png', mimeType: 'image/png', buffer: PNG });
  await expect(page.locator('img[src*="/media/uploads/"]').first()).toBeVisible({ timeout: 20_000 });

  await page.getByRole('button', { name: /create destination/i }).click();
  await page.waitForURL('**/admin/destinations');
  await expect(page.getByText('Destination created.')).toBeVisible();

  // draft: not public
  await page.getByLabel('Search Destinations').fill('zz-e2e');
  const row = page.getByRole('row', { name: new RegExp(NAME) });
  await expect(row).toBeVisible();
  await expect(row.getByText('Draft')).toBeVisible();
  expect((await page.request.get(`${API}/destinations/${SLUG}`)).status()).toBe(404);
  expect((await page.request.get(`/destinations/${SLUG}`)).status()).toBe(404);

  // publish
  await row.getByRole('switch').click();
  await expect(page.getByText(/published\./)).toBeVisible();
  await expect.poll(async () => (await page.request.get(`/destinations/${SLUG}`)).status(), { timeout: 15_000 }).toBe(200);

  const pub = await page.goto(`/destinations/${SLUG}`);
  expect(pub?.status()).toBe(200);
  await expect(page.getByText(NAME).first()).toBeVisible();

  // the uploaded image is served through the public site
  const upload = await page.request.get(`${API}/destinations/${SLUG}`);
  const heroUrl: string = (await upload.json()).data.heroImageUrl;
  const img = await page.request.get(heroUrl);
  expect(img.status()).toBe(200);
  expect(img.headers()['content-type']).toContain('image/webp');

  // unpublish -> gone
  await page.goto('/admin/destinations');
  await page.getByLabel('Search Destinations').fill('zz-e2e');
  await page.getByRole('row', { name: new RegExp(NAME) }).getByRole('switch').click();
  await expect(page.getByText(/unpublished\./)).toBeVisible();
  await expect.poll(async () => (await page.request.get(`/destinations/${SLUG}`)).status(), { timeout: 15_000 }).toBe(404);

  // delete requires confirmation
  await page.getByRole('button', { name: new RegExp(`Delete ${NAME}`) }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('row', { name: new RegExp(NAME) })).toBeVisible();
  await page.getByRole('button', { name: new RegExp(`Delete ${NAME}`) }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText(/deleted\./)).toBeVisible();
  await expect(page.getByRole('row', { name: new RegExp(NAME) })).toHaveCount(0);
});

test('public day outings page is driven by the database', async ({ page }) => {
  const res = await page.goto('/day-activities');
  expect(res?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Rangmanch Farms' })).toBeVisible();
  await expect(page.getByText('Surajgarh Farms').first()).toBeVisible();
  await expect(page.getByText('Atlantic Water World').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /^Play / }).first()).toBeVisible();
});

test('users and settings pages', async ({ page }) => {
  await login(page);
  await page.goto('/admin/users');
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByText(EMAIL)).toBeVisible();
  await page.getByRole('button', { name: /add user/i }).click();
  await expect(page.getByRole('dialog', { name: 'Add user' })).toBeVisible();
  await page.keyboard.press('Escape');

  await page.goto('/admin/settings');
  await expect(page.getByRole('heading', { name: 'Change password' })).toBeVisible();
  await expect(page.getByText('This device')).toBeVisible();
});

test.describe('mobile layout', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('sidebar becomes a drawer and nothing overflows horizontally', async ({ page }) => {
    await login(page);
    for (const path of ['/admin', '/admin/hotels', '/admin/packages', '/admin/destinations/new', '/admin/settings']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(1);
    }
    await page.goto('/admin');
    await expect(page.getByRole('navigation', { name: 'Admin' })).toBeHidden();
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Admin' })).toBeVisible();
  });
});
