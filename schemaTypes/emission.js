export default {
  name: 'emission',
  title: 'Émission',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: "Titre de l'émission",
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
      title: 'Image de couverture (16:9)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error('Une image de couverture est requise.'),
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
    
    // CHAMPS IMPORTANTS
    {
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Entrepreneuriat', value: 'entrepreneuriat' },
          { title: 'Leadership', value: 'leadership' },
          { title: 'Innovation', value: 'innovation' },
          { title: 'Mindset', value: 'mindset' },
          { title: 'Général', value: 'general' }
        ]
      },
      initialValue: 'general',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'guest',
      title: 'Invité principal',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Nom',
          type: 'string',
        },
        {
          name: 'title',
          title: 'Titre/Fonction',
          type: 'string',
        },
        {
          name: 'photo',
          title: 'Photo (optionnel)',
          type: 'image',
          options: { hotspot: true }
        }
      ]
    },
    {
      name: 'duration',
      title: 'Durée (format MM:SS)',
      type: 'string',
      validation: (Rule) => Rule.regex(/^\d{1,2}:\d{2}$/).error('Format invalide. Utilisez MM:SS'),
      description: 'Exemple: 45:30 pour 45 minutes et 30 secondes'
    },
    {
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: (new Date()).toISOString()
    },
    {
      name: 'featured',
      title: 'Mettre en avant',
      type: 'boolean',
      description: 'Afficher cet épisode en premier',
      initialValue: false
    },
    {
      name: 'listens',
      title: 'Nombre d\'écoutes',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'likes',
      title: 'Nombre de likes',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'videoUrl',
      title: 'URL de la vidéo intégrée',
      type: 'url',
      description: 'Pour les vidéos hébergées directement',
    },
    {
      name: 'videoUrlExternal',
      title: 'URL de la vidéo externe',
      type: 'url',
      description: 'YouTube, Vimeo, Dailymotion, etc.',
    },
    {
      name: 'audioUrl',
      title: 'URL du podcast audio (optionnel)',
      type: 'url',
      description: 'Pour la version audio uniquement'
    },
    {
      name: 'detailedContent',
      title: 'Notes détaillées de l\'épisode',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Contenu détaillé, timestamps, liens mentionnés, etc.'
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'guest.name',
      media: 'coverImage',
      featured: 'featured',
      category: 'category'
    },
    prepare({ title, subtitle, media, featured, category }) {
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: subtitle ? `avec ${subtitle} • ${category || 'general'}` : category || 'general',
        media
      }
    }
  },
}