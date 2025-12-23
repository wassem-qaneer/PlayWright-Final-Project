import { test, expect } from "@playwright/test";
import { SearchPage } from "../../Pages/SearchPage/SearchPage";

test.describe("Filter - Price Range", () => {
  test.setTimeout(60000);

  test("Move max price to low then high (value changes clearly)", async ({
    page,
  }) => {
    const sp = new SearchPage(page);
    await sp.open();
    await sp.openFilters();
    const maxSlider = page.locator("div#filters span[role='slider']").last();
    const start = Number(await maxSlider.getAttribute("aria-valuenow"));
    expect(start).toBeGreaterThan(0);
    await sp.setMaxPriceByPercent(10);
    const low = Number(await maxSlider.getAttribute("aria-valuenow"));
    expect(low).toBeGreaterThan(0);
    expect(low).toBeLessThan(start);
    await sp.setMaxPriceByPercent(95);
    const high = Number(await maxSlider.getAttribute("aria-valuenow"));
    expect(high).toBeGreaterThan(0);
    expect(high).toBeGreaterThan(low + 10);
    await expect(page.locator(".card").first()).toBeVisible({ timeout: 15000 });
  });
});
