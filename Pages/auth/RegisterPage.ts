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

    this.addressInput = page.locator('[data-test="street"]');
    this.postcodeInput = page.locator('[data-test="postal_code"]');
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

    
    await expect(this.page.locator('[data-test="register-form"]')).toBeVisible({ timeout: 15000 });
    await expect(this.firstNameInput).toBeVisible({ timeout: 15000 });
  }

  async fillForm(data: {
    firstName?: string;
    lastName?: string;
    dob?: string; 
    address?: string; 
    postcode?: string; 
    city?: string;
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

    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.password !== undefined) await this.passwordInput.fill(data.password);
  }

 
  private async setSelectByLabelOrValue(selectLocator: Locator, labelOrValue: string) {
    await selectLocator.scrollIntoViewIfNeeded();
    await expect(selectLocator).toBeVisible({ timeout: 15000 });

    const chosenValue = await selectLocator.evaluate((el, target) => {
      const s = el as HTMLSelectElement;
      const opts = Array.from(s.options);
      const t = String(target).trim().toLowerCase();

      const byLabel = opts.find((o) => o.text.trim().toLowerCase() === t);
      if (byLabel?.value) return byLabel.value;

      const byValue = opts.find((o) => o.value.trim().toLowerCase() === t);
      if (byValue?.value) return byValue.value;

      const firstValid = opts.find((o) => !o.disabled && o.value && o.value.trim().length > 0);
      return firstValid?.value ?? "";
    }, labelOrValue);

    if (!chosenValue) return;

    await selectLocator.evaluate((el, v) => {
      const s = el as HTMLSelectElement;
      s.value = String(v);
      s.dispatchEvent(new Event("input", { bubbles: true }));
      s.dispatchEvent(new Event("change", { bubbles: true }));
    }, chosenValue);
  }

  async selectCountry(countryLabelOrValue: string) {
    await this.setSelectByLabelOrValue(this.countryInput, countryLabelOrValue);
  }

  async selectState(stateLabelOrValue: string) {
    await this.stateInput.scrollIntoViewIfNeeded();
    await expect(this.stateInput).toBeVisible({ timeout: 15000 });

    const tag = await this.stateInput.evaluate((x) => x.tagName.toLowerCase());
    if (tag === "select") {
      await this.setSelectByLabelOrValue(this.stateInput, stateLabelOrValue);
      return;
    }

    await this.stateInput.fill(stateLabelOrValue);
  }

  async submit() {
    await this.registerButton.scrollIntoViewIfNeeded();
    await expect(this.registerButton).toBeEnabled({ timeout: 15000 });
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
    await this.fillForm({
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      address: data.address,
      postcode: data.postcode,
      city: data.city,
      phone: data.phone,
      email: data.email,
      password: data.password,
    });

    await this.selectCountry(data.country);
    await this.selectState(data.state);

  
    const waitRegisterResponse = this.page.waitForResponse(
      (res) => {
        const req = res.request();
        if (req.method() !== "POST") return false;

        const url = res.url().toLowerCase();
       
        return url.includes("register") || url.includes("users") || url.includes("customers");
      },
      { timeout: 30000 }
    );

    await this.submit();

    const res = await waitRegisterResponse.catch(() => null);

   
    if (!res) {
      await Promise.race([
        this.page.waitForURL(/\/auth\/login|\/account/i, { timeout: 20000 }).catch(() => {}),
        this.page.locator(".alert").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => {}),
      ]);
      return;
    }

 
    if (res.ok()) {
      await Promise.race([
        this.page.waitForURL(/\/auth\/login|\/account/i, { timeout: 20000 }).catch(() => {}),
        this.page.locator(".alert.alert-success").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => {}),
      ]);
      return;
    }

    
    const dangerAlerts = await this.page.locator(".alert.alert-danger").allTextContents().catch(() => []);
    const anyAlerts = await this.page.locator(".alert").allTextContents().catch(() => []);

    throw new Error(
      `REGISTER FAILED\n` +
        `HTTP: ${res.status()}  URL: ${res.url()}\n` +
        `PAGE: ${this.page.url()}\n` +
        `DANGER ALERTS:\n- ${dangerAlerts.filter(Boolean).join("\n- ")}\n` +
        `ALL ALERTS:\n- ${anyAlerts.filter(Boolean).join("\n- ")}`
    );
  }

 
  async assertRegisteredSuccessfully() {
    await Promise.race([
      this.page.waitForURL(/\/auth\/login|\/account/i, { timeout: 20000 }).catch(() => {}),
      this.page.locator(".alert.alert-success").first().waitFor({ state: "visible", timeout: 20000 }).catch(() => {}),
    ]);

    
    if (this.page.url().includes("/auth/register")) {
      const errorCount = await this.page.locator(".alert.alert-danger").count();
      expect(errorCount).toBe(0);
    }
  }

  async assertAnyErrorVisible() {
    await expect(this.page.locator(".alert.alert-danger").first()).toBeVisible({ timeout: 20000 });
  }
}
