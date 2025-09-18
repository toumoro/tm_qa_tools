import { 
  expect, 
  FrameLocator, 
  Locator, 
  Page, 
} from '@playwright/test';
import { 
   navigateToPage 
} from '../../helpers/navigate';
import { config } from '../../../project.config';
import { getEnvVariable } from '../../helpers/getEnvVariable';

const {
  typo3: { contents },
  project: {
    backendInterface: { lang },
  }
} = config;
export const oldSiteDomain = `https://${getEnvVariable('TM_PLAYWRIGHT_OLD_DOMAIN')}`;

// get button in the RTE toolbar
export const getButton = async (
  frame: FrameLocator,
  buttonLabel: string
) => {

  const button = frame.locator(
    contents.selectors.RTE.ButtonSelector(buttonLabel)
  ).first();

  await expect(button,
    `${buttonLabel} button not found`
  ).toBeVisible();

  return button;
};

// get headings in the RTE toolbar
export const getRTEHeadings = async (
  frame: FrameLocator,
) => {

  const headingButton = await getButton(frame, contents[lang].RTE.headingLabel);
  await headingButton.click();

  const headings = headingButton
    .locator('..')
    .locator('div')
    .locator('ul')
    .locator('li');

  const headingTextList = await Promise.all(
    (await headings.all()).map(async (heading) => {
      return heading
        .locator('button')
        .locator('span')
        .last()
        .innerText();
    })
  );

  return headingTextList;
}

// get styles in the RTE toolbar
export const getRTEStyles = async (
  frame: FrameLocator,
) => {

  const styleButton = frame.locator(
    contents.selectors.RTE.styleSelector
  ).locator('button');

  await expect(styleButton, "Style button not found").toBeVisible();
  await expect(styleButton, "Style button not enabled").toBeEnabled();

  await styleButton.click();

  const styles = styleButton
    .locator('..')
    .locator('div')
    .locator('button');
  
  const styleTextList = await Promise.all(
    (await styles.all()).map(async (style) => {
      return style
        .locator('span')
        .last()
        .innerText();
    })
  );
    return styleTextList;
}

// fill field in the frame modal
const fillField = async (
  frame: FrameLocator,
  fieldLabel: string,
  fieldName: string,
  value: string
) => {

  await frame.locator('a', { 
    hasText: fieldLabel 
  }).click();

  const field = value;

  await frame.locator(`[name="${fieldName}"]`).fill(field);
  await frame.locator('[type="submit"]').click();
  
  return field;
}

// create a link in the RTE
export const createLink = async (
  page: Page,
  frame: FrameLocator,
  RTEfield: Locator,
  uid: number,
  linkTitle: string,
  type: 'page' | 'external' | 'email' = 'page'
) => {

  await getButton(frame, contents[lang].RTE.linkLabel);

  // empty the RTE field
  await RTEfield.selectText();
  await RTEfield.fill('');

  await RTEfield.fill(linkTitle);
  await RTEfield.press('Control+A');
  await RTEfield.press('Control+K');

  const linkModalFrame = page.frameLocator(
    contents.selectors.RTE.frameSelector
  );

  let pageLink;

  switch(type) {
    case 'external':
      return await fillField(
        linkModalFrame, 
        contents[lang].RTE.externalLinkLabel,
        'lurl',
        'https://typo3.org'
      );
    case 'email':
      return 'mailto:' + await fillField(
        linkModalFrame, 
        contents[lang].RTE.emailLinkLabel,
        'lemail',
        'user@typo3.com'
      );
    default:
      await navigateToPage({ page, uid, frame: linkModalFrame });

      pageLink = linkModalFrame.locator('.element-browser-body a').first();
      await pageLink.click();

      return pageLink.getAttribute('href');
  }
};