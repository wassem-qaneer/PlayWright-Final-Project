import { Page, Locator, expect } from "@playwright/test";
import { env } from "../../utils/env";

export class SearchPage {
  // Search
  private searchInput: Locator;
  private searchButton: Locator;
  private noResultsMessage: Locator;
  //  Filters
  // Sorting
  private sortDropdown: Locator;

  constructor(private page: Page) {
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.sortDropdown = page.locator('[data-test="sort"]');
    this.noResultsMessage = page.locator("div[data-test='no-results']");
  }
  async open() {
    await this.page.goto(env.baseURL, { waitUntil: "domcontentloaded" });
    await this.searchInput.waitFor({ state: "visible", timeout: 15000 });
  }
  async search(query: string) {
    await this.searchInput.scrollIntoViewIfNeeded();
    await this.searchInput.waitFor({ state: "visible", timeout: 15000 });
    await this.searchInput.fill(query);
    await this.searchButton.scrollIntoViewIfNeeded();
    await this.searchButton.waitFor({ state: "visible", timeout: 15000 });
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }
  async openFilters() {
    const filtersHeader = this.page.getByRole("heading", { name: "Filters" });
    await filtersHeader.click();
  }

  async sortBy(
    value:
      | "name,asc"
      | "name,desc"
      | "price,asc"
      | "price,desc"
      | "co2_rating,asc"
      | "co2_rating,desc"
  ) {
    await this.sortDropdown.selectOption(value);
  }

  // Category filter
  async filterByCategory(categoryName: string) {
    await this.page.getByLabel(categoryName, { exact: true }).check();
  }

  // Brand filter
  async filterByBrand(brandName: string) {
    await this.page.getByLabel(brandName, { exact: true }).check();
  }

  // Price range
  async setMaxPriceByPercent(percentFromLeft: number) {
    const slider = this.page.getByRole("slider").last();
    const box = await slider.boundingBox();
    if (!box) throw new Error("Max price slider not found");
    const startX = box.x + box.width - 2;
    const startY = box.y + box.height / 2;
    const endX = box.x + box.width * (percentFromLeft / 100);
    const endY = startY;
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY, { steps: 12 });
    await this.page.mouse.up();
  }

  async assertNoResultsVisible() {
    const products = this.page.locator(".card");
    await expect(products).toHaveCount(0, { timeout: 15000 });
  }

  async filterByMainCategory(name: "Hand Tools" | "Power Tools" | "Other") {
    const checkbox = this.page.getByLabel(name, { exact: true });
    await checkbox.check();
  }

  async filterBySubCategory(name: string) {
    const checkbox = this.page.getByLabel(name, { exact: true });
    await checkbox.check();
  }
}
