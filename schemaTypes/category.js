// Dans MonMagazineSanity/schemaTypes/category.js (ou .ts si votre projet le gère)
export default {
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: Rule => Rule.required(), // Correction ici
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(), // Correction ici
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
};
