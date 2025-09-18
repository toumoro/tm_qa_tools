import test, { expect } from '@playwright/test';
import { config } from '../../project.config';
import { navigateTo, navigateToRecord } from '../helpers/navigate';
import { createRecord, deleteRecord, updateRecord } from './helpers/record';
import { getTestPathFromSourcePath } from './helpers/redirect';
import { clearTYPO3Cache } from './helpers/loading';

const folderUid = 0;
const {
  typo3: { routes, redirectRecords, records },
  playwright: { createRedirectTest },
  project: {
    backendInterface: { lang },
  },
} = config;
const [redirectSourcePath] = createRedirectTest.fields;

test.describe('manage redirections', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await navigateTo({ page, route: routes.list });

    console.info(`[SETUP] Redirect added to page with UID ${folderUid}.`);
    await createRecord({
      page,
      uid: folderUid,
      moduleName: redirectRecords[lang].redirectModuleNameLabel,
      moduleFields: createRedirectTest.fields,
    });

    await clearTYPO3Cache(page, { flushAllCaches: true });
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await navigateTo({ page, route: routes.list });
  });

  // test de création d'une redirection
  test("check new redirection visibility when created", async ({ page }) => {
    const frame = await navigateToRecord({
      page,
      uid: folderUid,
      moduleName: redirectRecords[lang].redirectModuleNameLabel,
      searchTerm: redirectSourcePath.value,
    });

    await Promise.all(
      createRedirectTest.fields.map(async ({ id, value, type }) => {
        const locator = frame.locator(
          type === 'select'
            ? records.selectors.selectSelector(id)
            : records.selectors.inputSelector(id),
        );

        await expect(locator).toHaveValue(value);
      }),
    );
  });

  // test de modification d'une redirection
  test("check redirection when edited", async ({ page }) => {
    const frame = await updateRecord({
      page,
      uid: folderUid,
      moduleName: redirectRecords[lang].redirectModuleNameLabel,
      moduleFields: createRedirectTest.fields,
      searchTerm: redirectSourcePath.value,
    });

    await Promise.all(
      createRedirectTest.fields.map(async ({ id, value, type }) => {
        const locator = frame.locator(
          type === 'select'
            ? records.selectors.selectSelector(id)
            : records.selectors.inputSelector(id),
        );

        await expect(locator).toHaveValue(value);
      }),
    );
  });

  test("check redirection when deleted", async ({ page }) => {
    const frame = await deleteRecord({
      page,
      uid: folderUid,
      moduleName: redirectRecords[lang].redirectModuleNameLabel,
      searchTerm: redirectSourcePath.value,
    });
    await clearTYPO3Cache(page, { flushAllCaches: true });

    await expect(
      frame.getByText(createRedirectTest.fields[0]['value']).first(),
    ).toBeHidden();
  });
});

// test de modification d'une redirection
test("check integrity of a created redirection", async ({ page }) => {
  await navigateTo({ page, route: routes.list });

  const frame = await navigateToRecord({
    page,
    uid: folderUid,
    moduleName: redirectRecords[lang].redirectModuleNameLabel,
  });

  // on récupère le champ source_path et le code de statut
  const sourcePath = await frame
    .locator(records.selectors.inputSelector(createRedirectTest.fields[0].id))
    .inputValue();

  const targetCode = await frame
    .locator(records.selectors.selectSelector(createRedirectTest.fields[2].id))
    .inputValue();

  const path = getTestPathFromSourcePath(sourcePath);

  const response = await page.request.get(path, {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(parseInt(targetCode, 10));

  const redirectUrl = response.headers()['location']!;
  const finalResponse = await page.request.get(redirectUrl);

  expect(finalResponse.status()).toBe(200);
});
