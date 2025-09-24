import {
  defineConfig,
  AppConfig,
} from './typo3.config';
import {
    projectConfig,
    playwrightOverrides
} from '../../../../migration/e2e/playwright/project.config';

// COMBINE THE TWO CONFIG OBJECTS
export const config: AppConfig = defineConfig(
  projectConfig,
  playwrightOverrides
);