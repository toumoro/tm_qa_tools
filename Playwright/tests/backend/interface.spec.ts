import { expect, FrameLocator, Locator, test } from '@playwright/test';
import { config } from '../../project.config';
import {
  navigateTo,
  navigateToContent,
  navigateToPage,
  navigateToRecord,
} from '../helpers/navigate';
import {
  createContentElement,
  deleteContentElement,
  updateContentElement,
} from './helpers/content';
import { waitForSiteIdle } from './helpers/loading';
import {
  createElement,
  deleteElement,
  editElement,
  expectValidPageOrFolderUid,
} from './helpers/page';
import { createRecord, deleteRecord, updateRecord } from './helpers/record';
import {
  createLink,
  getButton,
  getRTEHeadings,
  getRTEStyles,
  oldSiteDomain,
} from './helpers/rte';
import { login } from './helpers/login';
import { runFileDeleteTest, runFileUploadTest } from './helpers/filelist';
import { getRTESelector } from './helpers/lang';
import { getEnvVariable } from '../helpers/getEnvVariable';

const username = getEnvVariable('TM_PLAYWRIGHT_BE_LOGIN_USERNAME');
const password = getEnvVariable('TM_PLAYWRIGHT_BE_LOGIN_PASSWORD');

const {
  typo3: { routes, pages, records, contents },
  playwright: {
    createPageTest,
    createContentTest,
    createRecordTest,
    createRTEContentTest,
    tempAuthFile,
    downloadFileTest,
  },
  project: {
    typo3Version,
    typo3OldVersion,
    backendInterface,
    backendInterface: { lang }
  },
  annotations: { groups, locale }
} = config;

test('check page tree integrity when search field is filled', {
    tag: [...groups.backendInterface.searchPage.tags ?? []],
    annotation: [
      {
        type: 'category',
        description: 'Backend',
      },
      ...groups.backendInterface.searchPage.labels[locale]
    ]
  }, async ({ page }) => {
  await navigateTo({ page, route: routes.pages });

  await page
    .getByPlaceholder(pages[lang].searchLabel)
    .fill(backendInterface.pageSearch.query);

  await waitForSiteIdle(page);

  for (const text of backendInterface.pageSearch.expectedResult) {
    await expect(page.getByText(text)).toBeVisible();
  }
});

// ====================================================================
// --- Block 1: Page Management & their Content Elements ---
// ====================================================================
test.describe('manage pages and their content elements', {
  annotation: {
    type: 'category',
    description: 'Backend',
  },
}, () => {
  let pageUid = 0;
  const newPageTitle = createPageTest.newPageTitle;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(routes.pages);
    pageUid = await createElement({ page, type: 'page', title: newPageTitle });

    expectValidPageOrFolderUid(pageUid);
    console.info(`[SETUP] Page ${pageUid} created for testing.`);
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(routes.pages);

    expectValidPageOrFolderUid(pageUid);
    await deleteElement({ page, uid: pageUid });
    console.info(`[TEARDOWN] Page ${pageUid} deleted.`);
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await navigateTo({ page, route: routes.pages });
    await waitForSiteIdle(page);
  });

  test('check new page visibility when created', {
    tag: [...groups.backendInterface.createPage.tags ?? []],
    annotation: [
      ...groups.backendInterface.createPage.labels[locale]
    ]
  }, async ({ page }) => {
    await navigateToPage({ page, uid: pageUid });
    await expect(page.locator(`.node[data-id="${pageUid}"]`)).toBeVisible();
  });

  test('check page properties when edited', {
    tag: [...groups.backendInterface.editPage.tags ?? []],
    annotation: [
      ...groups.backendInterface.editPage.labels[locale]
    ]
  }, async ({ page }) => {
    const title = await editElement({ page, uid: pageUid });
    await expect(page.getByText(title)).toBeVisible();
  });

  // Nested describe for content, as it logically belongs to a page.
  test.describe('manage content elements', () => {
    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(routes.pages);

      await createContentElement({
        page,
        uid: pageUid,
      });
      await context.close();
    });

    test('check new content element fields when created', {
      tag: [...groups.backendInterface.createContentElement.tags ?? []],
      annotation: [
        ...groups.backendInterface.createContentElement.labels[locale]
      ]
    }, async ({ page }) => {
      const frame = await navigateToContent({ page, uid: pageUid });

      await Promise.all(
        createContentTest.fields.map(async ({ id, value }) => {
          await expect(
            frame.locator(contents.selectors.inputSelector(id)),
          ).toHaveValue(value);
        }),
      );
    });

    test('check content element fields when edited', {
      tag: [...groups.backendInterface.editContentElement.tags ?? []],
      annotation: [
        ...groups.backendInterface.editContentElement.labels[locale]
      ]
    }, async ({ page }) => {
      const frame = await updateContentElement({ page, uid: pageUid });

      await Promise.all(
        createContentTest.fields.map(async ({ id, value }) => {
          await expect(
            frame.locator(contents.selectors.inputSelector(id)),
          ).toHaveValue(value);
        }),
      );
    });

    test('check content element visibility when deleted', {
      tag: [...groups.backendInterface.deleteContentElement.tags ?? []],
      annotation: [
        ...groups.backendInterface.deleteContentElement.labels[locale]
      ]
    }, async ({ page }) => {
      const frame = await deleteContentElement({ page, uid: pageUid });
      await expect(
        frame.getByText(createContentTest.fields[0]['value']).first(),
      ).toBeHidden();
    });
  });
});

