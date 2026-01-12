// cms/schemaTypes/category.js
// Catégories améliorées avec icônes, couleurs et SEO

export default {
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  icon: () => '📁',
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
      rows: 3,
      description: 'Description courte pour le SEO et les aperçus'
    },
    {
      name: 'icon',
      title: 'Icône (emoji)',
      type: 'string',
      description: 'Ex: ⚽ 📰 🎬 😂 📹',
      validation: Rule => Rule.max(4)
    },
    {
      name: 'image',
      title: 'Image de couverture',
      type: 'image',
      options: { hotspot: true },
      description: 'Image pour la page catégorie (16:9)'
    },
    {
      name: 'color',
      title: 'Couleur principale',
      type: 'string',
      description: 'Code hex (ex: #E11D48) ou classe Tailwind (ex: rose-500)',
      options: {
        list: [
          { title: 'Rouge', value: '#E11D48' },
          { title: 'Orange', value: '#F97316' },
          { title: 'Jaune', value: '#EAB308' },
          { title: 'Vert', value: '#22C55E' },
          { title: 'Bleu', value: '#3B82F6' },
          { title: 'Violet', value: '#8B5CF6' },
          { title: 'Rose', value: '#EC4899' },
          { title: 'Gris', value: '#6B7280' }
        ]
      }
    },
    {
      name: 'gradient',
      title: 'Dégradé CSS',
      type: 'string',
      description: 'Ex: from-pink-500 to-rose-600'
    },
    {
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      description: 'Position dans le menu (1, 2, 3...)',
      validation: Rule => Rule.integer().min(1)
    },
    {
      name: 'showInNav',
      title: 'Afficher dans la navigation',
      type: 'boolean',
      description: 'Afficher cette catégorie dans le menu principal',
      initialValue: true
    },
    {
      name: 'showInFooter',
      title: 'Afficher dans le footer',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'isFeatured',
      title: 'Catégorie mise en avant',
      type: 'boolean',
      description: 'Afficher en priorité sur la homepage',
      initialValue: false
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Titre pour Google (laissez vide pour utiliser le titre)'
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Description pour Google'
        }
      ],
      options: { collapsible: true, collapsed: true }
    }
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'icon',
      order: 'order',
      showInNav: 'showInNav',
      media: 'image'
    },
    prepare({ title, icon, order, showInNav, media }) {
      return {
        title: `${icon || '📁'} ${title}`,
        subtitle: `${showInNav ? '✅ Nav' : '❌ Nav'} • Position ${order || '?'}`,
        media
      }
    }
  },
  orderings: [
    {
      title: 'Ordre d\'affichage',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    },
    {
      title: 'Nom (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ]
};
