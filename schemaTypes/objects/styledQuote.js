// cms/schemaTypes/objects/styledQuote.js
// Citation stylée avec photo et source

export default {
  name: 'styledQuote',
  title: 'Citation stylée',
  type: 'object',
  fields: [
    {
      name: 'quote',
      title: 'Citation',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required()
    },
    {
      name: 'author',
      title: 'Auteur',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'role',
      title: 'Rôle / Fonction',
      type: 'string',
      description: 'Ex: Entraîneur du PSG, Attaquant de l\'OM'
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Ex: Conférence de presse, L\'Équipe, RMC Sport'
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date'
    },
    {
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Classique', value: 'classic' },
          { title: 'Avec fond', value: 'filled' },
          { title: 'Grande citation', value: 'large' },
          { title: 'Encadré', value: 'bordered' }
        ]
      },
      initialValue: 'classic'
    }
  ],
  preview: {
    select: {
      quote: 'quote',
      author: 'author',
      media: 'image'
    },
    prepare({ quote, author, media }) {
      return {
        title: `"${quote?.substring(0, 60)}..."`,
        subtitle: `— ${author}`,
        media
      }
    }
  }
}