test('check page visibility when deleted', {
  tag: [...groups.backendInterface.deletePage.tags ?? []],
  annotation: [
    {
      type: 'category',
      description: 'Backend',
    },
    ...groups.backendInterface.deletePage.labels[locale]
  ]
}, async ({ page }) => {
  const titleForDeletion = `Page a supprimer - ${Date.now()}`;

  console.info(`[TEST-SETUP] Creating page to be deleted.`);
  await navigateTo({ page, route: routes.pages });
  const uidToDelete = await createElement({
    page,
    type: 'page',
    title: titleForDeletion,
  });

  await deleteElement({ page, uid: uidToDelete });
  await expect(page.getByText(titleForDeletion)).toBeHidden();
});

// ====================================================================
// --- Block 2: CKEditor integrity verification ---
// --- FOR CKEditor 5 ONLY ---
// ====================================================================
if (typo3OldVersion >= 12) {
  test.describe('check ckeditor buttons integrity', {
    annotation: {
      type: 'category',
      description: 'Backend',
    },
  }, () => {
    const pageUid = parseInt(backendInterface.pageSearch.query);

    let frame: FrameLocator;
    let RTEfield: Locator;
    let RTEButtonsListToCompare: string[];
    let RTEHeadingsListToCompare: string[];
    let RTEStylesListToCompare: string[];

    test.describe('check ckeditor buttons | headings | styles integrity', () => {
      test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        // log in to the old backend
        await login({
          page,
          username: username,
          password: password,
          authFile: tempAuthFile,
          url: oldSiteDomain,
        });

        await page.goto(`${oldSiteDomain}${routes.pages}`);
        await page.waitForLoadState();

        const frame = await navigateToContent({
          page,
          uid: pageUid,
          version: typo3OldVersion,
        });

        // check that RTE is visible
        if (typo3OldVersion < 12) {
          await expect(
            frame
              .frameLocator('iframe')
              .locator(getRTESelector(typo3OldVersion)),
          ).toBeVisible();
        } else {
          await expect(
            frame.locator(getRTESelector(typo3OldVersion)),
          ).toBeVisible();
        }

        // get the list of buttons in the RTE to compare with
        const buttons = frame
          .locator(getRTESelector(typo3OldVersion))
          .locator('..')
          .locator('..')
          .locator('button');

        RTEButtonsListToCompare = (
          await Promise.all(
            (
              await buttons.all()
            ).map(async (button) => {
              return button.getAttribute('data-cke-tooltip-text');
            }),
          )
        ).filter((label): label is string => label !== null);

        RTEHeadingsListToCompare = await getRTEHeadings(frame);
        RTEStylesListToCompare = await getRTEStyles(frame);

        await context.close();
      });

      test.beforeEach(async ({ page }) => {
        await navigateTo({ page, route: routes.pages });
        await waitForSiteIdle(page);

        frame = await navigateToContent({ page, uid: pageUid });
        RTEfield = frame.locator(getRTESelector(typo3Version));
      });

      // check buttons like tables properties, fullscreen mode, source mode, special characters, ...
      test('check ckeditor buttons visibility', {
        tag: [...groups.backendInterface.checkRTEButtons.tags ?? []],
        annotation: [
          ...groups.backendInterface.checkRTEButtons.labels[locale]
        ]
      }, async () => {
        for (const label of RTEButtonsListToCompare) {
          const button = await getButton(frame, label);
          await expect(button).toBeVisible();
        }
      });

      test('check ckeditor headings visibility', {
        tag: [...groups.backendInterface.checkRTEHeadings.tags ?? []],
        annotation: [
          ...groups.backendInterface.checkRTEHeadings.labels[locale]
        ]
      }, async () => {
        const headingTextList = await getRTEHeadings(frame);

        headingTextList.forEach((heading) => {
          expect(
            RTEHeadingsListToCompare,
            `heading "${heading}" is not visible`,
          ).toContain(heading);
        });
      });

      test('check ckeditor styles visibility', {
        tag: [...groups.backendInterface.checkRTEStyles.tags ?? []],
        annotation: [
          ...groups.backendInterface.checkRTEStyles.labels[locale]
        ]
      }, async ({ page }) => {
        const href = await createLink(
          page,
          frame,
          RTEfield,
          pageUid,
          createRTEContentTest.newLinkPageTitle,
        );
        await waitForSiteIdle(page);

        await expect(
          RTEfield.locator(`a[href="${href}"]`, {
            hasText: createRTEContentTest.newLinkPageTitle,
          }),
        ).toBeVisible();

        const styleTextList = await getRTEStyles(frame);

        styleTextList.forEach((style) => {
          expect(
            RTEStylesListToCompare,
            `Style "${style}" is not visible`,
          ).toContain(style);
        });
      });
    });

    test.describe('check headings and links', () => {
      test.beforeEach(async ({ page }) => {
        await navigateTo({ page, route: routes.pages });
        await waitForSiteIdle(page);

        frame = await navigateToContent({ page, uid: pageUid });
        RTEfield = frame.locator(getRTESelector(typo3Version));
      });

      test('check that heading style is visible when applied', {
        tag: [...groups.backendInterface.applyRTEHeading.tags ?? []],
        annotation: [
          ...groups.backendInterface.applyRTEHeading.labels[locale]
        ]
      }, async () => {
        // empty the RTE field
        await RTEfield.selectText();
        await RTEfield.fill('');

        await RTEfield.fill(createRTEContentTest.newHeadingTitle);
        await RTEfield.press('Control+A');

        const headingButton = await getButton(
          frame,
          contents[lang].RTE.headingLabel,
        );
        await headingButton.click();

        const headingTitle = contents[lang].RTE.headingTitle;

        const heading = headingButton
          .locator('..')
          .locator('div')
          .locator('li')
          .locator('span', { hasText: headingTitle });

        await expect(heading).toBeVisible();
        await heading.click();

        await expect(
          RTEfield.locator(`h${headingTitle.slice(-1)}`, {
            hasText: createRTEContentTest.newHeadingTitle,
          }),
        ).toBeVisible();
      });

      test.describe('check links creation', () => {
        test('check page link visibility when created', {
          tag: [...groups.backendInterface.createRTELink.tags ?? []],
          annotation: [
            ...groups.backendInterface.createRTELink.labels[locale]
          ]
        }, async ({ page }) => {
          const href = await createLink(
            page,
            frame,
            RTEfield,
            pageUid,
            createRTEContentTest.newLinkPageTitle,
          );

          await waitForSiteIdle(page);

          await expect(
            RTEfield.locator(`a[href="${href}"]`, {
              hasText: createRTEContentTest.newLinkPageTitle,
            }),
          ).toBeVisible();
        });

        test('check external link visibility when created', {
          tag: [...groups.backendInterface.createRTELink.tags ?? []],
          annotation: [
            ...groups.backendInterface.createRTELink.labels[locale]
          ]
        }, async ({
          page,
        }) => {
          const href = await createLink(
            page,
            frame,
            RTEfield,
            pageUid,
            createRTEContentTest.newLinkExternalTitle,
            'external',
          );

          await waitForSiteIdle(page);

          await expect(
            RTEfield.locator(`a[href="${href}"]`, {
              hasText: createRTEContentTest.newLinkExternalTitle,
            }),
          ).toBeVisible();
        });

        test('check email link visibility when created', {
          tag: [...groups.backendInterface.createRTELink.tags ?? []],
          annotation: [
            ...groups.backendInterface.createRTELink.labels[locale]
          ]
        }, async ({ page }) => {
          const href = await createLink(
            page,
            frame,
            RTEfield,
            pageUid,
            createRTEContentTest.newLinkEmailTitle,
            'email',
          );

          await waitForSiteIdle(page);

          await expect(
            RTEfield.locator(`a[href="${href}"]`, {
              hasText: createRTEContentTest.newLinkEmailTitle,
            }),
          ).toBeVisible();
        });
      });
    });

    test.describe('upload an image that is uploaded in filelist', () => {
      test.describe('[setup] upload a reference file', () => {
        runFileUploadTest();
      });

      test('check image upload', {
        tag: [...groups.backendInterface.verifyRTEImageUpload.tags ?? []],
        annotation: [
          ...groups.backendInterface.verifyRTEImageUpload.labels[locale]
        ]
      }, async ({ page }) => {
        await navigateTo({ page, route: routes.pages });
        await waitForSiteIdle(page);

        const frame = await navigateToContent({ page, uid: pageUid });
        const uploadButton = await getButton(
          frame,
          contents[lang].RTE.imageUploadLabel,
        );

        await expect(
          uploadButton,
          'Image upload button not found',
        ).toBeVisible();

        await uploadButton.click();

        const fileModalFrame = page.frameLocator(
          contents.selectors.RTE.frameSelector,
        );

        await fileModalFrame.locator('.node').first().click();

        const fileName = fileModalFrame
          .getByText(downloadFileTest.sourceFileName, { exact: true })
          .first();

        await expect(fileName).toBeVisible();

        await fileName.locator('..').click();
        await page
          .locator('typo3-backend-modal')
          .locator('button', {
            hasText: 'Ok',
          })
          .click();

        const RTEfield = frame.locator(getRTESelector(typo3Version));

        await expect(
          RTEfield.locator(`img[src*="${downloadFileTest.sourceFileName}"]`),
        ).toBeVisible();
      });

      test.describe('[teardown] delete the uploaded file', () => {
        runFileDeleteTest();
      });
    });
  });
}

