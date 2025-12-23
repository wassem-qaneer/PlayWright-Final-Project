import { test } from "@playwright/test";
import { ProductPage as ProductPageForRemove } from "../../Pages/shop/ProductPageForRemove";
import { CartPage as CartPageForRemove } from "../../Pages/shop/CartPageForRemove";

test("Cart - Add then Remove (UI)", async ({ page }) => {
  const product = new ProductPageForRemove(page);
  const cart = new CartPageForRemove(page);
  await product.openProductByDataTest("product-01KD6G69FBN3WCRRBMVYYKFD5C");
  await product.increaseQuantity(1);
  await product.addToCart();

  await cart.openFromNav();
  await cart.removeFirstItem();
});
