import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../Pages/auth/RegisterPage";

test.describe("Register", () => {
  test.setTimeout(90000);

  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.open();
  });

  test("AUTH-06 | Valid registration", async ({ page }) => {
    const uniqueEmail = `qais.${Date.now()}.${Math.floor(Math.random()*100000)}@example.com`;


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
      email: uniqueEmail,
      password: "Qais!Aa#9Zx7P@2025",

    });

    await registerPage.assertRegisteredSuccessfully();

    if ((await page.url()).includes("/auth/login")) {
      await expect(page.locator('[data-test="email"]')).toBeVisible();
    }
  });

  test("AUTH-07 | Missing required fields", async ({ page }) => {
    await registerPage.submit();
    await expect(page.locator(".alert.alert-danger").first()).toBeVisible();
  });

  test("AUTH-08 | Invalid email format", async ({ page }) => {
    await registerPage.fillForm({
      firstName: "Qais",
      lastName: "Salah",
      dob: "2002-01-01",
      address: "Nablus - Main Street 10",
      postcode: "00970",
      city: "Nablus",
      phone: "0599999999",
      email: "invalid-email",
      password: "Qais!Aa#9Zx7P@2025",

    });

    await registerPage.selectCountry("Palestine");
    await registerPage.selectState("Nablus");

    await registerPage.submit();

    await expect(page.locator('[data-test="email-error"]')).toBeVisible();
  });
});
