import { expect, type Page } from '@playwright/test';
import type { LoginCredentials, User } from '../utilities/factory/factoryPattern';

export class LoginPage {

  constructor(private readonly page: Page) {}

  async readCredentials(): Promise<LoginCredentials> {

    const usernamesText = await this.page.locator('[data-test="login-credentials"]').innerText();
    const passwordText = await this.page.locator('[data-test="login-password"]').innerText();

    const lines = (text: string) => text.split('\n').map((line) => line.trim()).filter(Boolean);

    const usernames = lines(usernamesText).filter((line) => !/accepted usernames/i.test(line));
    const [password] = lines(passwordText).filter((line) => !/password for all users/i.test(line));

    if (usernames.length === 0 || !password) {
      throw new Error('failed to read login credentials from the page');
    }
    return { usernames, password };
  }


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
 
