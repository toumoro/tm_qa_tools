import { test, expect } from '@playwright/test';
import { navigateTo } from '../helpers/navigate';
import { config } from '../../project.config';
import { waitForSiteIdle } from './helpers/loading';
import { confirmWithAdminPassword } from './helpers/user-management';

const {
  typo3: { routes, modules },
  project: { backendInterface },
} = config;

test("check visibility of the backend modules", async ({ page }) => {
  await navigateTo({ page, route: routes.pages });

  const extensionModuleMenu = page
    .locator(modules.selectors.moduleMenuGroup)
    .filter({
      has: page.locator(`button ${modules.selectors.moduleMenuName}`, {
        hasText: backendInterface.module.label,
      }),
    });
  for (const { label, heading } of backendInterface.module.items) {
    const module = extensionModuleMenu
      .locator(modules.selectors.moduleMenuName)
      .getByText(label);

    await expect.soft(module).toBeVisible();

    await module.click();

    await waitForSiteIdle(page);

    await confirmWithAdminPassword(page);

    await waitForSiteIdle(page);

    const frame = page.frameLocator('iframe');
    await expect(
      frame.locator('h1 ').getByText(heading ?? label, { exact: true }),
    ).toBeVisible();
  }
});
