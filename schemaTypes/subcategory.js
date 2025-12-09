// cms/schemaTypes/subcategory.js

export default {
  name: 'subcategory',
  title: 'Sous-catégorie',
  type: 'document',
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
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'parentCategory',
      title: 'Catégorie parente',
      type: 'reference',
      to: [{type: 'category'}],
      validation: Rule => Rule.required(),
      description: 'La catégorie principale à laquelle appartient cette sous-catégorie'
    },
    {
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      description: 'Position dans le menu (1, 2, 3...)',
      validation: Rule => Rule.integer().min(1)
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Afficher cette sous-catégorie dans le menu',
      initialValue: true
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
      parent: 'parentCategory.title',
      order: 'order'
    },
    prepare({title, parent, order}) {
      return {
        title: title,
        subtitle: `${parent || 'Sans catégorie'} • Position ${order || '?'}`
      }
    }
  },
  orderings: [
    {
      title: 'Par catégorie et ordre',
      name: 'categoryOrder',
      by: [
        {field: 'parentCategory.title', direction: 'asc'},
        {field: 'order', direction: 'asc'}
      ]
    }
  ]
}