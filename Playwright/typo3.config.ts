//
// --- SECTION 1: DEFAULTS AND STATIC CONFIGS ---
//

import path from 'path';
import { DeepPartial, merge } from './tests/helpers/mergeConfig';
import {
  getContentElementLabel,
  getContentElementPreviewSelector,
  getElementEditSelector,
  getRTESelector,
} from './tests/backend/helpers/lang';

// This is the base config for TYPO3. It should not be changed.
const baseTypo3Config = {
  login: {
    usernameLabel: 'Username',
    passwordLabel: 'Password',
  },
  routes: {
    home: '/typo3',
    pages: '/typo3/module/web/layout',
    list: '/typo3/module/web/list',
    fileList: '/typo3/module/file/list',
    userManagement: '/typo3/module/system/user-management',
  },
  backendUser: {
    selector: {},
    fr: {
      accessTab: 'Accès',
    },
    en: {
      accessTab: 'Access',
    },
  },
  files: {
    selectors: {
      dopzone: '.dropzone',
      dropzoneMask: '.dropzone-mask',
      editInput: '.t3js-formengine-palette-field',
      searchInputSelector: '.filelist-main input[type="search"]',
    },
    fr: {
      deleteLabel: 'Supprimer',
      saveLabel: 'Enregistrer',
      downloadLabel: 'Télécharger',
    },
    en: {
      deleteLabel: 'Delete',
      saveLabel: 'Save',
      downloadLabel: 'Download',
    },
  },
  pages: {
    selectors: {
      searchInputSelector: '.search-input',
      confirmDeleteSelector: 'button[name="delete"]',
      draggableNodeSelector: 'div.tree-toolbar__drag-node',
      dropTargetSelector: 'div.node-content',
      editPageSelector: '[data-action="edit"]'
    },
    fr: {
      searchLabel: 'Entrez le terme à rechercher',
      deleteLabel: 'Supprimer',
    },
    en: {
      searchLabel: 'Enter search term',
      deleteLabel: 'Delete',
    },
  },
  contents: {
    selectors: {
      RTE: {
        selector: (version: number) => getRTESelector(version),
        styleSelector: '.ck-style-dropdown',
        frameSelector: '[name="modal_frame"]',
        ButtonSelector: (id: string) => `button[data-cke-tooltip-text="${id}"]`,
      },
      wizardSelector: '.elementwizard-categories',
      elementPreviewSelector: (version: number) =>
        getContentElementPreviewSelector(version),
      deleteRecordSelector: '.t3js-editform-delete-record',
      elementEditSelector: (version: number) => getElementEditSelector(version),
      inputSelector: (id: string) => `[data-formengine-input-name*="[${id}]"]`,
      confirmDeleteSelector: 'button[name="yes"]',
    },
    fr: {
      createContentLabel: 'Créer un nouveau contenu',
      elementLabel: (version: number, labels: { [version: number]: string; } ) => getContentElementLabel(version, labels),
      RTE: {
        headingTitle: 'Titre 2',
        headingLabel: 'En-tête',
        linkLabel: 'Lien (Ctrl+K)',
        externalLinkLabel: 'URL externe',
        emailLinkLabel: 'Email',
        imageUploadLabel: 'Insert image',
      },
    },
    en: {
      createContentLabel: 'Create new content',
      elementLabel: (version: number, labels: { [version: number]: string; } ) => getContentElementLabel(version, labels),
      RTE: {
        headingTitle: 'Heading 2',
        headingLabel: 'Heading',
        linkLabel: 'Link (Ctrl+K)',
        externalLinkLabel: 'External URL',
        emailLinkLabel: 'Email',
        imageUploadLabel: 'Insert image',
      },
    },
  },
  redirectRecords: {
    selectors: {},
    fr: {
      redirectModuleNameLabel: 'Redirection',
    },
    en: {
      redirectModuleNameLabel: 'Redirect',
    },
  },
  userRecords: {
    selectors: {},
    fr: {
      userModuleNameLabel: 'Utilisateur du site',
      groupModuleNameLabel: 'Groupe utilisateur du site web',
    },
    en: {
      userModuleNameLabel: 'Website User',
      groupModuleNameLabel: 'Website Usergroup',
    },
  },
  records: {
    selectors: {
      moduleFrameSelector: 'iframe#typo3-contentIframe',
      moduleSelector: '.list-group-item',
      searchRecordSelector: (label: string) => `button[title="${label}"]`,
      dropdownViewSelector: '.dropdown-menu',
      searchInputSelector: '.recordsearchbox-container input[type="search"]',
      deleteRecordSelector: '.t3js-editform-delete-record',
      confirmDeleteSelector: 'button[name="yes"]',
      inputSelector: (id: string) => `[data-formengine-input-name*="[${id}]"]`,
      selectSelector: (id: string) => `select[name$="[${id}]"]`,
    },
    fr: {
      createRecordLabel: 'Créer un nouvel enregistrement',
      // moduleNameLabel: 'Actualités',
      moduleNameLabel: 'Groupe utilisateur du site web',
      saveLabel: 'Enregistrer',
      viewLabel: 'Voir',
      searchLabel: 'Afficher la recherche',
    },
    en: {
      createRecordLabel: 'Create new record',
      // moduleNameLabel: 'News',
      moduleNameLabel: 'Website Usergroup',
      saveLabel: 'Save',
      viewLabel: 'View',
      searchLabel: 'Show search',
    },
  },
  modules: {
    selectors: {
      moduleMenuGroup: '.modulemenu-group',
      moduleMenuName: '.modulemenu-name',
    },
  },
  errors: {
    types: {
      modal: {
        selector: '.modal-dialog',
        message: 'content',
        severity: 'severity',
      },
      popup: {
        selector: 'typo3-notification-message',
        message: 'notification-message',
        severity: 'notification-severity',
      },
      alert: {
        selector: '.alert-message',
        message: '',
        severity: '',
      },
    },
  },
} as const;

