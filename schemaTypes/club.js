// cms/schemaTypes/club.js
// Fiche club LÉGÈRE - Pont vers API-Football
// Les stats, effectif, historique viennent de l'API. Ici on stocke uniquement le contenu éditorial Octogoal.

export default {
  name: 'club',
  title: 'Club',
  type: 'document',
  icon: () => '🏟️',
  fields: [
    // ========== IDENTIFICATION (pour lier à l'API) ==========
    {
      name: 'name',
      title: 'Nom du club',
      type: 'string',
      description: 'Pour rechercher facilement dans le CMS',
      validation: Rule => Rule.required()
    },
    {
      name: 'apiFootballId',
      title: 'ID API-Football',
      type: 'number',
      description: 'ID du club sur API-Football (ex: PSG=85, OM=81, Real=541)',
      validation: Rule => Rule.required().integer().positive()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      description: 'Généré automatiquement depuis le nom'
    },

    // ========== FLAGS ÉDITORIAUX OCTOGOAL ==========
    {
      name: 'isTopClub',
      title: '👑 Top Club',
      type: 'boolean',
      description: 'Club majeur européen',
      initialValue: false
    },
    {
      name: 'isFeatured',
      title: '⭐ Mis en avant',
      type: 'boolean',
      description: 'Afficher sur la page clubs',
      initialValue: false
    },

    // ========== CONTENU ÉDITORIAL EXCLUSIF ==========
    {
      name: 'customBio',
      title: '✍️ Présentation Octogoal',
      type: 'text',
      rows: 4,
      description: 'Notre présentation du club (ce que l\'API ne dit pas)',
      validation: Rule => Rule.max(500)
    },
    {
      name: 'history',
      title: '📜 Histoire',
      type: 'text',
      rows: 4,
      description: 'Résumé de l\'histoire du club'
    },
    {
      name: 'rivalries',
      title: '🔥 Rivalités',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Clubs rivaux (ex: El Clasico, Derby...)'
    },
    {
      name: 'funFacts',
      title: '🎉 Fun facts',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Anecdotes exclusives Octogoal'
    },
    {
      name: 'octogoalVerdict',
      title: '⚖️ Verdict Octogoal',
      type: 'text',
      rows: 3,
      description: 'Notre avis sur le club'
    },

    // ========== LIENS AVEC LE CONTENU ==========
    {
      name: 'relatedArticles',
      title: '📰 Articles liés',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      description: 'Articles Octogoal parlant de ce club',
      validation: Rule => Rule.max(10)
    },
    {
      name: 'tags',
      title: '🏷️ Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }]
    }
  ],

  preview: {
    select: {
      title: 'name',
      apiId: 'apiFootballId',
      isTopClub: 'isTopClub',
      isFeatured: 'isFeatured'
    },
    prepare({ title, apiId, isTopClub, isFeatured }) {
      const badges = []
      if (isTopClub) badges.push('👑')
      if (isFeatured) badges.push('⭐')

      return {
        title: `${badges.join(' ')} ${title}`.trim(),
        subtitle: `API-Football ID: ${apiId || 'Non défini'}`
      }
    }
  },

  orderings: [
    {
      title: 'Nom (A-Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    },
    {
      title: 'Top Clubs',
      name: 'topClubs',
      by: [{ field: 'isTopClub', direction: 'desc' }, { field: 'name', direction: 'asc' }]
    },
    {
      title: 'Mis en avant',
      name: 'featured',
      by: [{ field: 'isFeatured', direction: 'desc' }, { field: 'name', direction: 'asc' }]
    }
  ]
}
