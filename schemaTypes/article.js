// cms/schemaTypes/article.js - VERSION OPTIMISÉE CENTRALISÉE AVEC KEYPOINTS

export default {
  name: 'article',
  type: 'document',
  title: 'Article',
  fields: [
    // ========== CONTENU PRINCIPAL ==========
    {
      name: 'title',
      type: 'string',
      title: 'Titre',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'contentType',
      type: 'string',
      title: '📌 Type de contenu',
      options: {
        list: [
          {title: '📄 Article standard', value: 'article'},
          {title: '🎙️ Émission/Podcast', value: 'emission'},
          {title: '🍿 Amuse-bouche', value: 'amuse-bouche'},
          {title: '💼 Étude de cas', value: 'case-study'},
          {title: '🏆 Success Story', value: 'success-story'}
        ],
        layout: 'radio'
      },
      initialValue: 'article',
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      type: 'text',
      title: 'Extrait',
      description: 'Un résumé court et accrocheur de l\'article (utilisé pour les aperçus et le SEO)',
      rows: 4,
      validation: Rule => Rule.max(280).warning('Un extrait concis est plus efficace (max 280 caractères recommandés)')
    },
    {
      name: 'mainImage',
      type: 'image',
      title: 'Image principale',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
          description: 'Important pour l\'accessibilité et le SEO'
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Légende',
          description: 'Texte affiché sous l\'image (optionnel)'
        }
      ]
    },
    {
      name: 'body',
      type: 'blockContent',
      title: 'Contenu',
      description: 'Le contenu principal de l\'article'
    },
    {
      name: 'keyPoints',
      type: 'array',
      title: '💡 Points clés à retenir',
      description: 'Les points importants de l\'article (3-5 points recommandés)',
      of: [{
        type: 'string',
        validation: Rule => Rule.max(200).warning('Gardez les points clés concis (max 200 caractères)')
      }],
      validation: Rule => Rule.max(5).warning('Maximum 5 points clés recommandés pour une meilleure lisibilité')
    },
    
    // ========== CHAMPS POUR ÉMISSIONS/VIDÉOS ==========
    {
      name: 'videoUrl',
      type: 'url',
      title: '🎥 URL de la vidéo externe',
      description: 'YouTube, Vimeo, Dailymotion, etc.',
      hidden: ({document}) => !['emission', 'amuse-bouche'].includes(document?.contentType)
    },
    {
      name: 'duration',
      type: 'string',
      title: '⏱️ Durée',
      description: 'Format: MM:SS (ex: 45:30)',
      validation: Rule => Rule.regex(/^\d{1,3}:\d{2}$/, {
        name: 'duration',
        invert: false
      }).error('Format invalide. Utilisez MM:SS'),
      hidden: ({document}) => !['emission', 'amuse-bouche'].includes(document?.contentType)
    },
    {
      name: 'guest',
      title: '🎤 Invité(s)',
      type: 'string',
      description: 'Nom de l\'invité principal',
      hidden: ({document}) => document?.contentType !== 'emission'
    },
    
    // ========== MÉTADONNÉES ==========
    {
      name: 'author',
      type: 'reference',
      title: 'Auteur',
      to: {type: 'author'}
    },
    {
      name: 'categories',
      type: 'array',
      title: 'Catégories principales',
      description: 'Story, Business, Mental ou Society',
      of: [{type: 'reference', to: {type: 'category'}}],
      validation: Rule => Rule.required().min(1).error('Sélectionnez au moins une catégorie principale')
    },
    {
      name: 'subcategories',
      type: 'array',
      title: 'Sous-catégories',
      description: 'Les sous-catégories spécifiques de cet article',
      of: [{type: 'reference', to: {type: 'subcategory'}}],
      options: {
        filter: ({document}) => {
          if (!document.categories || document.categories.length === 0) {
            return { filter: 'false == true' }
          }
          return {
            filter: 'parentCategory._ref in $categoryIds',
            params: {
              categoryIds: document.categories.map(cat => cat._ref)
            }
          }
        }
      }
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags',
      description: 'Mots-clés pour améliorer la recherche et le SEO',
      of: [{type: 'reference', to: {type: 'tag'}}]
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Publié le',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required()
    },
    {
      name: 'readingTime',
      type: 'number',
      title: 'Temps de lecture (minutes)',
      description: 'Estimation du temps de lecture',
      validation: Rule => Rule.min(1).max(60).integer()
    },
    
    // ========== VISIBILITÉ ET MISE EN AVANT ==========
    {
      name: 'isEssential',
      type: 'boolean',
      title: '⭐ Article essentiel',
      description: 'Afficher dans la section "5 essentiels"',
      initialValue: false
    },
    {
      name: 'isTrending',
      type: 'boolean',
      title: '🔥 Article tendance',
      description: 'Afficher dans la section "Articles tendances"',
      initialValue: false
    },
    {
      name: 'trendingOrder',
      type: 'number',
      title: 'Ordre dans les tendances',
      description: 'Position d\'affichage (1 = premier, 2 = deuxième, etc.)',
      hidden: ({document}) => !document?.isTrending,
      validation: Rule => Rule.min(1).max(6).integer()
    },
    {
      name: 'isFeatured',
      type: 'boolean',
      title: '🌟 Article à la une',
      description: 'Afficher comme article principal sur la homepage',
      initialValue: false
    },
    
    // ========== STATISTIQUES ==========
    {
      name: 'stats',
      title: '📊 Statistiques',
      type: 'object',
      fields: [
        {
          name: 'views',
          title: 'Vues/Écoutes',
          type: 'number',
          initialValue: 0,
          validation: Rule => Rule.min(0).integer()
        },
        {
          name: 'likes',
          title: 'Likes',
          type: 'number',
          initialValue: 0,
          validation: Rule => Rule.min(0).integer()
        },
        {
          name: 'shares',
          title: 'Partages',
          type: 'number',
          initialValue: 0,
          validation: Rule => Rule.min(0).integer()
        },
        {
          name: 'comments',
          title: 'Commentaires',
          type: 'number',
          initialValue: 0,
          validation: Rule => Rule.min(0).integer()
        }
      ],
      options: {
        collapsible: true,
        collapsed: false
      }
    },
    
    // ========== SEO ET RÉSEAUX SOCIAUX ==========
    {
      name: 'seo',
      title: '🔍 SEO & Réseaux sociaux',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Titre pour le SEO (50-60 caractères)',
          validation: Rule => Rule.max(60).warning('Le titre SEO ne devrait pas dépasser 60 caractères')
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Description pour le SEO (150-160 caractères)',
          validation: Rule => Rule.max(160).warning('La description SEO ne devrait pas dépasser 160 caractères')
        },
        {
          name: 'ogImage',
          title: 'Image Open Graph',
          type: 'image',
          description: 'Image pour les partages sur les réseaux sociaux (1200x630px recommandé)',
          options: {
            hotspot: true
          }
        },
        {
          name: 'keywords',
          title: 'Mots-clés SEO',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            layout: 'tags'
          },
          description: 'Mots-clés pour le référencement (5-10 mots-clés recommandés)'
        }
      ],
      options: {
        collapsible: true,
        collapsed: true
      }
    },
    
    // ========== CONTENU CONNEXE ==========
    {
      name: 'relatedArticles',
      title: '🔗 Articles connexes',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'article'}]
      }],
      description: 'Articles recommandés à afficher en fin d\'article',
      validation: Rule => Rule.max(6).warning('Maximum 6 articles connexes recommandés')
    }
  ],
  
  preview: {
    select: {
      title: 'title',
      contentType: 'contentType',
      author: 'author.name',
      media: 'mainImage',
      isEssential: 'isEssential',
      isTrending: 'isTrending',
      isFeatured: 'isFeatured',
      category: 'categories.0.title',
      subcategory: 'subcategories.0.title',
      publishedAt: 'publishedAt'
    },
    prepare(selection) {
      const {author, isEssential, isTrending, isFeatured, category, subcategory, contentType, publishedAt} = selection
      let subtitle = author ? `par ${author}` : ''
      
      // Ajouter la catégorie et sous-catégorie
      if (category) {
        subtitle = `${category}${subcategory ? ' › ' + subcategory : ''}${subtitle ? ' • ' + subtitle : ''}`
      }
      
      // Ajouter la date si publiée
      if (publishedAt) {
        const date = new Date(publishedAt).toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        })
        subtitle = subtitle ? `${subtitle} • ${date}` : date
      }
      
      // Ajouter des indicateurs visuels
      const badges = []
      if (isFeatured) badges.push('🌟')
      if (isEssential) badges.push('⭐')
      if (isTrending) badges.push('🔥')
      
      // Emojis pour le type de contenu
      const typeEmojis = {
        'article': '📄',
        'emission': '🎙️',
        'amuse-bouche': '🍿',
        'case-study': '💼',
        'success-story': '🏆'
      }
      
      if (badges.length > 0 || contentType !== 'article') {
        return {
          ...selection,
          title: `${typeEmojis[contentType] || ''} ${badges.join(' ')} ${selection.title}`.trim(),
          subtitle
        }
      }
      
      return {
        ...selection,
        subtitle
      }
    }
  },
  orderings: [
    {
      title: 'Date de publication, Récent',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}]
    },
    {
      title: 'Date de publication, Ancien',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}]
    },
    {
      title: 'Articles essentiels',
      name: 'essentials',
      by: [
        {field: 'isEssential', direction: 'desc'},
        {field: 'publishedAt', direction: 'desc'}
      ]
    },
    {
      title: 'Articles tendances',
      name: 'trending',
      by: [
        {field: 'isTrending', direction: 'desc'},
        {field: 'trendingOrder', direction: 'asc'}
      ]
    },
    {
      title: 'Articles à la une',
      name: 'featured',
      by: [
        {field: 'isFeatured', direction: 'desc'},
        {field: 'publishedAt', direction: 'desc'}
      ]
    },
    {
      title: 'Plus populaires',
      name: 'mostViewed',
      by: [
        {field: 'stats.views', direction: 'desc'}
      ]
    },
    {
      title: 'Plus aimés',
      name: 'mostLiked',
      by: [
        {field: 'stats.likes', direction: 'desc'}
      ]
    }
  ]
}