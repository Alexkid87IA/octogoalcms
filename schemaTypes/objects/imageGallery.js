// cms/schemaTypes/objects/imageGallery.js
// Galerie d'images pour les articles

export default {
  name: 'imageGallery',
  title: 'Galerie d\'images',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Titre de la galerie',
      type: 'string'
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{
        type: 'image',
        options: { hotspot: true },
        fields: [
          {
            name: 'caption',
            title: 'Légende',
            type: 'string'
          },
          {
            name: 'alt',
            title: 'Texte alternatif',
            type: 'string'
          }
        ]
      }],
      validation: Rule => Rule.min(2).max(20)
    },
    {
      name: 'layout',
      title: 'Disposition',
      type: 'string',
      options: {
        list: [
          { title: 'Carousel', value: 'carousel' },
          { title: 'Grille 2 colonnes', value: 'grid-2' },
          { title: 'Grille 3 colonnes', value: 'grid-3' },
          { title: 'Masonry', value: 'masonry' },
          { title: 'Pleine largeur (scroll)', value: 'fullwidth' }
        ]
      },
      initialValue: 'carousel'
    },
    {
      name: 'showCaptions',
      title: 'Afficher les légendes',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'lightbox',
      title: 'Ouvrir en plein écran au clic',
      type: 'boolean',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'title',
      images: 'images',
      media: 'images.0'
    },
    prepare({ title, images, media }) {
      const count = images?.length || 0
      return {
        title: `🖼️ ${title || 'Galerie'}`,
        subtitle: `${count} image${count > 1 ? 's' : ''}`,
        media
      }
    }
  }
}
