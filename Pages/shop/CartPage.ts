import { expect, Locator, Page } from "@playwright/test";
import { env } from "../../utils/env";

export class CartPage {
  private cartRows: Locator;
  private cartQtyBadge: Locator;

  constructor(private page: Page) {
    this.cartRows = page.locator("table tbody tr, table tr").filter({
      has: page.locator("td"),
    });

    
    this.cartQtyBadge = page
      .locator('[data-test="cart-quantity"], [data-test="cart-count"], .cart-quantity, header .badge')
      .first();
  }

  async openCheckoutCart() {
    await this.page.goto(`${env.baseURL}/checkout`, { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("domcontentloaded");
  }

  async badgeCount(): Promise<number> {
    const t = (await this.cartQtyBadge.innerText().catch(() => "0")).trim();
    const n = Number(t.replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  async waitBadgeAtLeast(n: number) {
    await expect
      .poll(async () => await this.badgeCount(), { timeout: 30000 })
      .toBeGreaterThanOrEqual(n);
  }

  async waitAnyRow() {
    await expect(this.cartRows.first()).toBeVisible({ timeout: 30000 });
  }

  async removeFirstItem() {
    const firstRow = this.cartRows.first();
    await expect(firstRow).toBeVisible({ timeout: 30000 });

    const removeIcon = firstRow.locator("td:last-child img").first();
    await expect(removeIcon).toBeVisible({ timeout: 30000 });
    await removeIcon.click({ force: true });
  }
}
