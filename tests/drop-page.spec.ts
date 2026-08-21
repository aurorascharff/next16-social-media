import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Drop page (/drop/[id])', () => {
  test('initial page load shows the cached drop', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('main article a[href^="/drop/"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });
    const href = await link.getAttribute('href');
    if (!href) throw new Error('Expected the drop link to have an href');

    await instant(page, async () => {
      await page.goto(href);
      await expect(page.getByRole('heading', { level: 1, name: 'Drop' })).toBeVisible();
      await expect(page.locator('main article').first()).toBeVisible();
    });
  });

  test('client navigation defers replies until navigation', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('main article a[href^="/drop/"]').first();
    await link.waitFor({ state: 'visible', timeout: 15000 });
    const href = await link.getAttribute('href');
    if (!href) throw new Error('Expected the drop link to have an href');

    await instant(page, async () => {
      await link.click();
      await page.waitForURL(url => url.pathname === href);
      await expect(page.getByRole('heading', { level: 1, name: 'Drop' })).toBeVisible();
      await expect(page.locator('main article').first()).toBeVisible();
      await expect(page.getByRole('heading', { level: 2, name: 'Replies' })).toBeVisible();
      await expect(page.getByTestId('replies')).toHaveCount(0);
    });

    await expect(page.getByTestId('replies')).toBeVisible();
  });
});