// ====================================================================
// --- Block 3: Folder Management & their Records ---
// ====================================================================
test.describe('manage folders and records', {
  annotation: {
    type: 'category',
    description: 'Backend',
  },
}, () => {
  let folderUid = 0;
  const newFolderTitle = createPageTest.newFolderTitle;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(routes.pages);
    folderUid = await createElement({
      page,
      type: 'folder',
      title: newFolderTitle,
    });

    expectValidPageOrFolderUid(folderUid);
    console.info(`[SETUP] Folder ${folderUid} created for testing.`);
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(routes.pages);

    expectValidPageOrFolderUid(folderUid);
    await deleteElement({ page, uid: folderUid });
    console.info(`[TEARDOWN] Folder ${folderUid} deleted.`);
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await navigateTo({ page, route: routes.pages });
    await waitForSiteIdle(page);
  });

  test('check folder visibility when created', {
    tag: [...groups.backendInterface.createPage.tags ?? []],
    annotation: [
      ...groups.backendInterface.createPage.labels[locale]
    ]
  }, async ({ page }) => {
    await navigateToPage({ page, uid: folderUid });

    await expect(page.locator(`.node[data-id="${folderUid}"]`)).toBeVisible();
  });

  test('check folder properties when edited', {
    tag: [...groups.backendInterface.editPage.tags ?? []],
    annotation: [
      ...groups.backendInterface.editPage.labels[locale]
    ]
  }, async ({ page }) => {
    const title = await editElement({ page, uid: folderUid });
    await expect(page.getByText(title)).toBeVisible();
  });

  // Nested describe for records, as they logically belong to a folder.
  test.describe('manage records inside the created folder', () => {
    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(routes.list);

      console.info(`[SETUP] Records added to ${folderUid} folder.`);
      await createRecord({
        page,
        uid: folderUid,
        moduleName: records[lang].moduleNameLabel,
        moduleFields: createRecordTest.fields,
      });

      await context.close();
    });

    test.beforeEach(async ({ page }) => {
      await navigateTo({ page, route: routes.list });
      await waitForSiteIdle(page);
    });

    test('check record visibility when created', {
      tag: [...groups.backendInterface.createRecord.tags ?? []],
      annotation: [
        ...groups.backendInterface.createRecord.labels[locale]
      ]
    }, async ({ page }) => {
      const frame = await navigateToRecord({
        page,
        uid: folderUid,
        moduleName: records[lang].moduleNameLabel,
      });

      await Promise.all(
        createRecordTest.fields.map(async ({ id, value }) => {
          await expect(
            frame.locator(records.selectors.inputSelector(id)),
          ).toHaveValue(value);
        }),
      );
    });

    test('check record properties when edited', {
      tag: [...groups.backendInterface.editRecord.tags ?? []],
      annotation: [
        ...groups.backendInterface.editRecord.labels[locale]
      ]
    }, async ({ page }) => {
      const frame = await updateRecord({
        page,
        uid: folderUid,
        moduleName: records[lang].moduleNameLabel,
        moduleFields: createRecordTest.fields,
      });

      await Promise.all(
        createRecordTest.fields.map(async ({ id, value }) => {
          await expect(
            frame.locator(records.selectors.inputSelector(id)),
          ).toHaveValue(value);
        }),
      );
    });

    test('check record visibility when deleted', {
      tag: [...groups.backendInterface.deleteRecord.tags ?? []],
      annotation: [
        ...groups.backendInterface.deleteRecord.labels[locale]
      ]
    }, async ({ page }) => {
      const frame = await deleteRecord({
        page,
        uid: folderUid,
        moduleName: records[lang].moduleNameLabel,
      });

      await expect(
        frame.getByText(createRecordTest.fields[0]['value']).first(),
      ).toBeHidden();
    });
  });
});

