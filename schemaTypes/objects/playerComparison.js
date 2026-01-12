// cms/schemaTypes/objects/playerComparison.js
// Comparaison de joueurs côte à côte

export default {
  name: 'playerComparison',
  title: 'Comparaison joueurs',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
      description: 'Ex: Mbappé vs Haaland - Qui est le meilleur ?'
    },
    {
      name: 'player1',
      title: 'Joueur 1',
      type: 'object',
      fields: [
        { name: 'name', title: 'Nom', type: 'string', validation: Rule => Rule.required() },
        { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } },
        { name: 'club', title: 'Club', type: 'string' },
        { name: 'linkedPlayer', title: 'Lier à fiche joueur', type: 'reference', to: [{ type: 'player' }] }
      ]
    },
    {
      name: 'player2',
      title: 'Joueur 2',
      type: 'object',
      fields: [
        { name: 'name', title: 'Nom', type: 'string', validation: Rule => Rule.required() },
        { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } },
        { name: 'club', title: 'Club', type: 'string' },
        { name: 'linkedPlayer', title: 'Lier à fiche joueur', type: 'reference', to: [{ type: 'player' }] }
      ]
    },
    {
      name: 'stats',
      title: 'Statistiques comparées',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Statistique', type: 'string', validation: Rule => Rule.required() },
          { name: 'value1', title: 'Valeur Joueur 1', type: 'string', validation: Rule => Rule.required() },
          { name: 'value2', title: 'Valeur Joueur 2', type: 'string', validation: Rule => Rule.required() },
          {
            name: 'winner',
            title: 'Avantage',
            type: 'string',
            options: {
              list: [
                { title: 'Joueur 1', value: 'player1' },
                { title: 'Joueur 2', value: 'player2' },
                { title: 'Égalité', value: 'tie' }
              ]
            }
          }
        ],
        preview: {
          select: { label: 'label', v1: 'value1', v2: 'value2' },
          prepare({ label, v1, v2 }) {
            return { title: `${label}: ${v1} vs ${v2}` }
          }
        }
      }],
      validation: Rule => Rule.min(1).max(10)
    },
    {
      name: 'verdict',
      title: 'Verdict',
      type: 'object',
      fields: [
        {
          name: 'winner',
          title: 'Gagnant',
          type: 'string',
          options: {
            list: [
              { title: 'Joueur 1', value: 'player1' },
              { title: 'Joueur 2', value: 'player2' },
              { title: 'Égalité', value: 'tie' }
            ]
          }
        },
        { name: 'comment', title: 'Commentaire', type: 'text', rows: 2 }
      ]
    },
    {
      name: 'season',
      title: 'Saison de référence',
      type: 'string',
      description: 'Ex: 2025-2026'
    }
  ],
  preview: {
    select: {
      p1: 'player1.name',
      p2: 'player2.name',
      media: 'player1.image'
    },
    prepare({ p1, p2, media }) {
      return {
        title: `⚔️ ${p1 || '?'} vs ${p2 || '?'}`,
        subtitle: 'Comparaison joueurs',
        media
      }
    }
  }
}
