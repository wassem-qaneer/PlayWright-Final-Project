import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  await page.locator('[data-test="product-01KD6G69FBN3WCRRBMVYYKFD5C"]').click();
  await page.locator('[data-test="increase-quantity"]').click();
  await page.locator('[data-test="add-to-cart"]').click();
  await page.locator('[data-test="nav-cart"]').click();
  await page.locator('.btn.btn-danger').click();
  await page.getByRole('link', { name: 'Practice Software Testing -' }).click();
});