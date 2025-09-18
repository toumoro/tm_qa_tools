import { DeepPartial } from './tests/helpers/mergeConfig';
import { 
  defineConfig, 
  ProjectConfig, 
  AppConfig, 
  PlaywrightConfig 
} from './typo3.config';

// THIS CONFIG IS SPECIFIC TO THE PROJECT YOU ARE TESTING
const projectConfig: ProjectConfig = {
  typo3Version: 13,
  typo3OldVersion: 12,
  backendInterface: {
    pageSearch: {
      query: '90',
      expectedResult: ['Page 90'],
    },
    module: {
      label: 'Outils d’administration',
      items: [
        { label: 'Réglages', heading: 'Settings' }
      ],
    },
    lang: 'fr',
  },
};

// THESE OVERRIDES ARE SPECIFIC TO YOUR LOCAL TEST ENVIRONMENT
const playwrightOverrides: DeepPartial<PlaywrightConfig> = {
  createUsersTest: {
    userFields: [
      { id: 'username', value: 'your_username', type: 'input' },
      { id: 'password', value: 'your_password', type: 'input' },
    ],
  },
};

// COMBINE THE TWO CONFIG OBJECTS
export const config: AppConfig = defineConfig(
  projectConfig, 
  playwrightOverrides
);