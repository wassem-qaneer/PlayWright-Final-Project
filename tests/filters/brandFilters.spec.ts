import { test, expect } from "@playwright/test";
import { SearchPage } from "../../Pages/SearchPage/SearchPage";

test.describe("Filter - By Brand", () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.open();
    await sp.openFilters();
  });

  test("Apply brand filter (ForgeFlex Tools)", async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.filterByBrand("ForgeFlex Tools");
    await expect(
      page.getByLabel("ForgeFlex Tools", { exact: true })
    ).toBeChecked();
    await expect(page.locator(".card").first()).toBeVisible({ timeout: 15000 });
  });

  test("Apply brand filter (MightyCraft Hardware)", async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.filterByBrand("MightyCraft Hardware");
    await expect(
      page.getByLabel("MightyCraft Hardware", { exact: true })
    ).toBeChecked();
    await expect(page.locator(".card").first()).toBeVisible({ timeout: 15000 });
  });
});
