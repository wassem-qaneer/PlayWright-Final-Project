import { test, expect } from "@playwright/test";
import { SearchPage } from "../../Pages/SearchPage/SearchPage";

test.describe("Filter - By Category", () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.open();
    await sp.openFilters();
  });

  test("Apply main category filter (Power Tools)", async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.filterByCategory("Power Tools");
    await expect(page.getByLabel("Power Tools", { exact: true })).toBeChecked();
    await expect(page.locator(".card").first()).toBeVisible({ timeout: 15000 });
  });

  test("Apply sub-category filter (Sander)", async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.filterByCategory("Sander");
    await expect(page.getByLabel("Sander", { exact: true })).toBeChecked();
    await expect(page.locator(".card").first()).toBeVisible({ timeout: 15000 });
  });
});
