const { test, expect } = require('@playwright/test');

test.describe('Item Tracker - core user flow', () => {
  test('user can log in, create an item, and see it appear in the list', async ({ page }) => {
    await page.goto('/');

    // --- Log in --------------------------------------------------------
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();

    await page.getByLabel(/username/i).fill('admin');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /log in/i }).click();

    // After login we should land on the items screen.
    await expect(page.getByRole('heading', { name: /my items/i })).toBeVisible();

    // --- Create an item --------------------------------------------------
    const itemName = `Buy milk ${Date.now()}`;
    await page.getByLabel(/new item/i).fill(itemName);
    await page.getByRole('button', { name: /add item/i }).click();

    // --- See it appear ---------------------------------------------------
    await expect(page.getByRole('list', { name: /item-list/i }).getByText(itemName)).toBeVisible();
  });

  test('shows an error and stays on the login screen for bad credentials', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel(/username/i).fill('admin');
    await page.getByLabel(/password/i).fill('wrong-password');
    await page.getByRole('button', { name: /log in/i }).click();

    await expect(page.getByRole('alert')).toHaveText(/invalid/i);
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  });
});