export interface PlaywrightConfig {
  authFile: string;
  tempAuthFile: string;
  headless: boolean;
  downloadFileTest: {
    sourceFilePath: string;
    sourceFileName: string;
    destFilePath: string;
    destFileName: string;
  };
  createPageTest: {
    newPageTitle: string;
    newFolderTitle: string;
    newLinkTitle: string;
    newShortcutTitle: string;
  };
  createRedirectTest: {
    fields: Array<{ id: string; value: string; type: 'input' | 'link' | 'select' }>;
  };
  createUsersTest: {
    userFolderTitle: string;
    groupFields: Array<{ id: string; value: string; type: 'input' }>;
    secondaryGroupFields: Array<{ id: string; value: string; type: 'input' }>;
    userFields: Array<{ id: string; value: string; type:
  'input' | 'select' | 'check' }>;
  };
  createRecordTest: {
    fields: Array<{ id: string; value: string; type: 'input' | 'select' | 'link' }>;
  };
  createContentTest: {
    fields: Array<{ id: string; value: string; type: 'input' | 'select' | 'link' }>;
  };
  createRTEContentTest: {
    newHeadingTitle: string;
    newLinkPageTitle: string;
    newLinkExternalTitle: string;
    newLinkEmailTitle: string;
  };
}

// These are the default Playwright settings. They CAN be overridden.
const defaultPlaywrightConfig: PlaywrightConfig = {
  authFile: path.join(__dirname, 'tests/backend/.auth/state.json'),
  tempAuthFile: path.join(__dirname, 'tests/backend/.auth/state.temp.json'),
  headless: true,
  downloadFileTest: {
    sourceFilePath: '/tests/backend/fixtures/',
    sourceFileName: 'upload.png',
    destFilePath: '/tests/backend/downloads/',
    destFileName: 'dummy_downloaded.pdf',
  },
  createPageTest: {
    newPageTitle: 'New Page',
    newFolderTitle: 'New Folder',
    newLinkTitle: 'New Link',
    newShortcutTitle: 'New Shortcut',
  },
  createRedirectTest: {
    fields: [
      { id: 'source_path', value: '/path/to/something/', type: 'input' },
      { id: 'target', value: '/path/to/another/something', type: 'link' },
      { id: 'target_statuscode', value: '307', type: 'select' },
    ],
  },
  createUsersTest: {
    userFolderTitle: 'Test User Folder',
    groupFields: [{ id: 'title', value: '[1] Test Group', type: 'input' }],
    secondaryGroupFields: [
      { id: 'title', value: '[2] Test Group', type: 'input' },
    ],

    userFields: [
      { id: 'username', value: 'testuser', type: 'input' },
      { id: 'password', value: 'Test@1234', type: 'input' },
    ],
  },
  createRecordTest: {
    fields: [
      // { id: 'teaser', value: 'Teaser content' },
      { id: 'title', value: 'Title content', type: 'input' },
    ],
  },
  createContentTest: {
    fields: [
      { id: 'header', value: 'Header Content', type: 'input' },
      { id: 'subheader', value: 'Subheader Content', type: 'input' },
    ],
  },
  createRTEContentTest: {
    newHeadingTitle: 'New Heading',
    newLinkPageTitle: 'New link type page',
    newLinkExternalTitle: 'New link type external',
    newLinkEmailTitle: 'New link type email',
  },
};

//
// --- SECTION 2: DEFINE THE TYPES ---
//

type Typo3Config = typeof baseTypo3Config;

export interface ProjectConfig {
  typo3Version: number;
  typo3OldVersion: number;
  backendInterface: {
    pageSearch: {
      query: string;
      expectedResult: string[];
    };
    files: {
      usingS3Bucket: boolean;
    }
    contents: {
      labels: {
        [version: number]: string;
      }
    };
    module: {
      label: string;
      items: Array<{ label: string; heading?: string }>;
    };
    // TODO clean the way we select one of more language to test
    lang: 'fr' | 'en';
  };
}

export interface AppConfig {
  readonly typo3: Typo3Config;
  playwright: PlaywrightConfig;
  project: ProjectConfig;
}

//
// --- SECTION 3: THE CONFIGURATION FACTORY ---
//

export function defineConfig(
  projectConfig: ProjectConfig,
  playwrightOverrides?: DeepPartial<PlaywrightConfig>,
): AppConfig {
  return Object.freeze({
    typo3: baseTypo3Config,
    playwright: merge(defaultPlaywrightConfig, playwrightOverrides ?? {}),
    project: projectConfig,
  });
}
