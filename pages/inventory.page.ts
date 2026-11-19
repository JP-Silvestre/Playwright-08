import { type Locator, type Page } from '@playwright/test';
import type { Product } from '../utilities/builder/builderPattern';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  private product(name: string): Locator {
    return this.page.locator('.inventory_item').filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }


  async getCatalog(): Promise<Product[]> {

    await this.page.locator('.inventory_item').first().waitFor();
    const names = await this.page.locator('.inventory_item_name').allInnerTexts();
    const prices = await this.page.locator('.inventory_item_price').allInnerTexts();

    return names.map((name, i) => ({
      name: name.trim(),
      price: Number(prices[i].replace('$', '')),
    }));
  }

  async addItemToCart(product: Product): Promise<void> {
    await this.product(product.name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async addItemsToCart(products: readonly Product[]): Promise<void> {
    for (const product of products) {
      await this.addItemToCart(product);
    }
  }
}
 