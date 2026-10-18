import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  private product(name: string): Locator {
    return this.page.locator('.inventory_item').filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  async addItemToCart(name: string): Promise<number> {
    const product = this.product(name);
    const price = Number((await product.locator('.inventory_item_price').innerText()).replace('$', ''));
    await product.getByRole('button', { name: 'Add to cart' }).click();
    return price;
  }
}
