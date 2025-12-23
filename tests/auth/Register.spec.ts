import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../Pages/auth/RegisterPage";

test.describe("Register", () => {
  test.setTimeout(90000);

  let registerPage: RegisterPage;

  const uniqueEmail = () =>
    `qais.${Date.now()}.${Math.floor(Math.random() * 100000)}@example.com`;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.open();
  });

  test("Valid registration", async ({ page }) => {
    await registerPage.register({
      firstName: "Qais",
      lastName: "Salah",
      dob: "2002-01-01",
      address: "Nablus - Main Street 10",
      postcode: "00970",
      city: "Nablus",
      state: "Nablus",
      country: "Palestine",
      phone: "0599999999",
      email: uniqueEmail(),
      password: "Qais!Aa#9Zx7P@2025",
    });

    await registerPage.assertRegisteredSuccessfully();

    if ((await page.url()).includes("/auth/login")) {
      await expect(page.locator('[data-test="email"]')).toBeVisible();
    }
  });

  test("Missing required fields", async ({ page }) => {
    await registerPage.submit();
    await expect(page.locator(".alert.alert-danger").first()).toBeVisible();
  });

  const invalidEmails = ["invalid-email", "qais@", "@example.com", "qais.example.com"];

  for (const email of invalidEmails) {
    test(`Invalid email format: ${email}`, async ({ page }) => {
      await registerPage.fillForm({
        firstName: "Qais",
        lastName: "Salah",
        dob: "2002-01-01",
        address: "Nablus - Main Street 10",
        postcode: "00970",
        city: "Nablus",
        phone: "0599999999",
        email,
        password: "Qais!Aa#9Zx7P@2025",
      });

      await registerPage.selectCountry("Palestine");
      await registerPage.selectState("Nablus");

      await registerPage.submit();

      await expect(page.locator('[data-test="email-error"]')).toBeVisible();
    });
  }
});
