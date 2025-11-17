// project specific configuration
export const projectConfig = {
  typo3Version: 13,
  typo3OldVersion: 12,
  backendInterface: {
    pageSearch: {
      query: '90',
      expectedResult: ['Page 90'],
    },
    files: {
      usingS3Bucket: true,
    },
    contents: {
      labels: {
        13: 'Regular Text Element',
        12: 'Text',
      }
    },
    module: {
      label: 'Admin Tools',
      items: [
        { label: 'Maintenance' },
        { label: 'Settings', heading: 'Settings' },
        { label: 'Upgrade', heading: 'Upgrade' },
        { label: 'Environment', heading: 'Environment' },
        {
          label: 'Content Security Policy',
          heading: 'Content Security Policy',
        },
        { label: 'Extensions', heading: 'Installed Extensions' },
      ],
    },
    lang: 'en'
  },
};

// replace plawright's defaut configuration
export const playwrightOverrides = {
  createUsersTest: {
    userFields: [
      { id: 'username', value: 'your_username', type: 'input' },
      { id: 'password', value: 'your_password', type: 'input' },
    ],
  },
};

// replace default annotations configuration
export const annotationsOverrides = {
  locale: 'fr'
}