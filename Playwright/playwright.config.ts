// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { config as projectConfig } from './project.config';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env'), quiet: true });

const {
  playwright: { authFile },
} = projectConfig;

// Use prepared auth state.
const mode = process.env.TM_PLAYWRIGHT_MODE === 'true';
const domain = process.env.TM_PLAYWRIGHT_DOMAIN;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/',
  outputDir: 'test-results',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
      },
    ],
  ],

  timeout: 50000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://' + domain,

    // screenshot: 'only-on-failure',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Whether to ignore HTTPS errors during navigation. */
    ignoreHTTPSErrors: true,
    headless: mode,
  },

  expect: {
    // Maximum time expect() should wait for the condition to be met.
    timeout: 10000,

    toHaveScreenshot: {
      // An acceptable amount of pixels that could be different, unset by default.
      maxDiffPixels: 10,
    },

    toMatchSnapshot: {
      // An acceptable ratio of pixels that are different to the
      // total amount of pixels, between 0 and 1.
      maxDiffPixelRatio: 0.1,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      testDir: './tests/backend',
    },
    {
      name: 'Tests for TYPO3 Backend',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        storageState: authFile,
      },
      testMatch: /.*\.spec\.ts/,
      dependencies: ['setup'],
      testDir: './tests/backend',
    },
    {
      name: 'Tests for TYPO3 Backend Extended',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        storageState: authFile,
      },
      testMatch: /.*\.spec\.ts/,
      dependencies: ['setup'],
      testDir: './tests/extended/backend',
    },
    {
      name: 'Tests for TYPO3 Frontend',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
      testMatch: /.*\.spec\.ts/,
      testDir: './tests/frontend/',
    },
    {
      name: 'Tests for TYPO3 Frontend Extended',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
      testMatch: /.*\.spec\.ts/,
      testDir: './tests/extended/frontend/',
    },
  ],
});
