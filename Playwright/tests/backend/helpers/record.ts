import { Page, FrameLocator, expect } from '@playwright/test';
import { navigateToPage, navigateToRecord } from '../../helpers/navigate';
import { waitForSiteIdle } from './loading';
import { config } from '../../../project.config';
import { notify } from './error';

const {
  typo3,
  project: {
    backendInterface: { lang },
  },
} = config;

// Function to create a record
export async function createRecord({
  page,
  uid,
  moduleName,
  moduleFields,
}: {
  page: Page;
  uid: number;
  moduleName: string;
  moduleFields: Array<{ id: string; value: string; type: string }>;
}) {
  await navigateToPage({ page, uid });

  // Wait for iframe
  await waitForSiteIdle(page);

  const contentFrame = page.frameLocator('iframe');
  await contentFrame
    .getByText(typo3.records[lang].createRecordLabel)
    .first()
    .click();

  // Wait for iframe
  await waitForSiteIdle(page);

  const editFrame = page.frameLocator(
    typo3.records.selectors.moduleFrameSelector,
  );

  const record = editFrame
    .locator(typo3.records.selectors.moduleSelector)
    .getByText(moduleName, { exact: true });

  await record.click();

  await waitForSiteIdle(page);

  let lastInput;

  for (const { id, value } of moduleFields.filter(
    ({ type }) => type === 'input' || type === 'link',
  )) {
    const input = editFrame.locator(typo3.records.selectors.inputSelector(id));

    await input.fill(value);
    lastInput = input;
  }

  await lastInput?.press('Enter');

  // Wait for site idle and notify
  await waitForSiteIdle(page);
  await notify(page, 'modal');

  return editFrame;
}

// Function to update a record
export async function updateRecord({
  page,
  uid,
  moduleName,
  moduleFields,
  searchTerm
}: {
  page: Page;
  uid: number;
  moduleName: string;
  moduleFields: Array<{ id: string; value: string; type: string }>;
  searchTerm?: string;
}) {
  const editFrame = await navigateToRecord({ page, uid, moduleName, searchTerm });

  let lastInput;

  for (const { id, value, type } of moduleFields) {

    if(type === 'link' || type === 'select') {
      continue;
    }

    const input = editFrame.locator(typo3.records.selectors.inputSelector(id));

    await input.fill(value);
    lastInput = input;
  }

  await lastInput?.press('Enter');

  // Wait for site idle and notify
  await waitForSiteIdle(page);
  await notify(page, 'modal');

  return editFrame;
}

// Function to delete a record
export async function deleteRecord({
  page,
  uid,
  moduleName,
  searchTerm,
}: {
  page: Page;
  uid: number;
  moduleName: string;
  searchTerm?: string;
}) {
  const frame = await navigateToRecord({ page, uid, moduleName, searchTerm });

  const deleteButton = frame
    .locator(typo3.records.selectors.deleteRecordSelector)
    .first();

  await expect(
    deleteButton,
    `The ${typo3.pages.selectors.confirmDeleteSelector} Selector should be visible.`,
  ).toBeVisible();

  await deleteButton.click();

  const confirmButton = page.locator(
    typo3.records.selectors.confirmDeleteSelector,
  );

  await confirmButton.first().waitFor({ state: 'visible' });
  await confirmButton.first().dblclick();
  await confirmButton.first().waitFor({ state: 'detached' });

  await waitForSiteIdle(page);
  return frame;
}

/**
 * return the right list of a multi-select field like "Usergroup"
 * @param frame
 * @returns
 */
export const getItemToSelectContainer = (frame: FrameLocator) =>
  frame
    .locator('.form-multigroup-item')
    .filter({
      has: frame.locator('.t3js-formengine-select-itemstoselect'),
    })
    .locator('select');

/**
 *  return the left list of a multi-select field like "Usergroup"
 * @param frame
 * @returns
 */
export const getSelectedItemsContainer = (frame: FrameLocator) =>
  frame
    .locator('.form-multigroup-item')
    .filter({
      hasNot: frame.locator('.t3js-formengine-select-itemstoselect'),
    })
    .locator('select');

// TODO standardize the createRecord function to be able to create user with it.
export const createUserRecord = async ({
  page,
  uid,
  moduleName,
  moduleFields,
}: {
  page: Page;
  uid: number;
  moduleName: string;
  moduleFields: Array<{ id: string; value: string; type: string }>;
}) => {
  await navigateToPage({ page, uid });

  // Wait for iframe
  await waitForSiteIdle(page);

  const contentFrame = page.frameLocator('iframe');
  await contentFrame
    .getByText(typo3.records[lang].createRecordLabel)
    .first()
    .click();

  // Wait for iframe
  await waitForSiteIdle(page);

  const editFrame = page.frameLocator(
    typo3.records.selectors.moduleFrameSelector,
  );

  const record = editFrame
    .locator(typo3.records.selectors.moduleSelector)
    .getByText(moduleName, { exact: true });

  await record.click();

  // get right module list
  const itemsToSelectContainer = getItemToSelectContainer(editFrame);

  await itemsToSelectContainer.locator('option').first().click();

  for (const { id, value } of moduleFields.filter(
    ({ type }) => type === 'input',
  )) {
    const input = editFrame.locator(typo3.records.selectors.inputSelector(id));
    await input.fill(value);
  }

  await editFrame.locator('button[name="_savedok"]').click();
  await waitForSiteIdle(page);

  return editFrame;
};
