import { Browser, FrameLocator, Locator, Page, expect } from '@playwright/test';
import { config } from '../../../project.config';
import { getEnvVariable } from '../../helpers/getEnvVariable';
import { waitForSiteIdle } from './loading';

const {
  typo3: { routes, records, backendUser },
  project: {
    backendInterface: { lang },
  },
} = config;

const adminPassword = getEnvVariable('TM_PLAYWRIGHT_BE_LOGIN_PASSWORD');

type UserField = { id: string; value: string; type: string };

/**
 * Find the warn button in the confirm modal and click it.
 * @param page - The Playwright Page object.
 */
export async function confirmModal(page: Page): Promise<void> {
  console.log('Confirming modal dialog...');
  const confirmButton = page.locator('.modal-dialog .btn-warning');
  await confirmButton.click();
  await waitForSiteIdle(page);
}

/**
 * Wait for the admin password input to appear, fill it, and submit.
 * It can be skipped if the input does not appear, for example
 * if the password as already been given for admin toggle.
 * @param page - The Playwright Page object.
 */
export async function confirmWithAdminPassword(page: Page): Promise<void> {
  try {
    console.log('Confirming with admin password...');
    const passwordInput = page.locator('.form-control');
    await passwordInput.waitFor({ state: 'visible', timeout: 3000 });
    await passwordInput.fill(adminPassword);
    await passwordInput.press('Enter');
    await waitForSiteIdle(page);
  } catch (error) {
    console.warn('Admin password confirmation was skipped or failed:', error);
  }
}
/**
 * Finds the table row for a specific user by their username.
 * This encapsulates the complex XPath locator.
 * @param frame - The content iframe locator.
 * @param username - The username to find.
 * @returns A Playwright Locator for the table row (tr).
 */
export function findUserRow(frame: FrameLocator, username: string): Locator {
  const tableBody = frame.locator('#typo3-backend-user-list');
  return tableBody.locator('tr').filter({
    has: frame.locator(`xpath=//a[normalize-space(text()[1]) = "${username}"]`),
  });
}

/**
 * Filters the user list by typing a username into the search field and submitting.
 * @param frame - The content iframe locator.
 * @param username - The username to search for.
 */
export async function filterUserList(
  frame: FrameLocator,
  username: string,
): Promise<void> {
  console.log(`Searching for backend user "${username}"...`);
  const searchInput = frame.locator('#tx_Beuser_username');
  await searchInput.fill(username);
  await searchInput.press('Enter');
  await waitForSiteIdle(frame.locator('..').page());
}

/**
 * Deletes a backend user from the user management interface.
 * Encapsulates navigation, searching, finding, clicking delete, and confirming.
 * @param page - The Playwright Page object.
 * @param username - The username of the user to delete.
 */
export async function deleteUser(page: Page, username: string): Promise<void> {
  await page.goto(routes.userManagement);
  const frame = page.frameLocator(records.selectors.moduleFrameSelector);

  await filterUserList(frame, username);

  const userRow = findUserRow(frame, username);
  await expect(userRow).toBeVisible();

  const deleteButton = userRow.locator(
    'button[data-target-form^="be_user_remove_"]',
  );

  // There is a real issue in TYPO3 when deleting users too fast.
  // eslint-disable-next-line playwright/no-networkidle
  await page.waitForLoadState('networkidle');

  await deleteButton.click();

  await confirmModal(page);

  await expect(findUserRow(frame, username)).toBeHidden();
  console.log(`[TEARDOWN] Backend user "${username}" deleted.`);
}

/**
 * Creates a new backend user via the UI.
 * Encapsulates the entire user creation flow from the `beforeAll` hook.
 * @param browser - The Playwright Browser instance.
 * @param userFields - The array of user fields from the config.
 */
export async function createUser(
  browser: Browser,
  userFields: UserField[],
  admin: boolean = false,
): Promise<void> {
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Creating a new backend user...');
  await page.goto(routes.userManagement);
  const frame = page.frameLocator(records.selectors.moduleFrameSelector);

  await frame.locator('.btn-toolbar a').first().click();
  await waitForSiteIdle(page);

  const editFrame = page.frameLocator(records.selectors.moduleFrameSelector);

  for (const { id, value } of userFields.filter(
    ({ type }) => type === 'input',
  )) {
    const input = editFrame.locator(records.selectors.inputSelector(id));
    await input.fill(value);
    await input.press('Tab');
  }

  const select = editFrame.locator(records.selectors.selectSelector('lang'));
  await select.selectOption({ value: lang === 'en' ? 'default' : lang });

  if (admin) {
    console.log('Set user as admin');
    await editFrame.locator(records.selectors.inputSelector('admin')).click();
    await confirmModal(page);
    await confirmWithAdminPassword(page);
  }

  await waitForSiteIdle(page);

  const accessTab = editFrame
    .locator('.nav-link')
    .getByText(backendUser[lang].accessTab);

  const html = await accessTab.innerHTML();
  console.log('Access tab html:', html);
  await accessTab.waitFor({ state: 'visible' });

  await accessTab.click();
  await editFrame.locator(records.selectors.inputSelector('disable')).click();

  await editFrame.locator('button[name="_savedok"]').click();
  await waitForSiteIdle(page);

  await confirmWithAdminPassword(page);

  expect(await page.locator('.alert-success').count()).toBeGreaterThan(0);
  console.log(`[SETUP] Backend user "${userFields[0].value}" created.`);
  await context.close();
}
