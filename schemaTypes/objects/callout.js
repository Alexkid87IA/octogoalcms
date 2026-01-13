// cms/schemaTypes/objects/callout.js
// Bloc d'alerte/callout pour les articles

export default {
  name: 'callout',
  title: 'Callout / Alerte',
  type: 'object',
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: '💡 Info', value: 'info' },
          { title: '⚠️ Attention', value: 'warning' },
          { title: '✅ Succès', value: 'success' },
          { title: '🔥 Breaking', value: 'breaking' },
          { title: '🔥 Fire', value: 'fire' },
          { title: '📊 Stat', value: 'stat' },
          { title: '💬 Citation rapide', value: 'quote' }
        ],
        layout: 'radio'
      },
      initialValue: 'info'
    },
    {
      name: 'title',
      title: 'Titre (optionnel)',
      type: 'string'
    },
    {
      name: 'content',
      title: 'Contenu',
      type: 'text',
      rows: 3
      // validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      type: 'type',
      title: 'title',
      content: 'content'
    },
    prepare({ type, title, content }) {
      const icons = {
        info: '💡',
        warning: '⚠️',
        success: '✅',
        breaking: '🔥',
        fire: '🔥',
        stat: '📊',
        quote: '💬'
      }
      return {
        title: `${icons[type] || '📌'} ${title || content?.substring(0, 50) + '...'}`,
        subtitle: `Callout ${type}`
      }
    }
  }
}
