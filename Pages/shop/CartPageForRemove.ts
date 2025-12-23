import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
  private navCart: Locator;
  private removeBtn: Locator;

  constructor(private page: Page) {
    this.navCart = page.locator('[data-test="nav-cart"]');
    this.removeBtn = page.locator(".btn.btn-danger").first();
  }

  async openFromNav() {
    await expect(this.navCart).toBeVisible();
    await this.navCart.click();
    await this.page.waitForURL(/\/checkout|\/cart/i, { timeout: 15000 });
  }

  async removeFirstItem() {
    await expect(this.removeBtn).toBeVisible({ timeout: 15000 });
    await this.removeBtn.click();
  }
}
