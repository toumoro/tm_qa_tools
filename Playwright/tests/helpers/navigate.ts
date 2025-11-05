import { expect, FrameLocator, Locator, Page } from '@playwright/test';
import { config } from '../../project.config';
import { waitForSiteIdle } from '../backend/helpers/loading';

const {
  typo3,
  project: { typo3Version, backendInterface },
} = config;

/**
 * Function to navigate to a specific route in the TYPO3 backend
 * @param page
 * @param route
 * @returns
 */
export async function navigateTo({
  page,
  route = '',
}: {
  page: Page;
  route?: string;
}) {
  await page.goto(route);
}

/**
 * Function to navigate to a specific page in the page tree
 * @param page
 * @param uid
 * @param rightClick
 * @returns
 */
export async function navigateToPage({
  page,
  uid = 0,
  rightClick = false,
  version = typo3Version,
  frame,
}: {
  page: Page;
  uid?: number;
  rightClick?: boolean;
  version?: number;
  frame?: FrameLocator;
}) {
  let locator;
  let pageNodeSelector;

  // use frame in case of a modal is opened (eg: add link in RTE)
  if (frame) locator = frame;
  else locator = page;

  await locator
    .locator(typo3.pages.selectors.searchInputSelector)
    .first()
    .fill(`${uid}`);

  await waitForSiteIdle(page);

  if (version >= typo3Version) {
    pageNodeSelector = `.node[data-id="${uid}"]`;
  } else {
    // need to update 0_ in case of multiple domains
    pageNodeSelector = `.node[data-state-id="0_${uid}"]`;
  }

  const item = locator.locator(pageNodeSelector);

  if (!item) {
    throw new Error(`node ${uid} not found`);
  }

  await item.click({ button: rightClick ? 'right' : 'left' });
}

/**
 * Function to navigate to a content element for editing
 * @param page
 * @param uid
 * @returns
 */
export async function navigateToContent({
  page,
  uid,
  version = typo3Version,
}: {
  page: Page;
  uid: number;
  version?: number;
}) {
  await navigateToPage({
    page,
    uid,
    version,
  });

  await waitForSiteIdle(page);
  const frame = page.frameLocator('iframe[name="list_frame"]');

  const elementLabel =
    typo3.contents[backendInterface.lang].elementLabel(
      version, backendInterface.contents.labels
    );

  let element: Locator;

  if (version < 12) {
    element = frame
      .locator(typo3.contents.selectors.elementPreviewSelector(version))
      .getByText(elementLabel, {
        exact: true,
      })
      .first();
  } else {
    element = frame
      .locator(typo3.contents.selectors.elementPreviewSelector(version))
      .getByText(elementLabel, {
        exact: true,
      })
      .first()
      .locator('..')
      .locator(typo3.contents.selectors.elementEditSelector(version))
      .first();
  }

  await expect(
    element,
    `${elementLabel} is not visible on the page with UID ${uid}.`,
  ).toBeVisible();

  await element.click();
  await waitForSiteIdle(page);

  return frame;
}

/**
 * Function to navigate to a specific record in a module in the backend
 * @param page
 * @param uid
 * @param recordSelector
 * @returns
 */
export async function navigateToRecord({
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
  await navigateToPage({
    page,
    uid,
  });

  await waitForSiteIdle(page);
  const frame = page.frameLocator('iframe');

  if (searchTerm) {
    await searchForRecord(page, frame, searchTerm);
  }

  await waitForSiteIdle(page);

  // Sometimes a list of records can be collapsed
  const recordTitle = frame.locator('.recordlist-heading-title a', {
      hasText: new RegExp(`^${moduleName} `),
    });
  if ((await recordTitle.count()) > 0 && (await recordTitle.locator('.icon-actions-view-table-expand').count()) > 0) {
    await recordTitle.click();
  }

  console.log('will look for record ', moduleName);
  const recordListContainer = frame.locator('.recordlist').filter({
    has: frame.locator('.recordlist-heading-title', {
      hasText: new RegExp(`^${moduleName} `),
    }),
  });

  const record = recordListContainer.locator('td.col-title a').first();

  let errorMessage = '';

  if (searchTerm) {
    errorMessage = `The record with the title "${searchTerm}" is not visible in the list of the module "${moduleName}".`;
  } else {
    errorMessage = `No record is visible in the list of the module "${moduleName}".`;
  }

  await expect(record, errorMessage).toBeVisible();

  await record.click();
  await waitForSiteIdle(page);

  return page.frameLocator('iframe');
}

/**
 * Function to search for a record in the list view
 *
 * @param frame
 * @param searchTerm
 */
export async function searchForRecord(
  page: Page,
  frame: FrameLocator,
  searchTerm: string,
) {
  await frame
    .locator(
      typo3.records.selectors.searchRecordSelector(
        typo3.records[backendInterface.lang].viewLabel,
      ),
    )
    .click();

  const dropdownViewOption = frame
    .locator(typo3.records.selectors.dropdownViewSelector)
    .getByText(typo3.records[backendInterface.lang].searchLabel, {
      exact: true,
    });

  if (
    (await dropdownViewOption.getAttribute('data-dropdowntoggle-status')) ===
    'inactive'
  ) {
    await dropdownViewOption.click();
    await waitForSiteIdle(page);
  }

  const searchInput = frame.locator(
    typo3.records.selectors.searchInputSelector,
  );
  await searchInput.fill(searchTerm);
  await searchInput.press('Enter');
}
