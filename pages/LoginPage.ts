import { expect, Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.getByLabel('Email');
    this.password = page.getByLabel('Senha');
    this.submit = page.getByRole('button', { name: 'Entrar' });
    this.error = page.getByTestId('login-error');
  }

  async goto(): Promise<void> {
    // usa baseURL do playwright.config
    await this.page.goto('/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  async expectErrorVisible(): Promise<void> {
    await expect(this.error).toBeVisible();
  }
}
