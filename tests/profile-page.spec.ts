import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Profile page (/u/[handle])', () => {
  test('initial page load shows the shell without the profile feed', async ({ page }) => {
    await page.goto('/');

    await instant(page, async () => {
      await page.goto('/u/aurora');
      await expect(page.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible();
      await expect(page.locator('main article')).toHaveCount(0);
    });
  });

  test('client navigation shows the profile feed resolved at prefetch time', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('aside a[aria-label="Profile"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });

    await instant(page, async () => {
      await link.click();
      await page.waitForURL(url => url.pathname === '/u/aurora');
      await expect(page.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible();
      await expect(page.locator('main article').first()).toBeVisible();
    });
  });
});
