import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Home page (/)', () => {
  test('initial page load shows the shell without the feed', async ({ page }) => {
    await page.goto('/bookmarks');

    await instant(page, async () => {
      await page.goto('/');
      await expect(page.locator('main article')).toHaveCount(0);
    });
  });

  test('client navigation shows the feed resolved at prefetch time', async ({ page }) => {
    await page.goto('/bookmarks');
    const link = page.locator('aside a[aria-label="Home"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });

    await instant(page, async () => {
      await link.click();
      await page.waitForURL(url => url.pathname === '/');
      await expect(page.locator('main article').first()).toBeVisible();
    });
  });
});
