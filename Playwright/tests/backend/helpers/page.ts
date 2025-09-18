import { expect, Page } from '@playwright/test';
import { navigateToPage } from '../../helpers/navigate';
import { config } from '../../../project.config';
import { waitForSiteIdle } from './loading';
import { getNotification } from './error';

const {
  typo3,
  project: {
    backendInterface: { lang },
  },
} = config;
/**
 * This fonction get the list of pages, wait for the page with 'NEW' to disapear
 * then get the list again and look for the new ID.
 * @param page
 * @param timeout
 * @returns
 */
const waitForNewNodeReplacementId = async (
  page: Page,
  timeout = 5000,
): Promise<string> => {
  const nodeSelector = '.nodes-list .node';
  const beforeIds = await page
    .locator(nodeSelector)
    .evaluateAll((els) =>
      els
        .map((el) => el.getAttribute('data-id'))
        .filter((v): v is string => !!v),
    );

  const newNode = page.locator(`${nodeSelector}[data-id*="NEW" i]`);
  const notification = await getNotification(page, 'popup');
  await expect(newNode, notification.message).toHaveCount(1, { timeout });
  await expect(newNode, notification.message).toHaveCount(0, { timeout });

  const afterIds = await page
    .locator(nodeSelector)
    .evaluateAll((els) =>
      els
        .map((el) => el.getAttribute('data-id'))
        .filter((v): v is string => !!v),
    );

  const beforeSet = new Set(beforeIds);
  const added = afterIds.filter((id) => !beforeSet.has(id));

  if (added.length !== 1) {
    throw new Error(
      `Expected exactly one new node id, got ${added.length}: ${JSON.stringify(
        added,
      )}`,
    );
  }
  return added[0];
};

const getElementIndex = (type: 'page' | 'folder' | 'link' | 'shortcut') => {
  switch (type) {
    case 'page':
      return 0;
    case 'folder':
      return 5;
    case 'link':
      return 4;
    case 'shortcut':
      return 2;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
};

// Function to create a new record (page, folder, link, shortcut)
export async function createElement({
  page,
  type,
  title,
}: {
  page: Page;
  type: 'page' | 'folder' | 'link' | 'shortcut';
  title: string;
}) {
  const index = getElementIndex(type);
  const draggablePage = page.locator(typo3.pages.selectors.draggableNodeSelector).nth(index);
  const dropTarget = page.locator(typo3.pages.selectors.dropTargetSelector).nth(1);
  await draggablePage.dragTo(dropTarget);

  await page.keyboard.type(title);
  await page.keyboard.press('Enter');

  const uid = await waitForNewNodeReplacementId(page);

  return +uid;
}

// Function to edit a record (page, folder, link, shortcut)
export async function editElement({ page, uid }: { page: Page; uid: number }) {
  await navigateToPage({ page, uid });

  console.log('will look for ', `.node[data-id="${uid}"]`);
  await page.locator('.nodes-list').waitFor({ state: 'visible' });

  const title = await page
    .locator(`.node[data-id="${uid}"]`)
    .getAttribute('title')
    .then((name) => name?.split(' - ')[1]);

  console.log('will edit ', title);
  if (!title) {
    throw new Error(`Page with uid [${uid}] not found`);
  }

  const frame = page.frameLocator('iframe');
  const editPageButton = frame.locator(typo3.pages.selectors.editPageSelector);

  if (!editPageButton.isVisible()) {
    throw new Error(
      `The ${typo3.pages.selectors.editPageSelector} Selector is not found.`,
    );
  }

  await editPageButton.click();
  await page.keyboard.type('');
  await page.keyboard.press('Enter');

  return title;
}

// Function to delete a record (page, folder, link, shortcut)
export async function deleteElement({
  page,
  uid,
}: {
  page: Page;
  uid: number;
}) {
  await navigateToPage({ page, uid, rightClick: true });

  /** @todo: change static value */
  await page
    .getByRole('menuitem', { name: typo3.pages[lang].deleteLabel })
    .click();

  const confirmButton = page.locator(
    typo3.pages.selectors.confirmDeleteSelector,
  );

  await expect(
    confirmButton,
    `The ${typo3.pages.selectors.confirmDeleteSelector} Selector should be visible.`,
  ).toBeVisible();

  await confirmButton.dblclick();
  await confirmButton.waitFor({ state: 'detached' });

  await waitForSiteIdle(page);
}

/**
 * Checks that a page UID is valid (> 0) and fails the test with a message if not.
 * @param pageUid
 */
export function expectValidPageOrFolderUid(pageUid: number) {
  if (pageUid <= 0) {
    expect(
      pageUid,
      `Expected a valid page UID, but received: ${pageUid}`,
    ).toBeGreaterThan(0);
  }
}
