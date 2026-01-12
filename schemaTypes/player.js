// cms/schemaTypes/player.js
// Fiche joueur LÉGÈRE - Pont vers API-Football
// Les stats, photos, carrière viennent de l'API. Ici on stocke uniquement le contenu éditorial Octogoal.

import PlayerSearchInput from '../components/PlayerSearchInput'

export default {
  name: 'player',
  title: 'Joueur',
  type: 'document',
  icon: () => '⚽',
  fields: [
    // ========== IDENTIFICATION (pour lier à l'API) ==========
    {
      name: 'apiFootballId',
      title: '🔍 Rechercher un joueur',
      type: 'number',
      description: 'Tape le nom du joueur, sélectionne-le dans la liste, l\'ID sera rempli automatiquement',
      validation: Rule => Rule.required().integer().positive(),
      components: {
        input: PlayerSearchInput
      }
    },
    {
      name: 'name',
      title: 'Nom du joueur',
      type: 'string',
      description: 'Rempli automatiquement après la recherche (modifiable)',
      validation: Rule => Rule.required()
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
      name: 'isPepite',
      title: '💎 Pépite Octogoal',
      type: 'boolean',
      description: 'Jeune talent identifié par Octogoal',
      initialValue: false
    },
    {
      name: 'isLegend',
      title: '👑 Légende',
      type: 'boolean',
      description: 'Joueur légendaire selon Octogoal',
      initialValue: false
    },
    {
      name: 'isFeatured',
      title: '⭐ Mis en avant',
      type: 'boolean',
      description: 'Afficher sur la page joueurs',
      initialValue: false
    },

    // ========== CONTENU ÉDITORIAL EXCLUSIF ==========
    // (Ce que l'API n'a pas - la valeur ajoutée d'Octogoal)
    {
      name: 'customBio',
      title: '✍️ Bio Octogoal',
      type: 'text',
      rows: 4,
      description: 'Notre analyse du joueur (ce que l\'API ne dit pas)',
      validation: Rule => Rule.max(500)
    },
    {
      name: 'playingStyle',
      title: '🎯 Style de jeu',
      type: 'text',
      rows: 3,
      description: 'Comment on décrirait son jeu chez Octogoal'
    },
    {
      name: 'strengths',
      title: '💪 Points forts',
      type: 'array',
      of: [{ type: 'string' }],
      validation: Rule => Rule.max(5)
    },
    {
      name: 'weaknesses',
      title: '📉 Points faibles',
      type: 'array',
      of: [{ type: 'string' }],
      validation: Rule => Rule.max(5)
    },
    {
      name: 'funFacts',
      title: '🎉 Fun facts',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Anecdotes exclusives Octogoal'
    },
    {
      name: 'famousQuotes',
      title: '💬 Citations',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'quote', title: 'Citation', type: 'text', rows: 2 },
          { name: 'context', title: 'Contexte', type: 'string' }
        ],
        preview: {
          select: { quote: 'quote', context: 'context' },
          prepare({ quote, context }) {
            return {
              title: quote?.substring(0, 50) + '...',
              subtitle: context
            }
          }
        }
      }]
    },
    {
      name: 'octogoalVerdict',
      title: '⚖️ Verdict Octogoal',
      type: 'text',
      rows: 3,
      description: 'Notre avis tranché sur le joueur'
    },

    // ========== LIENS AVEC LE CONTENU ==========
    {
      name: 'relatedArticles',
      title: '📰 Articles liés',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      description: 'Articles Octogoal parlant de ce joueur',
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
      isPepite: 'isPepite',
      isLegend: 'isLegend',
      isFeatured: 'isFeatured'
    },
    prepare({ title, apiId, isPepite, isLegend, isFeatured }) {
      const badges = []
      if (isLegend) badges.push('👑')
      if (isPepite) badges.push('💎')
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
      title: 'Pépites',
      name: 'pepites',
      by: [{ field: 'isPepite', direction: 'desc' }, { field: 'name', direction: 'asc' }]
    },
    {
      title: 'Légendes',
      name: 'legends',
      by: [{ field: 'isLegend', direction: 'desc' }, { field: 'name', direction: 'asc' }]
    },
    {
      title: 'Mis en avant',
      name: 'featured',
      by: [{ field: 'isFeatured', direction: 'desc' }, { field: 'name', direction: 'asc' }]
    }
  ]
}
