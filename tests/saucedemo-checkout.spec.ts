import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';
import { CheckoutPage } from '../pages/checkout.page';

test('user can add products to the cart and complete checkout', async ({ page }) => {
  await page.goto('/');

  //load env variables
  const username = process.env.APP_USERNAME;
  const password = process.env.PASSWORD;

  if (!username || !password) {
    throw new Error('Set APP_USERNAME and PASSWORD in your .env file.');
  }

  //class instance for login page
  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);

  const selectedNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
  const inventoryPage = new InventoryPage(page);
  const subtotal =
    (await inventoryPage.addItemToCart(selectedNames[0])) +
    (await inventoryPage.addItemToCart(selectedNames[1])) +
    (await inventoryPage.addItemToCart(selectedNames[2]));

  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart\.html/);

  // verify that the selected items are in the cart 
  for (const name of selectedNames) {
    await expect(page.getByText(name, { exact: true })).toBeVisible();
  }

  //class instance for checkout page
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.enterInformation('Playwright', 'Tester', '12345');

  await expect(page).toHaveURL(/checkout-step-two\.html/);

  const displayedSubtotal = Number(
    (await page.locator('[data-test="subtotal-label"]').innerText()).match(/\$([\d.]+)/)?.[1],
  );
  expect(displayedSubtotal).toBeCloseTo(subtotal, 2);

  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
});
