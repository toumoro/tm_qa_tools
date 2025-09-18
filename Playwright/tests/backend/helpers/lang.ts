
// helper to get content element label based on TYPO3 version and language
export const getContentElementLabel = (
  version: number,
  lang: string
): string => {
  const labels: Record<string, Record<number, string>> = {
    fr: {
      13: 'Elément de texte classique',
      12: 'Elément de texte classique',
      11: 'Elément de texte classique',
    },
    en: {
      13: 'Regular Text Element',
      12: 'Regular Text Element',
      11: 'Regular Text Element',
    },
  };

  return labels[lang][version];
};

// helper to get content element preview selector based on TYPO3 version
export const getContentElementPreviewSelector = (version: number): string => {
  return version >= 12 ? '.t3-page-ce-element' : '.t3-page-ce-body a';
}

// helper to get content element edit button selector based on TYPO3 version
export const getElementEditSelector = (version: number): string => {
  return version >= 12 ? '.t3-page-ce-header-right a' : 'a';
}

// helper to get RTE selector based on TYPO3 version
export const getRTESelector = (version: number): string => {
  return version >= 12 ? 'div[contenteditable=true]' : 'body[contenteditable=true]';
}