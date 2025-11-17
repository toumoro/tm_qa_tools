export const backendInterface = {
  searchPage: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that a searched page returns the expected page name.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'une page recherchée renvoie le nom de page attendu.'
        },
      ],
    }
  },

  createPage: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that a new page can be created successfully.'
        },
        {
          type: 'allowed',
          description: 'Standard, Link, Folder, Shortcut.'
        }
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'une nouvelle page peut être créée avec succès.'
        },
        {
          type: 'alloués',
          description: 'Standard, Lien, Dossier, Raccourci.'
        }
      ],
    }
  },

  editPage: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that an existing page can be edited successfully.'
        },
        {
          type: 'allowed',
          description: 'Standard, Link, Folder, Shortcut.'
        }
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'une page existante peut être modifiée avec succès.'
        },
        {
          type: 'alloués',
          description: 'Standard, Lien, Dossier, Raccourci.'
        }
      ],
    }
  },

  deletePage: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that an existing page can be deleted successfully.'
        },
        {
          type: 'allowed',
          description: 'Standard, Link, Folder, Shortcut.'
        }
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'une page existante peut être supprimée avec succès.'
        },
        {
          type: 'alloués',
          description: 'Standard, Lien, Dossier, Raccourci.'
        }
      ],
    }
  },

  createContentElement: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that a new content element can be created successfully on a page.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'un nouvel élément de contenu peut être créé avec succès sur une page.'
        },
      ],
    }
  },

  editContentElement: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that an existing content element can be edited successfully on a page.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'un élément de contenu existant peut être modifié avec succès sur une page.'
        },
      ],
    }
  },

  deleteContentElement: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that an existing content element can be deleted successfully from a page.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'un élément de contenu existant peut être supprimé avec succès d\'une page.'
        },
      ],
    }
  },

  createRecord: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that a new record can be created successfully in a module.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'un nouvel enregistrement peut être créé avec succès dans un module.'
        },
      ],
    }
  },

  editRecord: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that an existing record can be edited successfully in a module.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'un enregistrement existant peut être modifié avec succès dans un module.'
        },
      ],
    }
  },

  deleteRecord: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that an existing record can be deleted successfully from a module.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'un enregistrement existant peut être supprimé avec succès d\'un module.'
        },
      ],
    }
  },

  checkRTEButtons: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that all buttons are visible in the Rich Text Editor (RTE).'
        },
        {
          type: 'note',
          description: 'Buttons are checked by comparing the old staging instance of the project.'
        }
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez que tous les boutons sont visibles dans l\'éditeur de texte enrichi (RTE).'
        },
        {
          type: 'note',
          description: 'Les boutons sont vérifiés en comparant à l\'ancienne instance de staging du projet.'
        }
      ],
    }
  },

  checkRTEHeadings: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that all heading options are available in the Rich Text Editor (RTE).'
        },
        {
          type: 'note',
          description: 'Headings are checked by comparing the old staging instance of the project.'
        }
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez que toutes les options de titre sont disponibles dans l\'éditeur de texte enrichi (RTE).'
        },
        {
          type: 'note',
          description: 'Les titres sont vérifiés en comparant à l\'ancienne instance de staging du projet.'
        }
      ],
    }
  },

  checkRTEStyles: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that all style options are available in the Rich Text Editor (RTE).'
        },
        {
          type: 'note',
          description: 'Styles are checked by comparing the old staging instance of the project.'
        }
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez que toutes les options de style sont disponibles dans l\'éditeur de texte enrichi (RTE).'
        },
        {
          type: 'note',
          description: 'Les styles sont vérifiés en comparant à l\'ancienne instance de staging du projet.'
        }
      ],
    }
  },

  applyRTEHeading: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that a heading can be applied successfully to text in the Rich Text Editor (RTE).'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'un style de titre peut être appliqué avec succès à un texte dans l\'éditeur de texte enrichi (RTE).'
        },
      ],
    }
  },

  createRTELink: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that a link to a page can be created successfully in the Rich Text Editor (RTE).'
        },
        {
          type: 'allowed',
          description: 'Internal page link, External link, Email link.'
        }
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'un lien vers une page peut être créé avec succès dans l\'éditeur de texte enrichi (RTE).'
        },
        {
          type: 'alloués',
          description: 'Lien de page interne, Lien externe, Lien email.'
        }
      ],
    }
  },

  verifyRTEImageUpload: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that an image can be uploaded successfully via the Rich Text Editor (RTE).'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'une image peut être téléchargée avec succès via l\'éditeur de texte enrichi (RTE).'
        },
      ],
    }
  },
};