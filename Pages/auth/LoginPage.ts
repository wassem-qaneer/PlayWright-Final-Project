import { expect, Page, Locator } from "@playwright/test";
import { env } from "../../utils/env";

export class LoginPage {
  private emailInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;

  constructor(private page: Page) {
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-submit"]');
  }

  async open() {
    await this.page.goto(`${env.baseURL}/auth/login`, {
      waitUntil: "domcontentloaded",
    });
    await this.emailInput.waitFor({ state: "visible", timeout: 15000 });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.passwordInput.press("Enter");

    await Promise.race([
      this.page.waitForURL(/\/account/i, { timeout: 15000 }).catch(() => {}),
      this.page
        .waitForURL(/\/admin\/dashboard/i, { timeout: 15000 })
        .catch(() => {}),
      this.page
        .locator(".alert.alert-danger")
        .waitFor({ state: "visible", timeout: 15000 })
        .catch(() => {}),
    ]);
  }

  async assertCustomerLoggedIn() {
    await expect(this.page).toHaveURL(/\/account/i);
  }

  async assertAdminLoggedIn() {
    await expect(this.page).toHaveURL(/\/admin\/dashboard/i);
  }
}
