// pages/HomePage.ts
import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly runSmokeButton: Locator;

  // Elementos da tela de login (usados internamente)
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Elementos da Home
    this.runSmokeButton = page.getByTestId('quick-run');

    // Elementos de login – usando data-testid quando disponível
    this.emailInput = page.getByTestId('email');

    // Para o password: ajuste conforme o HTML real.
    // Opções comuns (escolha a que corresponde ao seu app):
    this.passwordInput = page.getByTestId('password');                    // se tiver data-testid="password"
    // Alternativas se NÃO tiver data-testid no password:
    // this.passwordInput = page.locator('input[type="password"]');
    // this.passwordInput = page.getByPlaceholder(/senha|password/i);

    this.submitButton = page.getByRole('button', { name: 'Entrar' });
    // Alternativa mais robusta se o nome mudar: page.getByTestId('login-submit') ou similar

    this.errorMessage = page.getByTestId('login-error');
  }

  /**
   * Faz login e espera chegar na página principal (home)
   */
  async login(email: string, password: string): Promise<void> {
    // Navega para login com espera de carregamento completo
    await this.page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 });

    // Espera o campo de email ficar visível (evita timeout precoce)
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });

    // Limpa o campo (caso tenha value pré-preenchido como "admin@admin.com")
    await this.emailInput.fill('');
    await this.emailInput.fill(email);

    // Preenche senha
    await this.passwordInput.fill(password);

    // Clica no botão
    await this.submitButton.click();

    // Espera o botão característico da home aparecer → confirma login OK
    await expect(this.runSmokeButton).toBeVisible({ timeout: 15000 });

    // Confirma que não apareceu mensagem de erro
    await expect(this.errorMessage).not.toBeVisible({ timeout: 5000 });
  }

  /**
   * Versão alternativa com nome mais descritivo
   */
  async loginAndNavigateToHome(email: string, password: string): Promise<void> {
    await this.login(email, password);
  }

  /**
   * Método conveniente: login + clique no botão de smoke
   */
  async loginAndRunSmoke(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await this.clickRunSmoke();
  }

  async clickRunSmoke(): Promise<void> {
    await this.runSmokeButton.click();
  }

  async expectRunSmokeButtonVisible(): Promise<void> {
    await expect(this.runSmokeButton).toBeVisible({ timeout: 10000 });
  }

  // Opcional: logout (ajuste o locator conforme seu app)
  async logout(): Promise<void> {
    // Exemplo: procure botão com texto "Sair", "Logout", etc.
    await this.page.getByRole('button', { name: /sair|logout|desconectar/i }).click();
    await this.page.waitForURL(/login|\/$/); // espera voltar pra login ou raiz
  }
}