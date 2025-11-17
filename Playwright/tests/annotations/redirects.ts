export const redirects = {
  createRedirect: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that a redirect can be created and stored with correct source, target and status.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'une redirection peut être créée et enregistrée avec la source, la cible et le statut corrects.'
        },
      ],
    },
  },

  editRedirect: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that an existing redirect can be modified and changes take effect.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'une redirection existante peut être modifiée et que les changements sont pris en compte.'
        },
      ],
    },
  },

  deleteRedirect: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Confirm a redirect can be deleted.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Confirmer qu\'une redirection peut être supprimée et qu\'elle n\'est plus appliquée.'
        },
      ],
    },
  },

  checkIntegrity: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify the integrity of redirect rules by confirming each source resolves to the expected target and that there are no loops or dead-end chains.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez l\'intégrité des règles de redirection en confirmant que chaque source aboutit à la cible attendue et qu\'il n\'existe pas de boucles ou de chaînes aboutissant à une erreur.'
        },
      ],
    },
  },
};
