import { instant } from '@next/playwright';
import { test, expect } from '@playwright/test';

test.describe('Search page (/search)', () => {
  // (No prefetch-time reveal case here — unlike the feed pages, no link carries a `?q=`, and the empty
  //  state is static, so there's no prefetch-time result set to assert.)
  test('initial page load shows the search shell without results', async ({ page }) => {
    await page.goto('/');

    await instant(page, async () => {
      await page.goto('/search?q=the');
      await expect(page.getByRole('searchbox', { name: 'Search drops' })).toBeVisible();
      await expect(page.locator('main article')).toHaveCount(0);
    });
  });

  // The input lives in a client shell above the results Suspense, so it keeps focus while results stream.
  test('search keeps focus while results stream from the server', async ({ page }) => {
    await page.goto('/search');
    const search = page.getByRole('searchbox', { name: 'Search drops' });
    await search.waitFor({ state: 'visible', timeout: 15000 });
    await search.click();
    await page.keyboard.type('hello', { delay: 150 });
    await expect(search).toBeFocused();
    await expect(search).toHaveValue('hello');
  });
});
