// cms/schemaTypes/objects/statsCard.js
// Carte de statistiques pour afficher des chiffres clés

export default {
  name: 'statsCard',
  title: 'Stats Card',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      description: 'Ex: Mbappé en 2025-2026'
    },
    // Legacy fields
    {
      name: 'player1Name',
      title: '[Legacy] Nom joueur 1',
      type: 'string',
      hidden: true
    },
    {
      name: 'player2Name',
      title: '[Legacy] Nom joueur 2',
      type: 'string',
      hidden: true
    },
    {
      name: 'stats',
      title: 'Statistiques',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'value',
            title: 'Valeur',
            type: 'string',
            // validation: Rule => Rule.required(),
            description: 'Ex: 42, 87%, 1.2M'
          },
          {
            name: 'label',
            title: 'Label',
            type: 'string',
            // validation: Rule => Rule.required(),
            description: 'Ex: Buts, Passes D., Valeur'
          },
          {
            name: 'icon',
            title: 'Icône',
            type: 'string',
            options: {
              list: [
                { title: '⚽ But', value: 'goal' },
                { title: '🎯 Passe D.', value: 'assist' },
                { title: '👟 Matchs', value: 'match' },
                { title: '⏱️ Minutes', value: 'minutes' },
                { title: '🟨 Cartons J.', value: 'yellow' },
                { title: '🟥 Cartons R.', value: 'red' },
                { title: '💰 Valeur', value: 'value' },
                { title: '📈 Hausse', value: 'up' },
                { title: '📉 Baisse', value: 'down' },
                { title: '⭐ Note', value: 'rating' },
                { title: '🏆 Trophée', value: 'trophy' }
              ]
            }
          },
          {
            name: 'trend',
            title: 'Tendance',
            type: 'string',
            options: {
              list: [
                { title: '↗️ En hausse', value: 'up' },
                { title: '↘️ En baisse', value: 'down' },
                { title: '➡️ Stable', value: 'stable' }
              ]
            }
          }
        ],
        preview: {
          select: {
            value: 'value',
            label: 'label'
          },
          prepare({ value, label }) {
            return {
              title: `${value} ${label}`
            }
          }
        }
      }],
      // validation: Rule => Rule.min(1).max(6)
    },
    {
      name: 'layout',
      title: 'Disposition',
      type: 'string',
      options: {
        list: [
          { title: 'Ligne', value: 'row' },
          { title: 'Grille 2x2', value: 'grid-2' },
          { title: 'Grille 3x2', value: 'grid-3' },
          { title: 'Liste', value: 'list' }
        ]
      },
      initialValue: 'row'
    },
    {
      name: 'source',
      title: 'Source des données',
      type: 'string',
      description: 'Ex: Transfermarkt, WhoScored, API-Football'
    },
    {
      name: 'theme',
      title: 'Thème',
      type: 'string',
      options: {
        list: [
          { title: 'Clair', value: 'light' },
          { title: 'Sombre', value: 'dark' },
          { title: 'Octogoal', value: 'octogoal' },
          { title: 'Club (couleurs)', value: 'club' }
        ]
      },
      initialValue: 'dark'
    }
  ],
  preview: {
    select: {
      title: 'title',
      stats: 'stats'
    },
    prepare({ title, stats }) {
      const count = stats?.length || 0
      return {
        title: `📊 ${title || 'Stats Card'}`,
        subtitle: `${count} statistique${count > 1 ? 's' : ''}`
      }
    }
  }
}
