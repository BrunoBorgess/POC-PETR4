// home.spec.ts ou smoke.spec.ts
import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('Rodar smoke após login', async ({ page }) => {
  const home = new HomePage(page);

  await home.login(
    process.env.LOGIN_EMAIL!,
    process.env.LOGIN_PASSWORD!
  );

  await home.clickRunSmoke();

  // aqui você pode continuar validando o resultado do smoke, se quiser
});