import { test, expect, Page } from "@playwright/test";
import { SearchPage } from "../../Pages/SearchPage/SearchPage";


async function readPrices(page: Page): Promise<number[]> {
  let priceLocator = page.locator('[data-test="product-price"]');

  if ((await priceLocator.count()) === 0) {
    priceLocator = page.locator(
      ".card [class*=price], .card .price, .card-text:has-text('$'), .card-text:has-text('€')"
    );
  }

  const texts: string[] = await priceLocator.allInnerTexts();
  const prices: number[] = texts
    .map((t: string) => {
      const cleaned = String(t)
        .replace(/\u00A0/g, " ") 
        .replace(",", ".") 
        .replace(/[^\d.]/g, ""); 
      return Number.parseFloat(cleaned);
    })
    .filter((n: number) => Number.isFinite(n));

  expect(prices.length, "No prices were parsed. Check price locator.").toBeGreaterThan(0);
  return prices;
}

function isSortedDesc(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < arr[i + 1]) return false;
  }
  return true;
}

function isSortedAsc(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}


async function applySortAndWait(
  page: Page,
  searchPage: SearchPage,
  value:
    | "name,asc"
    | "name,desc"
    | "price,asc"
    | "price,desc"
    | "co2_rating,asc"
    | "co2_rating,desc",
  direction: "asc" | "desc"
): Promise<void> {
  await Promise.all([
    page
      .waitForResponse((r) => r.ok() && r.url().includes("/products"), {
        timeout: 15000,
      })
      .catch(() => null),
    searchPage.sortBy(value),
  ]);

  
  await page.waitForLoadState("domcontentloaded").catch(() => {});

 
  await expect
    .poll(
      async () => {
        const prices = await readPrices(page);
        return direction === "desc" ? isSortedDesc(prices) : isSortedAsc(prices);
      },
      { timeout: 15000 }
    )
    .toBe(true);
}

test.describe("Sorting", () => {
  test("Price (High - Low)", async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.open();
    await applySortAndWait(page, searchPage, "price,desc", "desc");
    const prices = await readPrices(page);
    expect(isSortedDesc(prices)).toBe(true);
  });

  test("Price (Low - High)", async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.open();
    await applySortAndWait(page, searchPage, "price,asc", "asc");
    const prices = await readPrices(page);
    expect(isSortedAsc(prices)).toBe(true);
  });
});
