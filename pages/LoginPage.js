const { test, expect } = require('@playwright/test');

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.email = page.getByLabel('Email');
    this.password = page.getByLabel('Senha');
    this.submit = page.getByRole('button', { name: 'Entrar' });
    this.error = page.getByTestId('login-error');
  }

  async goto() {
    await this.page.goto(
      'https://playwright-frontend-production.up.railway.app/login'
    );
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  async expectErrorVisible() {
    await expect(this.error).toBeVisible();
  }
}

// =======================
// TESTE
// =======================

test('Login com credenciais válidas', async ({ page }) => {
  // 🔐 credenciais
  const EMAIL = 'admin@admin.com';
  const PASSWORD = 'admin123';

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(EMAIL, PASSWORD);

  // valida que saiu da tela de login
  await expect(page).not.toHaveURL(/login/i);
});
