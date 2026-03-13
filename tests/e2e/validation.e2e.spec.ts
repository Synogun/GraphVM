import { expect, test } from '@playwright/test';

test('e2e validation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/GraphVM/i);
});
