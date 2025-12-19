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
    await this.page.goto(env.baseURL, { waitUntil: "networkidle" });
    const signIn = this.page.locator('[data-test="nav-sign-in"]');
    await expect(signIn).toBeVisible({ timeout: 15000 });
    await signIn.click();

    await this.page.waitForURL("**/auth/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertCustomerLoggedIn() {
    await expect(this.page).toHaveURL(/\/account/i);
  }

  async assertAdminLoggedIn() {
    await expect(this.page).toHaveURL(/\/admin\/dashboard/i);
  }
}
