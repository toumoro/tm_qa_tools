// THIS CONFIG IS SPECIFIC TO SPECIFIC PROJECT
export const exampleProjectConfig = {
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
    lang: 'en',
  },
};

// Override default Playwright config for specific project
export const examplePlaywrightOverrides = {
  createUsersTest: {
    userFields: [
      { id: 'username', value: 'your_username', type: 'input' },
      { id: 'password', value: 'your_password', type: 'input' },
    ],
  },
};