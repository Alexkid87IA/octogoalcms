// cms/schemaTypes/homepage.js
// Contrôle éditorial complet de la homepage

export default {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: () => '🏠',
  // Singleton - un seul document homepage
  __experimental_actions: ['update', 'publish'],
  groups: [
    { name: 'hero', title: 'Une principale', default: true },
    { name: 'trending', title: 'Tendances' },
    { name: 'sections', title: 'Sections' },
    { name: 'sidebar', title: 'Sidebar' },
    { name: 'alerts', title: 'Alertes & Breaking' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ========== SECTION HERO / UNE ==========
    {
      name: 'heroArticle',
      title: 'Article principal (À la une)',
      type: 'reference',
      group: 'hero',
      to: [{ type: 'article' }],
      description: 'L\'article mis en avant en grand sur la homepage'
    },
    {
      name: 'heroStyle',
      title: 'Style du hero',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          { title: 'Pleine largeur', value: 'fullwidth' },
          { title: 'Split (article + sidebar)', value: 'split' },
          { title: 'Grille 2 colonnes', value: 'grid-2' },
          { title: 'Slider', value: 'slider' }
        ],
        layout: 'radio'
      },
      initialValue: 'fullwidth'
    },
    {
      name: 'heroSecondaryArticles',
      title: 'Articles secondaires du hero',
      type: 'array',
      group: 'hero',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      description: 'Articles affichés à côté/sous le principal (selon le style)',
      validation: Rule => Rule.max(4)
    },
    {
      name: 'showHeroVideo',
      title: 'Afficher vidéo dans le hero',
      type: 'boolean',
      group: 'hero',
      description: 'Si l\'article principal a une vidéo, l\'afficher directement',
      initialValue: false
    },

    // ========== SECTION TENDANCES ==========
    {
      name: 'trendingTitle',
      title: 'Titre section tendances',
      type: 'string',
      group: 'trending',
      initialValue: 'Trending'
    },
    {
      name: 'trendingMode',
      title: 'Mode tendances',
      type: 'string',
      group: 'trending',
      options: {
        list: [
          { title: 'Manuel (sélection ci-dessous)', value: 'manual' },
          { title: 'Automatique (isTrending=true)', value: 'auto' },
          { title: 'Plus vus (stats.views)', value: 'mostViewed' },
          { title: 'Plus récents', value: 'latest' }
        ],
        layout: 'radio'
      },
      initialValue: 'auto'
    },
    {
      name: 'trendingArticles',
      title: 'Articles tendances (manuel)',
      type: 'array',
      group: 'trending',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      hidden: ({ document }) => document?.trendingMode !== 'manual',
      validation: Rule => Rule.max(10)
    },
    {
      name: 'trendingCount',
      title: 'Nombre d\'articles tendances',
      type: 'number',
      group: 'trending',
      description: 'Nombre d\'articles à afficher',
      initialValue: 6,
      validation: Rule => Rule.min(3).max(12)
    },
    {
      name: 'trendingStyle',
      title: 'Style tendances',
      type: 'string',
      group: 'trending',
      options: {
        list: [
          { title: 'Liste numérotée', value: 'numbered-list' },
          { title: 'Grille de cards', value: 'grid' },
          { title: 'Carousel horizontal', value: 'carousel' },
          { title: 'Liste avec images', value: 'list-images' }
        ]
      },
      initialValue: 'numbered-list'
    },

    // ========== SECTIONS PERSONNALISÉES ==========
    {
      name: 'sections',
      title: 'Sections de la homepage',
      type: 'array',
      group: 'sections',
      of: [{
        type: 'object',
        name: 'homepageSection',
        title: 'Section',
        fields: [
          {
            name: 'title',
            title: 'Titre de la section',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'slug',
            title: 'ID de la section',
            type: 'slug',
            options: { source: 'title' },
            description: 'Pour le scroll et les ancres'
          },
          {
            name: 'sectionType',
            title: 'Type de section',
            type: 'string',
            options: {
              list: [
                { title: 'Articles par catégorie', value: 'category' },
                { title: 'Articles par sous-catégorie', value: 'subcategory' },
                { title: 'Sélection manuelle', value: 'manual' },
                { title: 'Joueurs mis en avant', value: 'players' },
                { title: 'Clubs mis en avant', value: 'clubs' },
                { title: 'Dernières émissions', value: 'emissions' },
                { title: 'Vidéos', value: 'videos' },
                { title: 'Flash infos', value: 'flash' }
              ]
            },
            validation: Rule => Rule.required()
          },
          {
            name: 'category',
            title: 'Catégorie',
            type: 'reference',
            to: [{ type: 'category' }],
            hidden: ({ parent }) => parent?.sectionType !== 'category'
          },
          {
            name: 'subcategory',
            title: 'Sous-catégorie',
            type: 'reference',
            to: [{ type: 'subcategory' }],
            hidden: ({ parent }) => parent?.sectionType !== 'subcategory'
          },
          {
            name: 'manualItems',
            title: 'Articles sélectionnés',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'article' }] }],
            hidden: ({ parent }) => parent?.sectionType !== 'manual'
          },
          {
            name: 'manualPlayers',
            title: 'Joueurs sélectionnés',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'player' }] }],
            hidden: ({ parent }) => parent?.sectionType !== 'players'
          },
          {
            name: 'manualClubs',
            title: 'Clubs sélectionnés',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'club' }] }],
            hidden: ({ parent }) => parent?.sectionType !== 'clubs'
          },
          {
            name: 'itemCount',
            title: 'Nombre d\'éléments',
            type: 'number',
            initialValue: 6,
            validation: Rule => Rule.min(2).max(12)
          },
          {
            name: 'layout',
            title: 'Disposition',
            type: 'string',
            options: {
              list: [
                { title: 'Grille 3 colonnes', value: 'grid-3' },
                { title: 'Grille 4 colonnes', value: 'grid-4' },
                { title: 'Liste', value: 'list' },
                { title: 'Carousel', value: 'carousel' },
                { title: 'Featured + grille', value: 'featured-grid' },
                { title: 'Masonry', value: 'masonry' }
              ]
            },
            initialValue: 'grid-3'
          },
          {
            name: 'showMoreLink',
            title: 'Lien "Voir plus"',
            type: 'url',
            description: 'URL vers la page complète'
          },
          {
            name: 'backgroundColor',
            title: 'Couleur de fond',
            type: 'string',
            options: {
              list: [
                { title: 'Transparent', value: 'transparent' },
                { title: 'Gris clair', value: 'gray-light' },
                { title: 'Gris foncé', value: 'gray-dark' },
                { title: 'Dégradé Octogoal', value: 'gradient-octogoal' },
                { title: 'Noir', value: 'black' }
              ]
            },
            initialValue: 'transparent'
          },
          {
            name: 'isVisible',
            title: 'Section visible',
            type: 'boolean',
            initialValue: true
          },
          {
            name: 'order',
            title: 'Ordre d\'affichage',
            type: 'number',
            validation: Rule => Rule.integer().min(1)
          }
        ],
        preview: {
          select: {
            title: 'title',
            type: 'sectionType',
            count: 'itemCount',
            visible: 'isVisible',
            order: 'order'
          },
          prepare({ title, type, count, visible, order }) {
            const typeLabels = {
              'category': '📁',
              'subcategory': '📂',
              'manual': '✋',
              'players': '⚽',
              'clubs': '🏟️',
              'emissions': '🎬',
              'videos': '📹',
              'flash': '⚡'
            }
            return {
              title: `${visible ? '' : '👁️‍🗨️ '}${order ? `#${order} ` : ''}${typeLabels[type] || ''} ${title}`,
              subtitle: `${type} • ${count} éléments`
            }
          }
        }
      }]
    },

    // ========== SIDEBAR ==========
    {
      name: 'sidebarSections',
      title: 'Sections sidebar',
      type: 'array',
      group: 'sidebar',
      of: [{
        type: 'object',
        name: 'sidebarSection',
        fields: [
          {
            name: 'title',
            title: 'Titre',
            type: 'string'
          },
          {
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
              list: [
                { title: 'Classement', value: 'standings' },
                { title: 'Pépites du moment', value: 'pepites' },
                { title: 'Joueur du jour', value: 'player-of-day' },
                { title: 'Matchs du jour', value: 'matches' },
                { title: 'Prochains matchs', value: 'upcoming-matches' },
                { title: 'Newsletter', value: 'newsletter' },
                { title: 'Réseaux sociaux', value: 'social' },
                { title: 'Pub/Sponsor', value: 'ad' },
                { title: 'Custom HTML', value: 'custom' }
              ]
            }
          },
          {
            name: 'leagueId',
            title: 'ID Championnat (pour classement)',
            type: 'number',
            description: 'Ex: 61 pour Ligue 1',
            hidden: ({ parent }) => !['standings', 'matches', 'upcoming-matches'].includes(parent?.type)
          },
          {
            name: 'featuredPlayer',
            title: 'Joueur du jour',
            type: 'reference',
            to: [{ type: 'player' }],
            hidden: ({ parent }) => parent?.type !== 'player-of-day'
          },
          {
            name: 'customContent',
            title: 'Contenu custom',
            type: 'text',
            hidden: ({ parent }) => parent?.type !== 'custom'
          },
          {
            name: 'adImage',
            title: 'Image pub',
            type: 'image',
            hidden: ({ parent }) => parent?.type !== 'ad'
          },
          {
            name: 'adLink',
            title: 'Lien pub',
            type: 'url',
            hidden: ({ parent }) => parent?.type !== 'ad'
          },
          {
            name: 'isVisible',
            title: 'Visible',
            type: 'boolean',
            initialValue: true
          },
          {
            name: 'order',
            title: 'Ordre',
            type: 'number'
          }
        ],
        preview: {
          select: { title: 'title', type: 'type', visible: 'isVisible', order: 'order' },
          prepare({ title, type, visible, order }) {
            return {
              title: `${visible ? '' : '👁️‍🗨️ '}${order ? `#${order} ` : ''}${title}`,
              subtitle: type
            }
          }
        }
      }]
    },

    // ========== ALERTES & BREAKING NEWS ==========
    {
      name: 'breakingNews',
      title: 'Breaking News',
      type: 'object',
      group: 'alerts',
      fields: [
        {
          name: 'isActive',
          title: 'Activer le breaking news',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'text',
          title: 'Texte du breaking',
          type: 'string',
          description: 'Court message d\'accroche',
          validation: Rule => Rule.max(150)
        },
        {
          name: 'linkedArticle',
          title: 'Article lié',
          type: 'reference',
          to: [{ type: 'article' }]
        },
        {
          name: 'customLink',
          title: 'Lien personnalisé',
          type: 'url',
          description: 'Si pas d\'article lié'
        },
        {
          name: 'style',
          title: 'Style',
          type: 'string',
          options: {
            list: [
              { title: 'Rouge urgent', value: 'red' },
              { title: 'Orange important', value: 'orange' },
              { title: 'Bleu info', value: 'blue' },
              { title: 'Vert positif', value: 'green' }
            ]
          },
          initialValue: 'red'
        },
        {
          name: 'expiresAt',
          title: 'Expire le',
          type: 'datetime',
          description: 'Le breaking disparaît automatiquement après cette date'
        }
      ],
      options: { collapsible: true }
    },
    {
      name: 'ticker',
      title: 'Bandeau défilant (ticker)',
      type: 'object',
      group: 'alerts',
      fields: [
        {
          name: 'isActive',
          title: 'Activer le ticker',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'items',
          title: 'Éléments du ticker',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'text', title: 'Texte', type: 'string' },
              { name: 'link', title: 'Lien', type: 'url' },
              {
                name: 'icon',
                title: 'Icône',
                type: 'string',
                options: {
                  list: [
                    { title: 'Foot', value: '⚽' },
                    { title: 'Feu', value: '🔥' },
                    { title: 'Alerte', value: '🚨' },
                    { title: 'Breaking', value: '📢' },
                    { title: 'Transfert', value: '✈️' },
                    { title: 'But', value: '🥅' }
                  ]
                }
              }
            ]
          }],
          validation: Rule => Rule.max(10)
        },
        {
          name: 'speed',
          title: 'Vitesse de défilement',
          type: 'string',
          options: {
            list: [
              { title: 'Lent', value: 'slow' },
              { title: 'Normal', value: 'normal' },
              { title: 'Rapide', value: 'fast' }
            ]
          },
          initialValue: 'normal'
        }
      ],
      options: { collapsible: true }
    },
    {
      name: 'popup',
      title: 'Popup promotionnel',
      type: 'object',
      group: 'alerts',
      fields: [
        {
          name: 'isActive',
          title: 'Activer le popup',
          type: 'boolean',
          initialValue: false
        },
        {
          name: 'title',
          title: 'Titre',
          type: 'string'
        },
        {
          name: 'content',
          title: 'Contenu',
          type: 'text',
          rows: 3
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image'
        },
        {
          name: 'ctaText',
          title: 'Texte du bouton',
          type: 'string',
          initialValue: 'En savoir plus'
        },
        {
          name: 'ctaLink',
          title: 'Lien du bouton',
          type: 'url'
        },
        {
          name: 'showOnce',
          title: 'Afficher une seule fois par session',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'delay',
          title: 'Délai avant affichage (secondes)',
          type: 'number',
          initialValue: 5
        }
      ],
      options: { collapsible: true, collapsed: true }
    },

    // ========== SEO ==========
    {
      name: 'seo',
      title: 'SEO Homepage',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Titre pour Google (50-60 caractères)',
          initialValue: 'Octogoal - Toute l\'actu foot',
          validation: Rule => Rule.max(70)
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Description pour Google (150-160 caractères)',
          validation: Rule => Rule.max(160)
        },
        {
          name: 'ogImage',
          title: 'Image Open Graph',
          type: 'image',
          description: 'Image pour les partages réseaux sociaux (1200x630px)'
        }
      ],
      options: { collapsible: true }
    },

    // ========== MÉTADONNÉES ==========
    {
      name: 'lastUpdated',
      title: 'Dernière mise à jour',
      type: 'datetime',
      readOnly: true
    }
  ],

  preview: {
    select: {
      heroTitle: 'heroArticle.title',
      breaking: 'breakingNews.isActive',
      sectionsCount: 'sections'
    },
    prepare({ heroTitle, breaking, sectionsCount }) {
      return {
        title: '🏠 Configuration Homepage',
        subtitle: `${breaking ? '🚨 Breaking actif • ' : ''}Une: ${heroTitle || 'Non définie'} • ${sectionsCount?.length || 0} sections`
      }
    }
  }
}
