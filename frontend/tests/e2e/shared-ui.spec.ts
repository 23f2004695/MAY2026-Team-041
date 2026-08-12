import { expect, test } from '@playwright/test';

test.describe('shared responsive and keyboard UI', () => {
  test('mobile navigation exposes state, moves focus, and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const toggle = page.locator('button[aria-controls="mobile-primary-navigation"]');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('dialog', { name: 'Navigation' })).toHaveCount(0);

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const drawer = page.getByRole('dialog', { name: 'Navigation' });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('link').first()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(drawer).toHaveCount(0);
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('chat dialog moves focus in and returns it to its launcher on Escape', async ({ page }) => {
    await page.goto('/');

    const launcher = page.locator('#chatbot-launcher');
    await expect(launcher).toHaveAttribute('aria-expanded', 'false');
    await launcher.click();

    const dialog = page.getByRole('dialog', { name: 'Shelfie' });
    await expect(dialog).toBeVisible();
    await expect(launcher).toHaveAttribute('aria-expanded', 'true');
    await expect(dialog.getByRole('button', { name: 'Reset chat' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(launcher).toBeFocused();
    await expect(launcher).toHaveAttribute('aria-expanded', 'false');
  });
});
