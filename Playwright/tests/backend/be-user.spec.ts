import test, { BrowserContext, expect, Page } from '@playwright/test';
import { config } from '../../project.config';
import { login } from './helpers/login';
import {
  createUser,
  deleteUser,
  filterUserList,
  findUserRow,
} from './helpers/user-management';
import { runFEUserTests } from './helpers/fe-user-test';

const {
  typo3: { routes, records },
  playwright: { createUsersTest, tempAuthFile, authFile },
} = config;

test.describe('creation and management of backend users', () => {
  test.beforeAll(async ({ browser }) => {
    await createUser(browser, createUsersTest.userFields, true);
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    const [username] = createUsersTest.userFields;

    await deleteUser(page, username.value);
    await context.close();
  });

  test('backend user can be found via search', async ({ page }) => {
    await page.goto(routes.userManagement);
    const [username] = createUsersTest.userFields;
    const frame = page.frameLocator(records.selectors.moduleFrameSelector);

    await filterUserList(frame, username.value);
    const userRow = findUserRow(frame, username.value);

    await expect(userRow).toHaveCount(1);
  });

  test.describe('authenticated tests with temp user', () => {
    let context: BrowserContext;
    let page: Page;
    const [username, password] = createUsersTest.userFields;

    test.beforeAll(async ({ browser }) => {
      context = await browser.newContext();
      await context.clearCookies();
      page = await context.newPage();
      await login({
        page,
        username: username.value,
        password: password.value,
        authFile: tempAuthFile,
      });
    });

    test.afterAll(async () => {
      await context.close();
    });

    test('User can access dashboard', async () => {
      await page.goto(routes.home);
      await expect(
        page.locator('.t3js-topbar-button-modulemenu'),
      ).toBeVisible();
    });

    runFEUserTests();
  });
});
