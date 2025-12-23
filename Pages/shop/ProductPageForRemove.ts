import { expect, Locator, Page } from "@playwright/test";
import { env } from "../../utils/env";

export class ProductPage {
  private increaseQty: Locator;
  private addToCartBtn: Locator;

  constructor(private page: Page) {
    this.increaseQty = page.locator('[data-test="increase-quantity"]');
    this.addToCartBtn = page.locator('[data-test="add-to-cart"]');
  }

  async openProductByDataTest(productDataTestId: string) {
    await this.page.goto(env.baseURL, { waitUntil: "domcontentloaded" });
    await this.page.locator(`[data-test="${productDataTestId}"]`).click();
  }

  async increaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.increaseQty.click();
    }
  }

  async addToCart() {
    await expect(this.addToCartBtn).toBeVisible();
    await this.addToCartBtn.click();
  }
}
