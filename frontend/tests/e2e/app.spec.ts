import { expect, test } from '@playwright/test';

test('loads the landing page', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Your library, your community, all in one place.',
    }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Browse Books' })).toBeVisible();
});
