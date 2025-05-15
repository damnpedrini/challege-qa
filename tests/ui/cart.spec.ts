import { test, expect } from '@playwright/test';
import { login } from '../utils';

test('Adicionar e remover produtos ao carrinho', async ({ page }) => {
  await login(page);


  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

  await page.locator('[data-test="shopping-cart-link"]').click();

  await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
  await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  const remainingItem = page.locator('.inventory_item_name');
  await expect(remainingItem).toHaveText('Sauce Labs Bike Light');

  const items = await page.locator('.cart_item').all();
  expect(items.length).toBe(1);
});