import test, { expect } from '@playwright/test';
import { navigateTo, navigateToRecord } from '../../helpers/navigate';
import { waitForSiteIdle } from './loading';
import { createElement, deleteElement } from './page';
import {
  createRecord,
  getItemToSelectContainer,
  getSelectedItemsContainer,
  deleteRecord,
  createUserRecord,
} from './record';
import { config } from '../../../project.config';

const {
  typo3: { routes, userRecords, records },
  playwright: { createUsersTest },
  project: {
    backendInterface: { lang },
  },
} = config;

export const runFEUserTests = () => {
  let folderUid = 0;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(routes.pages);
    folderUid = await createElement({
      page,
      type: 'folder',
      title: createUsersTest.userFolderTitle,
    });
    console.info(`[SETUP] Folder ${folderUid} created for testing.`);

    await expect(page.locator(`.node[data-id="${folderUid}"]`)).toBeVisible();

    await navigateTo({ page, route: routes.list });

    await createRecord({
      page,
      uid: folderUid,
      moduleName: userRecords[lang].groupModuleNameLabel,
      moduleFields: createUsersTest.groupFields,
    });

    await createRecord({
      page,
      uid: folderUid,
      moduleName: userRecords[lang].groupModuleNameLabel,
      moduleFields: createUsersTest.secondaryGroupFields,
    });

    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await navigateTo({ page, route: routes.list });
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(routes.pages);
    await deleteElement({ page, uid: folderUid });
    console.info(`[TEARDOWN] Folder ${folderUid} deleted.`);
    await context.close();
  });

  test('backend user can create a frontend group', async ({ page }) => {
    const frame = await navigateToRecord({
      page,
      uid: folderUid,
      moduleName: userRecords[lang].groupModuleNameLabel,
    });

    await Promise.all(
      createUsersTest.groupFields.map(async ({ id, value }) => {
        await expect(
          frame.locator(records.selectors.inputSelector(id)),
        ).toHaveValue(value);
      }),
    );
  });

  test('frontend group should contains sub-groups', async ({ page }) => {
    const frame = await navigateToRecord({
      page,
      uid: folderUid,
      moduleName: userRecords[lang].groupModuleNameLabel,
    });

    await waitForSiteIdle(page);

    // get right module list
    const itemsToSelectContainer = getItemToSelectContainer(frame);

    await waitForSiteIdle(page);

    await itemsToSelectContainer
      .locator('option')
      .first()
      .waitFor({ state: 'attached' });
    expect(
      (await itemsToSelectContainer.locator('option').all()).length,
    ).toBeGreaterThan(0);
  });

  test('backend user can add and remove subgroup to a frontend group', async ({
    page,
  }) => {
    const frame = await navigateToRecord({
      page,
      uid: folderUid,
      moduleName: userRecords[lang].groupModuleNameLabel,
    });

    await waitForSiteIdle(page);

    // get right module list
    const itemsToSelectContainer = getItemToSelectContainer(frame);

    // get left module list
    const selectedItemsContainer = getSelectedItemsContainer(frame);

    // add
    await expect(selectedItemsContainer.locator('option')).toHaveCount(0);

    await itemsToSelectContainer
      .locator('option:not([disabled])')
      .first()
      .click();

    await selectedItemsContainer
      .locator('option')
      .first()
      .waitFor({ state: 'attached' });
    expect(
      (await selectedItemsContainer.locator('option').all()).length,
    ).toBeGreaterThan(0);

    // remove
    await selectedItemsContainer
      .locator('option:not([disabled])')
      .first()
      .click();
    await frame.locator('.form-multigroup-item .t3js-btn-removeoption').click();

    await expect(selectedItemsContainer.locator('option')).toHaveCount(0);
  });

  test('backend user can delete a frontend group', async ({ page }) => {
    const frame = await deleteRecord({
      page,
      uid: folderUid,
      moduleName: userRecords[lang].groupModuleNameLabel,
    });

    await expect(
      frame.getByText(createUsersTest.groupFields[0]['value']).first(),
    ).toBeHidden();
  });

  test.describe('frontend user creation', () => {
    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await navigateTo({ page, route: routes.list });
      await createUserRecord({
        page,
        uid: folderUid,
        moduleName: userRecords[lang].userModuleNameLabel,
        moduleFields: createUsersTest.userFields,
      });
      await context.close();
    });

    test('backend user can create a frontend user', async ({ page }) => {
      const frame = await navigateToRecord({
        page,
        uid: folderUid,
        moduleName: userRecords[lang].userModuleNameLabel,
      });

      // get left module list
      const selectedItemsContainer = getSelectedItemsContainer(frame);

      await expect(selectedItemsContainer.locator('option')).toHaveCount(1);

      const [username, password] = createUsersTest.userFields;
      await expect(
        frame.locator(records.selectors.inputSelector(username.id)),
      ).toHaveValue(username.value);
      await expect(
        frame.locator(records.selectors.inputSelector(password.id)),
      ).toHaveValue('********');
    });

    test('backend user can add and remove frontend group to a frontend user', async ({
      page,
    }) => {
      const frame = await navigateToRecord({
        page,
        uid: folderUid,
        moduleName: userRecords[lang].userModuleNameLabel,
      });

      // get right module list
      const itemsToSelectContainer = getItemToSelectContainer(frame);

      // get left module list
      const selectedItemsContainer = getSelectedItemsContainer(frame);

      // add
      await expect(selectedItemsContainer.locator('option')).toHaveCount(1);

      await itemsToSelectContainer
        .locator('option')
        .first()
        .waitFor({ state: 'attached' });
      const firstEnabledOption = itemsToSelectContainer
        .locator('option:not([disabled])')
        .first();
      await expect(firstEnabledOption).toBeVisible();
      await firstEnabledOption.click();

      // 2 because the initial group created in the beforeAll then the new one for the test
      await expect(selectedItemsContainer.locator('option')).toHaveCount(2);

      // remove
      await selectedItemsContainer
        .locator('option:not([disabled])')
        .first()
        .click();
      await frame
        .locator('.form-multigroup-item .t3js-btn-removeoption')
        .click();

      // back to 1 because we removed the added one, the initial one is still here
      await expect(selectedItemsContainer.locator('option')).toHaveCount(1);
    });

    test('backend user can delete a frontend user', async ({ page }) => {
      const frame = await deleteRecord({
        page,
        uid: folderUid,
        moduleName: userRecords[lang].userModuleNameLabel,
      });

      await expect(
        frame.getByText(createUsersTest.userFields[0]['value']).first(),
      ).toBeHidden();
    });
  });
};
