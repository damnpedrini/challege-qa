import { test, expect } from '@playwright/test';
import { login } from '../utils';

test('Adicionar e remover produtos ao carrinho', async ({ page }) => {
  await login(page);

  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="continue"]').click();

 await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required')
});