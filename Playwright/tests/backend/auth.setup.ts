import { expect, test as setup } from '@playwright/test';
import { getEnvVariable } from '../helpers/getEnvVariable';
import { config } from '../../project.config';

const username = getEnvVariable('TM_PLAYWRIGHT_BE_LOGIN_USERNAME');
const password = getEnvVariable('TM_PLAYWRIGHT_BE_LOGIN_PASSWORD');

const {
  typo3: { routes, login },
  playwright: { authFile },
} = config;

/**
 * @param { Page } page - La page Playwright
 */
setup("login to the admin interface (BE)", {
    tag: '@login-required',
    annotation: [

    ]
  }, async ({ page }) => {
  await page.goto(`${routes.home}`);
  await page.getByPlaceholder(login.usernameLabel).fill(username);
  await page.getByPlaceholder(login.passwordLabel).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  // Exception for the setup
  // eslint-disable-next-line playwright/no-standalone-expect
  await expect(
    page.locator('.t3js-topbar-button-modulemenu'),
    // error,
  ).toBeVisible();

  console.info('authentification info will be saved in ', authFile);
  await page.context().storageState({ path: authFile });
});
