import { expect, FrameLocator, Page } from '@playwright/test';
import { navigateToContent, navigateToPage } from '../../helpers/navigate';
import { config } from '../../../project.config';
import { waitForSiteIdle } from './loading';
import { notify } from './error';

const {
  typo3,
  playwright,
  project: {
    typo3Version,
    backendInterface: { lang, contents },
  },
} = config;

/**
 * Performs the UI actions to create a new content element.
 * @returns The frame locator where the content fields are located.
 */
export async function createContentElement({
  page,
  uid,
}: {
  page: Page;
  uid: number;
}): Promise<FrameLocator> {
  await navigateToPage({
    page,
    uid,
    rightClick: false,
  });

  // Wait for iframe and click "Create Content"
  await waitForSiteIdle(page);
  const contentFrame = page.frameLocator('iframe');

  /** @todo: Add an option to spciefy the section where the new content element should be placed. */
  await contentFrame
    .getByText(typo3.contents[lang].createContentLabel)
    .last()
    .click();

  // Wait and select the element type from the wizard
  await waitForSiteIdle(page);
  const wizardContent = page.locator(typo3.contents.selectors.wizardSelector);
  await wizardContent
    .getByText(typo3.contents[lang].elementLabel(typo3Version, contents.labels))
    .first()
    .click();

  // Wait for the edit form to appear
  await waitForSiteIdle(page);
  const editFrame = page.frameLocator('iframe');

  // Fill in all the required fields
  for (const { id, value } of playwright.createContentTest.fields) {
    const input = editFrame.locator(typo3.contents.selectors.inputSelector(id));

    await input.fill(value);
    await input.press('Enter');
    await waitForSiteIdle(page);

    await notify(page, 'modal');
  }

  return editFrame;
}

// Function to update a content element
export async function updateContentElement({
  page,
  uid,
}: {
  page: Page;
  uid: number;
}) {
  const editFrame = await navigateToContent({ page, uid });

  for (const { id, value } of playwright.createContentTest.fields) {
    const input = editFrame.locator(typo3.contents.selectors.inputSelector(id));

    await input.fill(value);
    await input.press('Enter');
    await waitForSiteIdle(page);

    await notify(page, 'modal');
  }

  return editFrame;
}

// Function to delete a content element
export async function deleteContentElement({
  page,
  uid,
}: {
  page: Page;
  uid: number;
}) {
  await navigateToPage({ page, uid, rightClick: false });

  // Wait for iframe
  await waitForSiteIdle(page);
  const frame = page.frameLocator('iframe');

  const element = frame
    .locator(typo3.contents.selectors.elementPreviewSelector(typo3Version))
    .getByText(playwright.createContentTest.fields[0]['value'], {
      exact: true,
    });

  await element.click();

  const deleteButton = frame
    .locator(typo3.contents.selectors.deleteRecordSelector)
    .first();

  await expect(
    deleteButton,
    `The ${typo3.pages.selectors.confirmDeleteSelector} Selector should be visible.`,
  ).toBeVisible();

  await deleteButton.click();

  const confirmButton = page.locator(
    typo3.contents.selectors.confirmDeleteSelector,
  );

  await expect(
    confirmButton,
    `The ${typo3.contents.selectors.confirmDeleteSelector} Selector should be visible.`,
  ).toBeVisible();

  await confirmButton.click();
  await confirmButton.waitFor({ state: 'detached' });

  await waitForSiteIdle(page);

  return frame;
}
