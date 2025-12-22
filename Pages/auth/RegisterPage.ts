import { expect, Page, Locator } from "@playwright/test";
import { env } from "../../utils/env";

export class RegisterPage {
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private dobInput: Locator;
  private addressInput: Locator;
  private postcodeInput: Locator;
  private cityInput: Locator;
  private stateInput: Locator;
  private countryInput: Locator;
  private phoneInput: Locator;
  private emailInput: Locator;
  private passwordInput: Locator;
  private registerButton: Locator;

  constructor(private page: Page) {
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.dobInput = page.locator('[data-test="dob"]');

    this.addressInput = page.locator('[data-test="address"]');
    this.postcodeInput = page.locator('[data-test="postcode"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.countryInput = page.locator('[data-test="country"]');

    this.phoneInput = page.locator('[data-test="phone"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');

    this.registerButton = page.locator('[data-test="register-submit"]');
  }

  async open() {
    await this.page.goto(`${env.baseURL}/auth/register`, {
      waitUntil: "domcontentloaded",
    });
    await this.firstNameInput.waitFor({ state: "visible", timeout: 15000 });
  }

  async fillForm(data: {
    firstName?: string;
    lastName?: string;
    dob?: string; // yyyy-mm-dd
    address?: string;
    postcode?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    email?: string;
    password?: string;
  }) {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.dob !== undefined) await this.dobInput.fill(data.dob);

    if (data.address !== undefined) await this.addressInput.fill(data.address);
    if (data.postcode !== undefined) await this.postcodeInput.fill(data.postcode);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.state !== undefined) await this.stateInput.fill(data.state);
    if (data.country !== undefined) await this.countryInput.fill(data.country);

    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.password !== undefined) await this.passwordInput.fill(data.password);
  }

  async submit() {
    await this.registerButton.click();
  }

  async register(data: {
    firstName: string;
    lastName: string;
    dob: string;
    address: string;
    postcode: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
    password: string;
  }) {
    await this.fillForm(data);
    await this.submit();

    await Promise.race([
      this.page.waitForURL(/\/auth\/login/i, { timeout: 15000 }).catch(() => {}),
      this.page.locator(".alert").waitFor({ state: "visible", timeout: 15000 }).catch(() => {}),
    ]);
  }

  async assertRegisteredSuccessfully() {
    await expect(this.page).toHaveURL(/\/auth\/login/i);
  }

  async assertErrorVisible() {
    await expect(this.page.locator(".alert")).toBeVisible();
  }
}
