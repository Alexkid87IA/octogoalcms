// cms/schemaTypes/tag.js
// Tags améliorés avec slug, couleurs et types

export default {
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: () => '🏷️',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required(),
      description: 'URL du tag (ex: /tag/mbappe)'
    },
    {
      name: 'tagType',
      title: 'Type de tag',
      type: 'string',
      options: {
        list: [
          { title: 'Joueur', value: 'player' },
          { title: 'Club', value: 'club' },
          { title: 'Compétition', value: 'competition' },
          { title: 'Pays/Sélection', value: 'country' },
          { title: 'Thème', value: 'theme' },
          { title: 'Événement', value: 'event' },
          { title: 'Autre', value: 'other' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'theme'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Description courte pour le SEO'
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Image représentative (optionnel)'
    },
    {
      name: 'color',
      title: 'Couleur',
      type: 'string',
      description: 'Couleur d\'affichage du tag',
      options: {
        list: [
          { title: 'Bleu', value: 'blue' },
          { title: 'Rouge', value: 'red' },
          { title: 'Vert', value: 'green' },
          { title: 'Jaune', value: 'yellow' },
          { title: 'Violet', value: 'purple' },
          { title: 'Rose', value: 'pink' },
          { title: 'Orange', value: 'orange' },
          { title: 'Gris', value: 'gray' }
        ]
      },
      initialValue: 'blue'
    },
    {
      name: 'linkedPlayer',
      title: 'Joueur lié',
      type: 'reference',
      to: [{ type: 'player' }],
      hidden: ({ document }) => document?.tagType !== 'player',
      description: 'Lier ce tag à une fiche joueur'
    },
    {
      name: 'linkedClub',
      title: 'Club lié',
      type: 'reference',
      to: [{ type: 'club' }],
      hidden: ({ document }) => document?.tagType !== 'club',
      description: 'Lier ce tag à une fiche club'
    },
    {
      name: 'isTrending',
      title: 'Tag tendance',
      type: 'boolean',
      description: 'Afficher dans les tags populaires',
      initialValue: false
    },
    {
      name: 'articleCount',
      title: 'Nombre d\'articles',
      type: 'number',
      readOnly: true,
      description: 'Calculé automatiquement'
    }
  ],
  preview: {
    select: {
      title: 'title',
      type: 'tagType',
      trending: 'isTrending',
      media: 'image'
    },
    prepare({ title, type, trending, media }) {
      const typeIcons = {
        'player': '⚽',
        'club': '🏟️',
        'competition': '🏆',
        'country': '🌍',
        'theme': '📌',
        'event': '📅',
        'other': '🏷️'
      }
      return {
        title: `${typeIcons[type] || '🏷️'} ${trending ? '🔥 ' : ''}${title}`,
        subtitle: type,
        media
      }
    }
  },
  orderings: [
    {
      title: 'Nom (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    },
    {
      title: 'Par type',
      name: 'byType',
      by: [{ field: 'tagType', direction: 'asc' }, { field: 'title', direction: 'asc' }]
    },
    {
      title: 'Tendances',
      name: 'trending',
      by: [{ field: 'isTrending', direction: 'desc' }, { field: 'title', direction: 'asc' }]
    }
  ]
}
  