import { expect, test } from "@playwright/test";
import { env } from "../../utils/env";
import { LoginPage } from "../../Pages/auth/LoginPage";

test.describe("Customer Login", () => {
  test("Login Valid into customer Account", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(env.customerEmail, env.customerPassword);
    await loginPage.assertCustomerLoggedIn();
  });

  test("Login InValid email into customer Account", async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login("wrong@wrong.com", env.customerPassword);
    const errorMessage = page.locator(".alert.alert-danger");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(
      /invalid email or password|login failed/i
    );
  });

  test("Login InValid password into customer Account", async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(env.customerEmail, "wrongPassword");
    const errorMessage = page.locator(".alert.alert-danger");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(
      /invalid email or password|login failed/i
    );
  });
});

test.describe("Admin Login", () => {
  test("Login Valid into Admin Account", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(env.adminEmail, env.adminPassword);
    await loginPage.assertAdminLoggedIn();
  });
  test("Login InValid password into Admin Account", async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(env.adminEmail, "wrongPassword");
    const errorMessage = page.locator(".alert.alert-danger");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(
      /invalid email or password|login failed/i
    );
  });
  test("Login InValid email into Admin Account", async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login("wrong@wrong.com", env.adminPassword);
    const errorMessage = page.locator(".alert.alert-danger");
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(
      /invalid email or password|login failed/i
    );
  });
});
