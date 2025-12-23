import { test, expect } from "@playwright/test";
import { env } from "../../utils/env";

test.describe("Cart", () => {
  test("CART-02 | Add to cart (API)", async ({ page, request }) => {
    const res = await request.get("https://api.practicesoftwaretesting.com/products");
    expect(res.ok()).toBeTruthy();
    const json: any = await res.json();
    const list = Array.isArray(json) ? json : (json.data ?? []);
    expect(list.length).toBeGreaterThan(0);
    const productId = list[0].id;
    expect(productId).toBeTruthy();
    await page.goto(`${env.baseURL}/product/${productId}`, { waitUntil: "domcontentloaded" });
    const addBtn = page.getByRole("button", { name: /add to cart/i });
    await expect(addBtn).toBeVisible({ timeout: 20000 });
    await addBtn.click();
    const cartQty = page.locator('[data-test="cart-quantity"]');
    await expect(cartQty).toBeVisible({ timeout: 20000 });
  });
});
