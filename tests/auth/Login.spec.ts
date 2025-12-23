import { expect, test } from "@playwright/test";
import { env } from "../../utils/env";
import { LoginPage } from "../../Pages/auth/LoginPage";

type Role = "customer" | "admin";

const validUsers = [
  {
    role: "customer" as Role,
    email: env.customerEmail,
    password: env.customerPassword,
    assertUrl: /\/account/i,
  },
  {
    role: "admin" as Role,
    email: env.adminEmail,
    password: env.adminPassword,
    assertUrl: /\/admin\/dashboard/i,
  },
];

const invalidLoginScenarios = [
  {
    name: "Customer - invalid password",
    role: "customer",
    email: env.customerEmail,
    password: "wrongPassword",
  },
  {
    name: "Admin - invalid password",
    role: "admin",
    email: env.adminEmail,
    password: "wrongPassword",
  },
  {
    name: "Customer - invalid email",
    role: "customer",
    email: "wrong-customer@example.com",
    password: env.customerPassword,
  },
  {
    name: "Admin - invalid email",
    role: "admin",
    email: "wrong-admin@example.com",
    password: env.adminPassword,
  },
];

test.describe("Login - Valid (Parameterized from .env)", () => {
  for (const u of validUsers) {
    test(`Valid login as ${u.role}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.open();
      await loginPage.login(u.email, u.password);

      await expect(page).toHaveURL(u.assertUrl);
    });
  }
});

test.describe("Login - Invalid (Parameterized Scenarios)", () => {
  for (const s of invalidLoginScenarios) {
    test(s.name, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.open();
      await loginPage.login(s.email, s.password);

      const errorMessage = page.locator(".alert.alert-danger");
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText(
        /invalid email or password|login failed/i
      );
    });
  }
});
