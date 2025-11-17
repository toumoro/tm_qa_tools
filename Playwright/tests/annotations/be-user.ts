export const backendUser = {
  userFound: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Confirm the created backend user can be located using the user search.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Confirmer que l\'utilisateur backend créé peut être trouvé via la recherche d\'utilisateurs.'
        },
      ],
    }
  },

  userDashboardAccess: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify the backend user can access the dashboard.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifier que l\'utilisateur backend peut accéder au tableau de bord.'
        },
      ],
    }
  },

  userCreateFrontendGroup: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Ensure the backend user can create a frontend user group.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Assurer que l\'utilisateur backend peut créer un groupe d\'utilisateurs frontend.'
        },
      ],
    }
  },

  frontendGroupContainsSubGroups: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify a frontend group correctly contains expected sub-groups and that the hierarchical relationship is represented.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifier qu\'un groupe frontend contient correctement les sous-groupes attendus et que la relation hiérarchique est représentée.'
        },
      ],
    }
  },

  userAddRemoveSubgroup: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Test adding and removing subgroups from a frontend group.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Tester l\'ajout et la suppression de sous-groupes dans un groupe frontend.'
        },
      ],
    }
  },

  userDeleteFrontendGroup: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Ensure backend user can delete a frontend user group.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Assurer que l\'utilisateur backend peut supprimer un groupe d\'utilisateurs frontend.'
        },
      ],
    }
  },

  userCreateFrontendUser: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify backend user can create a frontend user and assign groups.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifier que l\'utilisateur backend peut créer un utilisateur frontend et lui assigner des groupes.'
        },
      ],
    }
  },

  userAddRemoveFrontendGroup: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Ensure backend user can add or remove frontend groups for an existing frontend user.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Assurer que l\'utilisateur backend peut ajouter ou retirer des groupes frontend pour un utilisateur existant.'
        },
      ],
    }
  },

  userDeleteFrontendUser: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify backend user can delete a frontend user.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifier que l\'utilisateur backend peut supprimer un utilisateur frontend.'
        },
      ],
    },
  }
};
