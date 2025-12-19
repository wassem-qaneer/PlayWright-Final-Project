import { test as setup, expect } from "@playwright/test";
import { env } from "../../utils/env";

const passwordInput = '[data-test="password"]';
const loginSubmit = '[data-test="login-submit"]';

setup("auth: customer", async ({ page }) => {
  await page.goto(env.baseURL);

  await page.getByRole("link", { name: /sign in|login/i }).click();

  await page.getByLabel(/email/i).fill(env.customerEmail);
  await expect(page.locator(passwordInput)).toBeVisible();
  await page.locator(passwordInput).fill(env.customerPassword);

  await Promise.all([
    page.waitForURL(/account|profile|dashboard/i),
    page.locator(loginSubmit).click(),
  ]);

  await expect(page).toHaveURL(/account|profile|dashboard/i);
  await page.context().storageState({ path: "fixtures/storage/customer.json" });
});

setup("auth: admin", async ({ page }) => {
  await page.goto(env.baseURL);

  await page.getByRole("link", { name: /sign in|login/i }).click();

  await page.getByLabel(/email/i).fill(env.adminEmail);
  await expect(page.locator(passwordInput)).toBeVisible();
  await page.locator(passwordInput).fill(env.adminPassword);

  await Promise.all([
    page.waitForURL(/account|admin|dashboard/i),
    page.locator(loginSubmit).click(),
  ]);

  await expect(page).toHaveURL(/account|admin|dashboard/i);
  await page.context().storageState({ path: "fixtures/storage/admin.json" });
});
