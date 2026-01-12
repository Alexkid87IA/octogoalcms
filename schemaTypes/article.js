// cms/schemaTypes/article.js - VERSION OCTOGOAL MEDIA FOOTBALL

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
      description: 'Choisis le format de ton contenu',
      options: {
        list: [
          {title: '📰 Actu', value: 'actu'},
          {title: '🎬 Émission Octogoal', value: 'emission'},
          {title: '⚡ Flash', value: 'flash'},
          {title: '📊 Analyse', value: 'analyse'},
          {title: '👤 Portrait', value: 'portrait'},
          {title: '😂 Mème', value: 'meme'},
          {title: '📋 Top / Liste', value: 'top'}
        ],
        layout: 'radio'
      },
      initialValue: 'actu',
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      type: 'text',
      title: 'Extrait / Accroche',
      description: 'Un résumé court et accrocheur (style Henni bienvenu 😄)',
      rows: 4,
      validation: Rule => Rule.max(280).warning('Un extrait concis est plus efficace (max 280 caractères recommandés)')
    },
    {
      name: 'mainImage',
      type: 'image',
      title: 'Image principale',
      description: 'Format recommandé: 16:9, min 1200x675px',
      options: {
        hotspot: true,
        accept: 'image/*'
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
          description: 'Décris l\'image (ex: "Mbappé célébrant son but")',
          validation: Rule => Rule.required().warning('Le texte alternatif est important pour le SEO')
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Légende',
          description: 'Texte affiché sous l\'image (optionnel)'
        },
        {
          name: 'credit',
          type: 'string',
          title: 'Crédit photo',
          description: 'Ex: AFP, Reuters, Getty Images'
        }
      ],
      validation: Rule => Rule.required().error('Une image principale est requise')
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
      description: 'Les infos importantes (3-5 points max)',
      of: [{
        type: 'string',
        validation: Rule => Rule.max(200).warning('Garde les points clés concis (max 200 caractères)')
      }],
      validation: Rule => Rule.max(5).warning('Maximum 5 points clés pour une meilleure lisibilité')
    },
    
    // ========== CHAMPS POUR ÉMISSIONS/VIDÉOS ==========
    {
      name: 'videoUrl',
      type: 'url',
      title: '🎥 URL de la vidéo',
      description: 'YouTube, Twitch, Dailymotion, etc.',
      hidden: ({document}) => !['emission', 'flash', 'meme'].includes(document?.contentType)
    },
    {
      name: 'duration',
      type: 'string',
      title: '⏱️ Durée',
      description: 'Format: MM:SS (ex: 45:30) ou HH:MM:SS pour les longues émissions',
      hidden: ({document}) => !['emission', 'flash'].includes(document?.contentType)
    },
    {
      name: 'guest',
      title: '🎤 Invité(s)',
      type: 'string',
      description: 'Nom de l\'invité principal ou des participants',
      hidden: ({document}) => document?.contentType !== 'emission'
    },
    
    // ========== CHAMPS POUR PORTRAITS ==========
    {
      name: 'playerName',
      type: 'string',
      title: '⚽ Nom du joueur/personnalité',
      description: 'Le nom complet de la personne',
      hidden: ({document}) => document?.contentType !== 'portrait'
    },
    {
      name: 'playerClub',
      type: 'string',
      title: '🏟️ Club actuel',
      description: 'Le club actuel du joueur',
      hidden: ({document}) => document?.contentType !== 'portrait'
    },
    {
      name: 'playerPosition',
      type: 'string',
      title: '📍 Poste',
      description: 'Attaquant, Milieu, Défenseur, Gardien...',
      hidden: ({document}) => document?.contentType !== 'portrait'
    },
    
    // ========== CHAMPS POUR ANALYSES ==========
    {
      name: 'matchInfo',
      type: 'object',
      title: '⚽ Infos du match',
      hidden: ({document}) => document?.contentType !== 'analyse',
      fields: [
        {
          name: 'homeTeam',
          type: 'clubLink',
          title: '🏠 Équipe domicile',
          description: 'Tape le nom du club pour rechercher'
        },
        {
          name: 'awayTeam',
          type: 'clubLink',
          title: '✈️ Équipe extérieur',
          description: 'Tape le nom du club pour rechercher'
        },
        {
          name: 'score',
          type: 'string',
          title: 'Score',
          description: 'Ex: 2-1'
        },
        {
          name: 'competition',
          type: 'string',
          title: 'Compétition',
          description: 'Ligue 1, Champions League, etc.'
        },
        {
          name: 'matchDate',
          type: 'date',
          title: 'Date du match'
        }
      ]
    },
    
    // ========== CHAMPS POUR TOPS/LISTES ==========
    {
      name: 'listItems',
      type: 'array',
      title: '📋 Éléments de la liste',
      description: 'Les éléments de ton classement/top',
      hidden: ({document}) => document?.contentType !== 'top',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'rank',
            type: 'number',
            title: 'Position',
            validation: Rule => Rule.required().min(1)
          },
          {
            name: 'title',
            type: 'string',
            title: 'Titre/Nom',
            validation: Rule => Rule.required()
          },
          {
            name: 'description',
            type: 'text',
            title: 'Description',
            rows: 2
          },
          {
            name: 'image',
            type: 'image',
            title: 'Image',
            options: { hotspot: true }
          }
        ],
        preview: {
          select: {
            title: 'title',
            rank: 'rank',
            media: 'image'
          },
          prepare({title, rank, media}) {
            return {
              title: `#${rank} - ${title}`,
              media
            }
          }
        }
      }]
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
      description: 'Actus, Matchs, Clubs, Joueurs, etc.',
      of: [{type: 'reference', to: {type: 'category'}}],
      validation: Rule => Rule.required().min(1).error('Sélectionne au moins une catégorie')
    },
    {
      name: 'subcategories',
      type: 'array',
      title: 'Sous-catégories',
      description: '⚡ Filtrées automatiquement selon la catégorie choisie',
      of: [{
        type: 'reference',
        to: [{type: 'subcategory'}],
        options: {
          filter: ({document}) => {
            // Si pas de catégorie sélectionnée, ne rien montrer
            if (!document.categories || document.categories.length === 0) {
              return {
                filter: '_id == "none"'
              }
            }
            // Filtrer par catégorie parente
            const categoryIds = document.categories
              .filter(cat => cat._ref)
              .map(cat => cat._ref)

            if (categoryIds.length === 0) {
              return { filter: '_id == "none"' }
            }

            return {
              filter: 'parentCategory._ref in $cats',
              params: { cats: categoryIds }
            }
          }
        }
      }]
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags',
      description: 'Mots-clés : noms de joueurs, clubs, compétitions...',
      of: [{type: 'reference', to: {type: 'tag'}}]
    },
    {
      name: 'linkedPlayers',
      type: 'array',
      title: '⚽ Joueurs concernés',
      description: 'Tape le nom d\'un joueur → il sera créé automatiquement si besoin',
      of: [{type: 'playerLink'}],
      validation: Rule => Rule.max(10).warning('Maximum 10 joueurs par article')
    },
    {
      name: 'linkedClubs',
      type: 'array',
      title: '🏟️ Clubs concernés',
      description: 'Tape le nom d\'un club → il sera créé automatiquement si besoin',
      of: [{type: 'clubLink'}],
      validation: Rule => Rule.max(5).warning('Maximum 5 clubs par article')
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
      description: '💡 Astuce: ~200 mots/min. Un article de 1000 mots = 5 min',
      validation: Rule => Rule.min(1).max(60).integer(),
      initialValue: 3
    },
    
    // ========== VISIBILITÉ ET MISE EN AVANT ==========
    {
      name: 'isEssential',
      type: 'boolean',
      title: '⭐ Article essentiel',
      description: 'Afficher dans la section "À ne pas manquer"',
      initialValue: false
    },
    {
      name: 'isTrending',
      type: 'boolean',
      title: '🔥 Article tendance',
      description: 'Afficher dans la section "Trending"',
      initialValue: false
    },
    {
      name: 'trendingOrder',
      type: 'number',
      title: 'Ordre dans les tendances',
      description: 'Position d\'affichage (1 = premier)',
      hidden: ({document}) => !document?.isTrending,
      validation: Rule => Rule.min(1).max(10).integer()
    },
    {
      name: 'isFeatured',
      type: 'boolean',
      title: '🌟 À la une',
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
          title: 'Vues',
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
        collapsed: true
      }
    },
    
    // ========== SEO ==========
    {
      name: 'seo',
      title: '🔍 SEO & Réseaux sociaux',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Titre pour Google (50-60 caractères)',
          validation: Rule => Rule.max(60).warning('Le titre SEO ne devrait pas dépasser 60 caractères')
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Description pour Google (150-160 caractères)',
          validation: Rule => Rule.max(160).warning('La description SEO ne devrait pas dépasser 160 caractères')
        },
        {
          name: 'ogImage',
          title: 'Image de partage',
          type: 'image',
          description: 'Image pour les partages sur les réseaux (1200x630px)',
          options: {
            hotspot: true
          }
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
      description: 'Articles à afficher en fin de page',
      validation: Rule => Rule.max(6).warning('Maximum 6 articles connexes')
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
      
      // Ajouter la date
      if (publishedAt) {
        const date = new Date(publishedAt).toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        })
        subtitle = subtitle ? `${subtitle} • ${date}` : date
      }
      
      // Badges de mise en avant
      const badges = []
      if (isFeatured) badges.push('🌟')
      if (isEssential) badges.push('⭐')
      if (isTrending) badges.push('🔥')
      
      // Emojis pour le type de contenu
      const typeEmojis = {
        'actu': '📰',
        'emission': '🎬',
        'flash': '⚡',
        'analyse': '📊',
        'portrait': '👤',
        'meme': '😂',
        'top': '📋'
      }
      
      return {
        ...selection,
        title: `${typeEmojis[contentType] || '📰'} ${badges.join(' ')} ${selection.title}`.trim(),
        subtitle
      }
    }
  },
  orderings: [
    {
      title: 'Date de publication (récent)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}]
    },
    {
      title: 'Date de publication (ancien)',
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
      title: 'À la une',
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
    }
  ]
}