test('check folder visibility when deleted', {
  tag: [...groups.backendInterface.deletePage.tags ?? []],
  annotation: [
    ...groups.backendInterface.deletePage.labels[locale]
  ]
}, async ({ page }) => {
  const titleForDeletion = `Dossier a supprimer - ${Date.now()}`;

  console.info(`[TEST-SETUP] Creating folder to be deleted.`);
  await navigateTo({ page, route: routes.pages });
  const uidToDelete = await createElement({
    page,
    type: 'folder',
    title: titleForDeletion,
  });

  await deleteElement({ page, uid: uidToDelete });
  await expect(page.getByText(titleForDeletion)).toBeHidden();
});

// ====================================================================
// --- Block 4: Link Management ---
// ====================================================================
test.describe('manage page of type link', {
  annotation: {
    type: 'category',
    description: 'Backend',
  },
}, () => {
  let linkUid = 0;
  const newLinkTitle = createPageTest.newLinkTitle;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(routes.pages);
    linkUid = await createElement({ page, type: 'link', title: newLinkTitle });
    console.info(`[SETUP] Link ${linkUid} created for testing.`);
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(routes.pages);
    await deleteElement({ page, uid: linkUid });
    console.info(`[TEARDOWN] Link ${linkUid} deleted.`);
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await navigateTo({ page, route: routes.pages });
    await waitForSiteIdle(page);
  });

  test('check link page visibility when created', {
    tag: [...groups.backendInterface.createPage.tags ?? []],
    annotation: [
      ...groups.backendInterface.createPage.labels[locale]
    ]
  }, async ({ page }) => {
    await navigateToPage({ page, uid: linkUid });
    await expect(page.locator(`.node[data-id="${linkUid}"]`)).toBeVisible();
  });

  test('check link page properties when edited', {
    tag: [...groups.backendInterface.editPage.tags ?? []],
    annotation: [
      ...groups.backendInterface.editPage.labels[locale]
    ]
  }, async ({ page }) => {
    const title = await editElement({ page, uid: linkUid });
    await expect(page.getByText(title)).toBeVisible();
  });
});

