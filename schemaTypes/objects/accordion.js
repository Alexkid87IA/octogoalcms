// cms/schemaTypes/objects/accordion.js
// Bloc accordéon / FAQ

export default {
  name: 'accordion',
  title: 'Accordéon / FAQ',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Titre de la section',
      type: 'string',
      description: 'Ex: Questions fréquentes, En savoir plus'
    },
    {
      name: 'items',
      title: 'Éléments',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'question',
            title: 'Question / Titre',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'answer',
            title: 'Réponse / Contenu',
            type: 'text',
            rows: 4,
            validation: Rule => Rule.required()
          },
          {
            name: 'defaultOpen',
            title: 'Ouvert par défaut',
            type: 'boolean',
            initialValue: false
          }
        ],
        preview: {
          select: {
            question: 'question'
          },
          prepare({ question }) {
            return {
              title: question
            }
          }
        }
      }],
      validation: Rule => Rule.min(1)
    },
    {
      name: 'allowMultiple',
      title: 'Permettre plusieurs ouverts',
      type: 'boolean',
      description: 'Autoriser l\'ouverture de plusieurs éléments en même temps',
      initialValue: false
    },
    {
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Simple', value: 'simple' },
          { title: 'Bordé', value: 'bordered' },
          { title: 'Cards', value: 'cards' },
          { title: 'Numéroté', value: 'numbered' }
        ]
      },
      initialValue: 'simple'
    }
  ],
  preview: {
    select: {
      title: 'title',
      items: 'items'
    },
    prepare({ title, items }) {
      const count = items?.length || 0
      return {
        title: `📋 ${title || 'Accordéon'}`,
        subtitle: `${count} élément${count > 1 ? 's' : ''}`
      }
    }
  }
}
