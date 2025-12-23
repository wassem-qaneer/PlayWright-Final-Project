import { test, expect } from "@playwright/test";
import { env } from "../../utils/env";
import { CartPage } from "../../Pages/shop/CartPage";

test.describe("Cart", () => {
  test(" Remove item", async ({ page, request }) => {
    const cart = new CartPage(page);
    const productsRes = await request.get("https://api.practicesoftwaretesting.com/products");
    expect(productsRes.ok()).toBeTruthy();

    const productsJson: any = await productsRes.json();
    const products = Array.isArray(productsJson) ? productsJson : (productsJson.data ?? []);
    expect(products.length).toBeGreaterThan(0);

    
    const createCartRes = await request.post("https://api.practicesoftwaretesting.com/carts");
    expect(createCartRes.ok()).toBeTruthy();

    const createCartJson: any = await createCartRes.json();
    const cartId = String(createCartJson?.id ?? "");
    expect(cartId).toBeTruthy();

    
    let chosenProductId: string | null = null;

    for (let i = 0; i < Math.min(30, products.length); i++) {
      const p = products[i];
      const productId = p?.id;
      if (!productId) continue;

      const addRes = await request.post(`https://api.practicesoftwaretesting.com/carts/${cartId}`, {
        data: {
          product_id: String(productId),
          quantity: 1,
        },
      });

      if (addRes.ok()) {
        chosenProductId = String(productId);
        break;
      }
    }

    if (!chosenProductId) {
      throw new Error("Couldn't add any product to cart via API (tried 30 products).");
    }

    
    await page.addInitScript(
      ({ id }) => {
        window.sessionStorage.setItem("cart_id", id);
      },
      { id: cartId }
    );

    
    await cart.openCheckoutCart();
    await cart.waitAnyRow();
    const before = await cart.badgeCount();
    await cart.removeFirstItem();
    await expect
      .poll(async () => await cart.badgeCount(), { timeout: 30000 })
      .toBeLessThan(before);
  });
});
