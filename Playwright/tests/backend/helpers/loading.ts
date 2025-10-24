import { Frame, Locator, Page } from '@playwright/test';

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

  // Wait for one of the promise of an array to settle + a timeout in case we dont have redirection.
  const withTimeout = <T>(promisesList: Promise<T>[], ms: number): Promise<T[]> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );

  return Promise.race([Promise.all(promisesList), timeout]);
};
  // Wait for navigation or DOM stability before scanning
  try {
    await withTimeout([
      page.waitForLoadState('domcontentloaded'),
      page.waitForLoadState('load'),
    ], 2000);
  } catch {
    //
  }

  try {
    await page.locator('.scaffold-content-module').waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    //
  }

  const loadersToWaitFor: { locator: Locator; type: string }[] = [];

  const collectLocators = async (frame: Page | Frame, framePrefix = '') => {
    for (const { type, selector } of LOADER_SELECTORS) {
      try {
        const locators = await frame.locator(selector).all();
        locators.forEach((locator) => loadersToWaitFor.push({ locator, type: `${framePrefix}${type}` }));
      } catch (err) {
        if (!String(err).includes('Execution context was destroyed')) {
          throw err;
        };
      }
    }
  };

  // Collect from main page
  await collectLocators(page);

  // Collect from iframes
  for (const frame of page.frames()) {
    await collectLocators(frame, 'IFrame ');
  }

  if (loadersToWaitFor.length === 0) {
    console.log('  ✅ No active loading indicators found. Site is idle.');
    return;
  }

  console.log(`  ⏳ Found ${loadersToWaitFor.length} active loader(s). Waiting...`);

  // Wait for them to disappear, ignoring destroyed contexts mid-flight
  await Promise.all(
    loadersToWaitFor.map(async ({ locator, type }, index) => {
      try {
        await locator.waitFor({ state: 'hidden', timeout: 15000 });
        console.log(`    ✅ ${type} #${index + 1} is now hidden.`);
      } catch (err) {
        if (String(err).includes('Execution context was destroyed')) {
          console.log(`    ⚠️ ${type} #${index + 1} destroyed due to navigation, skipping.`);
        } else {
          throw err;
        }
      }
    }),
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
