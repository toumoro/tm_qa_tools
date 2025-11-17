export const filelist = {
  fileUpload: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify a file can be uploaded to the fileadmin and is stored with correct metadata.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'un fichier peut être téléchargé dans le fileadmin et qu\'il est stocké avec les métadonnées correctes.'
        },
      ],
    },
  },

  fileEditMeatadata: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify that a file\'s metadata can be edited and persisted.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez que les métadonnées d\'un fichier peuvent être modifiées et persistées.'
        },
      ],
    },
  },

  fileDownload: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify a file can be downloaded from the fileadmin.'
        },
        {
          type: 'note',
          description: 'If the project uses S3, set \'usingS3Bucket\' to true in the project config.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'un fichier peut être téléchargé depuis le fileadmin.'
        },
        {
          type: 'note',
          description: 'Si le projet utilise S3, définissez \'usingS3Bucket\' égal à true dans la configuration du projet.'
        },
      ],
    },
  },

  fileDelete: {
    labels: {
      en: [
        {
          type: 'description',
          description: 'Verify a file can be deleted from the fileadmin.'
        },
      ],
      fr: [
        {
          type: 'description',
          description: 'Vérifiez qu\'un fichier peut être supprimé du fileadmin.'
        },
      ],
    },
  },
};
