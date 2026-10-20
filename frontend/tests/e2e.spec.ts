import { test, expect } from '@playwright/test';

test.describe('Galaxy Heritage World E2E Smoke Tests', () => {
  test('Homepage renders with hero, branding, toll-free number, and floating concierge', async ({ page }) => {
    await page.goto('/');

    // Check title and logo
    await expect(page).toHaveTitle(/Galaxy Heritage World/);

    // Check toll-free header contact
    await expect(page.getByText('1800-843-6114').first()).toBeVisible();

    // Check hero headline
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Crafting Unforgettable Journeys/);

    // Check floating Travel Desk
    const travelDeskFloat = page.getByLabel('Open Travel Desk Concierge');
    await expect(travelDeskFloat).toBeVisible();
  });

  test('Destinations page loads and displays destinations', async ({ page }) => {
    await page.goto('/destinations');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Handpicked Holiday Destinations/);
    await expect(page.getByText('Goa').first()).toBeVisible();
  });

  test('Reviews and Complaints page displays 3-tier Escalation Matrix', async ({ page }) => {
    await page.goto('/reviews-and-complaints');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Customer Grievance & Escalation Matrix/);
    await expect(page.getByText('Level 1').first()).toBeVisible();
    await expect(page.getByText('Level 2').first()).toBeVisible();
    await expect(page.getByText('Level 3').first()).toBeVisible();
  });

  test('Redeem voucher page accepts and submits voucher form', async ({ page }) => {
    await page.goto('/redeem-voucher');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Redeem Your Holiday Voucher/);

    await page.getByPlaceholder(/GHW-PROMO-2026/i).fill('GHW-PLAYWRIGHT-TEST');
    await page.getByPlaceholder(/Amit Verma/i).fill('Playwright Test User');
    await page.getByPlaceholder(/amit@example.com/i).fill('pwtest@galaxyheritageworld.com');
    await page.getByPlaceholder(/\+91 98765 43210/i).fill('+91 99999 88888');
    await page.getByPlaceholder(/Delhi, Jaipur/i).fill('New Delhi');

    await page.getByRole('button', { name: /Submit Voucher for Verification/i }).click();

    // Expect confirmation reference number
    await expect(page.getByText(/Voucher Verification Request Registered!/i)).toBeVisible({ timeout: 10000 });
  });

  test('Travel desk page renders and shows direct toll-free and WhatsApp options', async ({ page }) => {
    await page.goto('/travel-desk');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Galaxy Heritage World Travel Desk/);
    await expect(page.getByText('1800-843-6114').first()).toBeVisible();
    await expect(page.getByText('WhatsApp Concierge')).toBeVisible();
  });
});
