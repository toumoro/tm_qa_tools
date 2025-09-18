import { expect, Page } from '@playwright/test';
import { config } from '../../../project.config';

const {
  typo3: {
    routes,
    login: { usernameLabel, passwordLabel },
  },
} = config;

/**
 * Log in to the old TYPO3 backend
 *
 * @param { Page } page
 */
export async function login({
  page,
  username,
  password,
  authFile,
  url,
}: {
  page: Page;
  username: string;
  password: string;
  authFile: string;
  url?: string;
}) {
  await page.goto(`${url ? url : ''}${routes.home}`);
  await page.getByPlaceholder(usernameLabel).waitFor({ state: 'visible' });
  await page.getByPlaceholder(usernameLabel).fill(username);
  await page.getByPlaceholder(passwordLabel).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  // Exception for the setup

  await expect(
    page.locator('.t3js-topbar-button-modulemenu'),
    // error,
  ).toBeVisible();

  console.info('temporary authentification info will be saved in ', authFile);
  await page.context().storageState({ path: authFile });
}