test('check link page visibility when deleted', {
  tag: [...groups.backendInterface.deletePage.tags ?? []],
  annotation: [
    ...groups.backendInterface.deletePage.labels[locale]
  ]
}, async ({ page }) => {
  const titleForDeletion = `Lien a supprimer - ${Date.now()}`;

  console.info(`[TEST-SETUP] Creating link to be deleted.`);
  await navigateTo({ page, route: routes.pages });
  const uidToDelete = await createElement({
    page,
    type: 'link',
    title: titleForDeletion,
  });

  await deleteElement({ page, uid: uidToDelete });
  await expect(page.getByText(titleForDeletion)).toBeHidden();
});

// ====================================================================
// --- Block 5: Shortcut Management ---
// ====================================================================
test.describe('manage page of type shortcut', {
  annotation: {
    type: 'category',
    description: 'Backend',
  },
}, () => {
  let shortcutUid = 0;
  const newShortcutTitle = createPageTest.newShortcutTitle;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(routes.pages);
    shortcutUid = await createElement({
      page,
      type: 'shortcut',
      title: newShortcutTitle,
    });
    console.info(`[SETUP] Shortcut ${shortcutUid} created for testing.`);
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(routes.pages);
    await deleteElement({ page, uid: shortcutUid });
    console.info(`[TEARDOWN] Shortcut ${shortcutUid} deleted.`);
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await navigateTo({ page, route: routes.pages });
    await waitForSiteIdle(page);
  });

  test('check shortcut page visibility when created', {
    tag: [...groups.backendInterface.createPage.tags ?? []],
    annotation: [
      ...groups.backendInterface.createPage.labels[locale]
    ]
  }, async ({ page }) => {
    await navigateToPage({ page, uid: shortcutUid });
    await expect(page.locator(`.node[data-id="${shortcutUid}"]`)).toBeVisible();
  });

  test('check shortcut page properties when edited', {
    tag: [...groups.backendInterface.editPage.tags ?? []],
    annotation: [
      ...groups.backendInterface.editPage.labels[locale]
    ]
  }, async ({ page }) => {
    const title = await editElement({ page, uid: shortcutUid });
    await expect(page.getByText(title)).toBeVisible();
  });
});

test('check shortcut page visibility when deleted', {
  tag: [...groups.backendInterface.deletePage.tags ?? []],
  annotation: [
    ...groups.backendInterface.deletePage.labels[locale]
  ]
}, async ({ page }) => {
  const titleForDeletion = `Raccourci a supprimer - ${Date.now()}`;

  console.info(`[TEST-SETUP] Creating shortcut to be deleted.`);
  await navigateTo({ page, route: routes.pages });
  const uidToDelete = await createElement({
    page,
    type: 'shortcut',
    title: titleForDeletion,
  });

  await deleteElement({ page, uid: uidToDelete });
  await expect(page.getByText(titleForDeletion)).toBeHidden();
});
