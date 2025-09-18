import { Locator, Page } from '@playwright/test';

/**
 *  FulFill the promise when div with '.scaffold-content-module' is visible and '.icon-spin', '.nprogress-busy'
 *  and '.ui-block' are hidden.
 *  Not sure yet but these classes seem to be on each TYPO3 pages?
 * @param {Page} page
 */

export const waitForSiteIdle = async (page: Page) => {
  const LOADER_SELECTORS = [
    { type: 'Icon Spinner', selector: '.icon-spin' },
    { type: 'Icon Spinner Circle', selector: '.icon-spin-circle' },
    { type: 'Node Loading', selector: '.node-loading' },
    { type: 'Busy indicator', selector: '.nprogress-busy' },
    { type: 'Overlay', selector: '.ui-block' },
  ];

  await page.locator('.scaffold-content-module').waitFor({ state: 'visible' });

  const loadersToWaitFor: { locator: Locator; type: string }[] = [];

  // Search for all loading indicators in the main page
  for (const { type, selector } of LOADER_SELECTORS) {
    const locators = await page.locator(selector).all();
    locators.forEach((locator) => loadersToWaitFor.push({ locator, type }));
  }

  // Search for loading indicators within iframes
  for (const frame of page.frames()) {
    for (const { type, selector } of LOADER_SELECTORS) {
      const iframeLocators = await frame.locator(selector).all();
      iframeLocators.forEach((locator) =>
        loadersToWaitFor.push({ locator, type: `IFrame ${type}` }),
      );
    }
  }

  if (loadersToWaitFor.length === 0) {
    console.log('  ✅ No active loading indicators found. Site is idle.');
    return;
  }

  console.log(
    `  ⏳ Found ${loadersToWaitFor.length} active loading indicator(s). Waiting for them to disappear...`,
  );

  await Promise.all(
    loadersToWaitFor.map(({ locator, type }, index) =>
      locator.waitFor({ state: 'hidden' }).then(() => {
        console.log(`    ✅ ${type} #${index + 1} is now hidden.`);
        return true;
      }),
    ),
  );

  console.log('  ✨ All loading indicators are hidden. Site is now idle.');
};
/**
 * will clear TYPO3 caches
 * example usage: await clearTYPO3Cache(page, {flushFrontendCaches: true});
 * @param page
 * @param param1 @type {{flushFrontendCaches?: boolean; flushAllCaches?: boolean}}
 */
export const clearTYPO3Cache = async (
  page: Page,
  {
    flushFrontendCaches = false,
    flushAllCaches = false,
  }: { flushFrontendCaches?: boolean; flushAllCaches?: boolean },
) => {
  const clearCachesModal = page.locator(
    '#typo3-cms-backend-backend-toolbaritems-clearcachetoolbaritem',
  );

  const modalButton = clearCachesModal.locator('button');
  await modalButton.click();

  const clearCacheButtons = await page
    .locator('.dropdown-item.t3js-toolbar-cache-flush-action')
    .all();

  const [frontendCaches, allCaches] = clearCacheButtons;

  if (flushFrontendCaches) {
    await frontendCaches.click();
    await clearCachesModal
      .locator('.icon-spinner-circle')
      .waitFor({ state: 'hidden' });
    console.log('  🧨 Frontend caches flushed.');
  }

  if (flushAllCaches) {
    await allCaches.click();
    await clearCachesModal
      .locator('.icon-spinner-circle')
      .waitFor({ state: 'hidden' });
    console.log('  🧨 All caches flushed.');
  }
};
