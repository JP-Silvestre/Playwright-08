import { expect, type Page } from '@playwright/test';
import type { User } from '../utilities/factory/factoryPattern';

export class LoginPage {

  constructor(private readonly page: Page) {}

  async attemptLogin(user: User): Promise<void> {

    await this.page.getByPlaceholder('Username').fill(user.username);
    await this.page.getByPlaceholder('Password').fill(user.password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async login(user: User): Promise<void> {

    await this.attemptLogin(user);
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  async expectError(message: string | RegExp): Promise<void> {

    await expect(this.page.locator('[data-test="error"]')).toContainText(message);
  }
}
 
