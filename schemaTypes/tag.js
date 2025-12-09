export default {
    name: 'tag',
    title: 'Tag',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Titre',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        rows: 2
      }
    ]
  }
  