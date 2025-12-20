import { test, expect } from "@playwright/test";
import { SearchPage } from "../../Pages/SearchPage/SearchPage";

test.describe("Search + Filters/Sort/Price on the same query", () => {
  test.setTimeout(60000);
  const query = "Belt Sander";

  test.beforeEach(async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.open();
    await sp.search(query);

    await expect(
      page.locator('[data-test="product-name"]', { hasText: query }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `test-results/${testInfo.title}.png`,
        fullPage: true,
      });
    }
  });

  test("Apply category filter after search", async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.openFilters();
    await sp.filterByCategory("Power Tools");

    await expect(
      page.locator('[data-test="product-name"]').first()
    ).toBeVisible();
  });

  test("Apply sorting after search", async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.sortBy("price,asc");

    await expect(
      page.locator('[data-test="product-name"]').first()
    ).toBeVisible();
  });

  test("Apply max price range after search", async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.openFilters();
    await sp.setMaxPriceByPercent(40);

    await expect(
      page.locator('[data-test="product-name"]').first()
    ).toBeVisible();
  });
});

test("Search non-existing product", async ({ page }) => {
  const sp = new SearchPage(page);
  await sp.open();

  const query = "Error";
  await sp.search(query);

  await expect(
    page.getByText(new RegExp(`Searched for:\\s*${query}`, "i"))
  ).toBeVisible({ timeout: 15000 });

  await expect(page.getByText(/There are no products found\./i)).toBeVisible({
    timeout: 15000,
  });

  await expect(page.locator(".product-card")).toHaveCount(0);
});
