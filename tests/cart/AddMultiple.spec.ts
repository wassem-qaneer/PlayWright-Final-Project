import { test, expect } from "@playwright/test";
import { env } from "../../utils/env";

test.describe("Cart", () => {
  test.setTimeout(90000);

  const scenarios = [{ name: "Add multiple items", items: 2 }];

  for (const s of scenarios) {
    test(s.name, async ({ page, request }) => {
      const res = await request.get("https://api.practicesoftwaretesting.com/products");
      expect(res.ok()).toBeTruthy();

      const json: any = await res.json();
      const list = Array.isArray(json) ? json : (json.data ?? []);
      expect(list.length).toBeGreaterThanOrEqual(s.items);

      const id1 = list[0].id;
      const id2 = list[1].id;

      const qty = page.locator('[data-test="cart-quantity"], .cart-quantity, .badge').first();

      await page.goto(`${env.baseURL}/product/${id1}`, { waitUntil: "domcontentloaded" });
      const addBtn1 = page.getByRole("button", { name: /add to cart/i });
      await expect(addBtn1).toBeVisible({ timeout: 20000 });
      const before1 = await qty.innerText().catch(() => "0");
      const b1 = Number(String(before1).replace(/[^\d]/g, "")) || 0;

      await addBtn1.click();

      await expect
        .poll(async () => {
          const t = await qty.innerText().catch(() => "0");
          return Number(String(t).replace(/[^\d]/g, "")) || 0;
        }, { timeout: 20000 })
        .toBeGreaterThanOrEqual(b1 + 1);

      await page.goto(`${env.baseURL}/product/${id2}`, { waitUntil: "domcontentloaded" });
      const addBtn2 = page.getByRole("button", { name: /add to cart/i });
      await expect(addBtn2).toBeVisible({ timeout: 20000 });
      const before2 = await qty.innerText().catch(() => "0");
      const b2 = Number(String(before2).replace(/[^\d]/g, "")) || 0;

      await addBtn2.click();

      await expect
        .poll(async () => {
          const t = await qty.innerText().catch(() => "0");
          return Number(String(t).replace(/[^\d]/g, "")) || 0;
        }, { timeout: 20000 })
        .toBeGreaterThanOrEqual(b2);
    });
  }
});
