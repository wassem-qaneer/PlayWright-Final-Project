import { expect, Locator, Page } from "@playwright/test";
import { env } from "../../utils/env";

export class ProductPage {
  private productCards: Locator;

  private addToCartBtn: Locator;
  private cartBadge: Locator;

  constructor(private page: Page) {
    this.productCards = page.locator(
      [
        '[data-test="product"] a[href*="/product/"]',
        '[data-test="product-card"] a[href*="/product/"]',
        'a[href*="/product/"]:visible',
        '.card:has(a[href*="/product/"]) a[href*="/product/"]',
      ].join(", ")
    );

    this.addToCartBtn = page.locator(
      [
        '[data-test="add-to-cart"]',
        'button:has-text("Add to cart")',
        'button:has-text("Add To Cart")',
      ].join(", ")
    );

   
    this.cartBadge = page.locator(
      [
        '[data-test="cart-quantity"]',
        '[data-test="cart-count"]',
        ".cart-quantity",
        "header .badge",
      ].join(", ")
    );
  }

  
  async openProducts() {
    await this.page.goto(`${env.baseURL}/`, { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("domcontentloaded").catch(() => {});
    await this.page.waitForTimeout(400);


    if ((await this.productCards.count()) === 0) {
      await this.page.goto(`${env.baseURL}/products`, {
        waitUntil: "domcontentloaded",
      });
      await this.page.waitForLoadState("domcontentloaded").catch(() => {});
      await this.page.waitForTimeout(400);
    }

    await expect(this.productCards.first()).toBeVisible({ timeout: 20000 });
  }

  
  async openProductByIndex(index = 0) {
    await this.openProducts();

    await expect(this.productCards.first()).toBeVisible({ timeout: 20000 });

    const link = this.productCards.nth(index);
    await link.scrollIntoViewIfNeeded();
    await link.click();

    await this.page.waitForLoadState("domcontentloaded").catch(() => {});
    await expect(this.addToCartBtn.first()).toBeVisible({ timeout: 20000 });
  }

  async addToCart() {
    const btn = this.addToCartBtn.first();
    await expect(btn).toBeVisible({ timeout: 20000 });
    await expect(btn).toBeEnabled({ timeout: 20000 });

    const before = await this.getCartCount();
    await btn.click();
    await expect
      .poll(async () => await this.getCartCount(), { timeout: 20000 })
      .toBeGreaterThanOrEqual(before + 1);
  }

  async getCartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    const txt = (await this.cartBadge.first().innerText().catch(() => "0")).trim();
    const n = Number(txt.replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  async expectCartCountAtLeast(n: number) {
    await expect
      .poll(async () => await this.getCartCount(), { timeout: 20000 })
      .toBeGreaterThanOrEqual(n);
  }

  async openCart() {
    await this.page.goto(`${env.baseURL}/cart`, { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("domcontentloaded").catch(() => {});
  }

  
}
