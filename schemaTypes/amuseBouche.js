export default {
  name: 'amuseBouche',
  title: 'Amuse-bouche',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required().error('Un titre est requis.'),
    },
    {
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 3,
    },
    {
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: {
        hotspot: true, // Permet de recadrer l'image de manière flexible
      },
      validation: (Rule) => Rule.required().error('Une image de couverture est requise.'),
    },
    {
      name: 'videoUrl',
      title: 'URL de la vidéo (YouTube, Vimeo, etc.)',
      type: 'url',
      description: 'Collez ici le lien complet de la vidéo.',
    },
    // Si vous préférez uploader des fichiers vidéo directement (attention à la taille et à l'hébergement)
    // {
    //   name: 'videoFile',
    //   title: 'Fichier Vidéo',
    //   type: 'file',
    //   options: {
    //     accept: 'video/*'
    //   }
    // },
    {
      name: 'duration',
      title: 'Durée (ex: 2:45)',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Un slug est requis pour l\'URL.'),
    },
    {
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
    },
  },
}

