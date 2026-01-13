// cms/schemaTypes/objects/spoiler.js
// Bloc spoiler/révélation

export default {
  name: 'spoiler',
  title: 'Spoiler / Révélation',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Titre (visible)',
      type: 'string',
      // validation: Rule => Rule.required(),
      description: 'Ex: Cliquez pour voir le résultat, Notre pronostic'
    },
    {
      name: 'content',
      title: 'Contenu caché',
      type: 'text',
      rows: 4
      // validation: Rule => Rule.required()
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: '🎯 Pronostic', value: 'prediction' },
          { title: '🏆 Résultat', value: 'result' },
          { title: '🤫 Spoiler', value: 'spoiler' },
          { title: '💡 Réponse', value: 'answer' },
          { title: '📖 Lire la suite', value: 'readmore' }
        ]
      },
      initialValue: 'spoiler'
    },
    // Legacy field
    {
      name: 'spoilerType',
      title: '[Legacy] Type de spoiler',
      type: 'string',
      hidden: true
    },
    {
      name: 'buttonText',
      title: 'Texte du bouton',
      type: 'string',
      description: 'Ex: Révéler, Voir la réponse',
      initialValue: 'Cliquez pour révéler'
    }
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type'
    },
    prepare({ title, type }) {
      const icons = {
        prediction: '🎯',
        result: '🏆',
        spoiler: '🤫',
        answer: '💡',
        readmore: '📖'
      }
      return {
        title: `${icons[type] || '🤫'} ${title}`,
        subtitle: 'Contenu caché'
      }
    }
  }
}
