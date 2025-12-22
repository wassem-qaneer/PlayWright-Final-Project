import { expect, Locator, Page } from "@playwright/test";
import { env } from "../../utils/env";

export class ProductPage {
  private productsGrid: Locator;
  private productCards: Locator;

  private addToCartBtn: Locator;
  private cartBadge: Locator;

  constructor(private page: Page) {

    this.productsGrid = page.locator('[data-test="product-grid"], .products, .container');
    this.productCards = page.locator('[data-test="product"], .card');
    
    this.addToCartBtn = page.locator('[data-test="add-to-cart"], button:has-text("Add to cart")');

    
    this.cartBadge = page.locator(
      '[data-test="cart-quantity"], [data-test="cart-count"], .cart-quantity, .badge'
    );
  }

  
  async openShop() {
    await this.page.goto(`${env.baseURL}/#`, { waitUntil: "domcontentloaded" });
    const url = this.page.url();
    if (!/products|#|\/$/i.test(url)) {
      await this.page.goto(`${env.baseURL}/products`, { waitUntil: "domcontentloaded" }).catch(() => {});
    }
  }

  
  async openProducts() {
    await this.page.goto(`${env.baseURL}/products`, { waitUntil: "domcontentloaded" });
   
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  
  async openProductByIndex(index = 0) {
    
    await expect(this.productCards.first()).toBeVisible({ timeout: 20000 });

    const card = this.productCards.nth(index);
    await card.scrollIntoViewIfNeeded();

    
    const link = card.locator("a").first();
    if (await link.count()) {
      await link.click();
    } else {
      await card.click();
    }

   
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.addToCartBtn).toBeVisible({ timeout: 20000 });
  }

  
  async openProductByName(name: string) {
    const card = this.productCards.filter({ hasText: name }).first();
    await expect(card).toBeVisible({ timeout: 20000 });

    const link = card.locator("a").first();
    if (await link.count()) {
      await link.click();
    } else {
      await card.click();
    }

    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.addToCartBtn).toBeVisible({ timeout: 20000 });
  }

  async addToCart() {
    await expect(this.addToCartBtn).toBeVisible({ timeout: 20000 });
    await this.addToCartBtn.click();

    
    await this.page.waitForTimeout(300);
  }

 
  async getCartCount(): Promise<number | null> {
    if ((await this.cartBadge.count()) === 0) return null;
    const txt = (await this.cartBadge.first().innerText().catch(() => "")).trim();
    const n = Number(txt.replace(/[^\d]/g, ""));
    return Number.isFinite(n) ? n : null;
  }

  
  async openCart() {
    const cartLink = this.page.locator(
      '[data-test="nav-cart"], a[href*="/cart"], a:has-text("Cart"), button:has-text("Cart")'
    ).first();

    await expect(cartLink).toBeVisible({ timeout: 20000 });
    await cartLink.click();
    await this.page.waitForLoadState("domcontentloaded");
  }
}
