import test, { expect, FrameLocator, Locator, Page } from '@playwright/test';
import fs from 'fs';
import { config } from '../../../project.config';
import { waitForSiteIdle } from './loading';
import { getNotification, notify } from './error';
import { navigateTo, searchForFile } from '../../helpers/navigate';

const {
  playwright: { downloadFileTest },
  typo3: { files, routes },
  project: {
    backendInterface: { lang, files: { usingS3Bucket } },
  },
  annotations: {
    groups: { filelist },
    locale
  },
} = config;
/**
 * Uploads a file to the backend TYPO3 filelist module.
 *
 * @param params - The parameters for the upload operation.
 * @param params.path - The relative path to the directory containing the file to upload.
 * @param params.frame - The Playwright FrameLocator pointing to the iframe containing the dropzone.
 *
 */
export async function upload({
  path,
  frame,
}: {
  path: string;
  frame: FrameLocator;
}) {
  const filePath = `${process.cwd()}${path}${downloadFileTest.sourceFileName}`;
  const buffer = fs.readFileSync(filePath);
  const fileName = downloadFileTest.sourceFileName;

  const dropzone = frame.locator(files.selectors.dopzone);
  const dropzoneMask = frame.locator(files.selectors.dropzoneMask);

  const dataTransfer = await dropzone.evaluateHandle(
    async (_, { bufferData, fileName, fileType }) => {
      const dt = new DataTransfer();

      const uint8Array = new Uint8Array(bufferData);
      const file = new File([uint8Array], fileName, { type: fileType });

      dt.items.add(file);
      return dt;
    },
    {
      bufferData: Array.from(buffer),
      fileName,
      fileType: 'application/pdf',
    },
  );

  await dropzone.dispatchEvent('dragenter', { dataTransfer });
  await dropzoneMask.dispatchEvent('dragenter', { dataTransfer });
  await dropzoneMask.dispatchEvent('drop', { dataTransfer });
  await dropzone.waitFor({ state: 'hidden', timeout: 10000 });
}

export async function download({ page }: { page: Page }) {

  if(usingS3Bucket) {
    await page.getByRole('menuitem', { name: files[lang].downloadLabel }).click();
    return true;
  } else {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('menuitem', { name: files[lang].downloadLabel }).click(),
    ]);

    // Save the download
    const downloadPath = `${process.cwd()}${downloadFileTest.destFilePath}${
      downloadFileTest.destFileName
    }`;
    if (fs.existsSync(downloadPath)) {
      fs.unlinkSync(downloadPath);
    }
    try {
      await download.saveAs(downloadPath);
      console.log(`File downloaded to: ${downloadPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to save file to: ${downloadPath}`, error);
      return false;
    }
  }
}

// Function to edit file metadata
export async function editMetadata({ page }: { page: Page }) {
  const frame = page.frameLocator('iframe');
  const field = frame
    .locator(files.selectors.editInput)
    .nth(1)
    .locator('input')
    .first();

  await field.fill(downloadFileTest.sourceFileName);

  await frame.getByRole('button', { name: files[lang].saveLabel }).click();

  await waitForSiteIdle(page);
}

/**
 * Checks if a file with the given name exists in the frame.
 * Throws an error if the file is not found or not visible.
 *
 * @param {FrameLocator} frameLocator
 * @param {string} fileName
 */
export async function assertFileExists(
  frameLocator: FrameLocator,
  fileName: string
): Promise<Locator> {
  const button = frameLocator.getByRole('button', { name: fileName });
  const isVisible = await button.isVisible();

  if (!isVisible) {
    throw new Error(`File "${fileName}" doesn't exist or is not visible.`);
  }

  return button;
}

// run file upload test
export const runFileUploadTest = () => {
  test("check new file visibility after upload", {
      tag: [...filelist.fileUpload.tags ?? []],
      annotation: [
        ...filelist.fileUpload.labels[locale]
      ]
    }, async ({ page }) => {

    await navigateTo({ page, route: routes.fileList });
    await waitForSiteIdle(page);

    const frame = page.frameLocator('iframe');

    await searchForFile(frame, downloadFileTest.sourceFileName);
    await waitForSiteIdle(page);

    await expect(
      frame.locator(`button[title="${downloadFileTest.sourceFileName}"]`),
      `File ${downloadFileTest.sourceFileName} already exists.`
    ).toBeHidden();

    await upload({ path: downloadFileTest.sourceFilePath, frame });

    await notify(page, 'popup');

    const notification = await getNotification(page, 'popup');
    await expect(
      frame.locator('h1')
           .getByText(downloadFileTest.sourceFileName),
      notification.message
    ).toBeVisible();
  });
}

// run file download test
export const runFileDownloadTest = () => {
  test("download an existing file", {
      tag: [...filelist.fileDownload.tags ?? []],
      annotation: [
        ...filelist.fileDownload.labels[locale]
      ]
    }, async ({ page }) => {

    await navigateTo({ page, route: routes.fileList });
    await waitForSiteIdle(page);

    const frame = page.frameLocator('iframe');

    await searchForFile(frame, downloadFileTest.sourceFileName);
    await waitForSiteIdle(page);

    const fileButton = await assertFileExists(frame, downloadFileTest.sourceFileName);
    await fileButton.click({ button: 'right' });

    const downloadSuccess = await download({ page });
    expect(downloadSuccess).toBeTruthy();
  });
}

// run file edit metadata test
export const runFileEditMetadataTest = () => {
  test("check file metadata when edited", {
      tag: [...filelist.fileEditMeatadata.tags ?? []],
      annotation: [
        ...filelist.fileEditMeatadata.labels[locale]
      ]
    }, async ({ page }) => {

    await navigateTo({ page, route: routes.fileList });
    await waitForSiteIdle(page);

    // Wait for iframe and dropzone
    const frame = page.frameLocator('iframe');

    await searchForFile(frame, downloadFileTest.sourceFileName);
    await waitForSiteIdle(page);

    const fileButton = await assertFileExists(frame, downloadFileTest.sourceFileName);
    await fileButton.click();

    await editMetadata({ page });

    await notify(page, 'popup');

    const notification = await getNotification(page, 'popup');
    await expect(
      page.getByText(downloadFileTest.sourceFileName),
      notification.message
    ).toBeVisible();
  });
}

// run file delete test
export const runFileDeleteTest = () => {
  test("check file visibility when deleted", {
      tag: [...filelist.fileDelete.tags ?? []],
      annotation: [
        ...filelist.fileDelete.labels[locale]
      ]
    }, async ({ page }) => {

    await navigateTo({ page, route: routes.fileList });
    await waitForSiteIdle(page);

    const frame = page.frameLocator('iframe');

    await searchForFile(frame, downloadFileTest.sourceFileName);
    await waitForSiteIdle(page);

    const fileButton = await assertFileExists(frame, downloadFileTest.sourceFileName);
    await fileButton.click({ button: 'right' });

    await page
      .getByRole('menuitem', {
        name: files[lang].deleteLabel,
      })
      .click();
    await page.getByRole('button', { name: files[lang].deleteLabel }).click();

    await notify(page, 'alert', frame);

    const notification = await getNotification(page, 'alert', frame);
    await expect(page.getByText(
      downloadFileTest.sourceFileName),
      notification.message
    ).toBeHidden();
  });
}