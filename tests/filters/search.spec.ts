import { test, expect } from "@playwright/test";
import { SearchPage } from "../../Pages/SearchPage/SearchPage";

test.describe("Search Product Without Filters Or Sort", () => {
  test.setTimeout(60000);

  test("Valid search returns results", async ({ page }) => {
    const sp = new SearchPage(page);

    await sp.open();
    await sp.search("Belt Sander");
    const firstProduct = page.locator('[data-test="product-name"]').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });
    await expect(page.locator(".card").first()).toBeVisible({ timeout: 15000 });
  });

  test("Search Non-Exist Product", async ({ page }) => {
    const sp = new SearchPage(page);
    await sp.open();
    await sp.search("not-exist");
    await expect(page.locator("div[data-test='no-results']")).toBeVisible({
      timeout: 15000,
    });
    await sp.assertNoResultsVisible();
  });
});
