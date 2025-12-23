import { test, expect } from "@playwright/test";
import { SearchPage } from "../../Pages/SearchPage/SearchPage";

test.describe("Sorting", () => {
  test.setTimeout(90000);

  test("= Name (A - Z)", async ({ page }) => {
    const search = new SearchPage(page);
    await search.open();
    await search.sortBy("name,asc");
    await page.waitForLoadState("networkidle").catch(() => {});
    await expect(page.locator(".card").first()).toBeVisible({ timeout: 20000 });
    const titles = page.locator(".card .card-title, .card-title");
    const count = Math.min(await titles.count(), 12);
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = (await titles.nth(i).innerText()).trim();
      if (t) names.push(t);
    }

    const sorted = [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    expect(names).toEqual(sorted);
  });

  test(" Name (Z - A)", async ({ page }) => {
    const search = new SearchPage(page);
    await search.open();
    await search.sortBy("name,desc");
    await page.waitForLoadState("networkidle").catch(() => {});
    await expect(page.locator(".card").first()).toBeVisible({ timeout: 20000 });
    const titles = page.locator(".card .card-title, .card-title");
    const count = Math.min(await titles.count(), 12);
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = (await titles.nth(i).innerText()).trim();
      if (t) names.push(t);
    }

    const sorted = [...names].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: "base" }));
    expect(names).toEqual(sorted);
  });
});
