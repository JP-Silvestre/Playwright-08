import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';
import { CheckoutPage } from '../pages/checkout.page';
import { createUser } from '../utilities/factory/factoryPattern';
import { CatalogBuilder } from '../utilities/builder/builderPattern';

test('user can add products to the cart and complete checkout', async ({ page }) => {
  await page.goto('/');

  // factory
  const loginPage = new LoginPage(page);
  const credentials = await loginPage.readCredentials();
  const user = createUser('standard', credentials);
  await loginPage.login(user);

  // builder
  const inventoryPage = new InventoryPage(page);
  const catalog = await inventoryPage.getCatalog();
  const cart = new CatalogBuilder(catalog)
    .withProducts('Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt')
    .build();

  await inventoryPage.addItemsToCart(cart.products);

  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart\.html/);

  // verify that the selected items are in the cart
  for (const product of cart.products) {
    await expect(page.getByText(product.name, { exact: true })).toBeVisible();
  }

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.enterInformation('Playwright', 'Tester', '12345');

  await expect(page).toHaveURL(/checkout-step-two\.html/);

  const displayedSubtotal = Number(
    (await page.locator('[data-test="subtotal-label"]').innerText()).match(/\$([\d.]+)/)?.[1],
  );
  expect(displayedSubtotal).toBeCloseTo(cart.subtotal, 2);

  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
});

test('locked out user cannot log in', async ({ page }) => {
  await page.goto('/');

  const loginPage = new LoginPage(page);
  const user = createUser('locked_out', await loginPage.readCredentials());
  await loginPage.attemptLogin(user);

  await loginPage.expectError(/locked out/i);
});

 
