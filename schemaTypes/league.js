// schemaTypes/league.js
// Fiche championnat/compétition avec intégration API-Football

export default {
  name: 'league',
  title: 'Championnat / Compétition',
  type: 'document',
  icon: () => '🏆',
  fields: [
    {
      name: 'name',
      title: 'Nom',
      type: 'string',
      description: 'Ex: Ligue 1, Premier League, Champions League',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'apiFootballId',
      title: 'ID API-Football',
      type: 'number',
      description: 'Identifiant unique dans API-Football (ex: 61 = Ligue 1)',
      validation: Rule => Rule.required().integer().positive()
    },
    {
      name: 'country',
      title: 'Pays',
      type: 'string',
      description: 'Ex: France, England, Spain'
    },
    {
      name: 'countryCode',
      title: 'Code pays',
      type: 'string',
      description: 'Code ISO 2 lettres (ex: FR, GB, ES)',
      validation: Rule => Rule.max(2)
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'url',
      description: 'URL du logo officiel (depuis API-Football)'
    },
    {
      name: 'logoLocal',
      title: 'Logo local',
      type: 'image',
      description: 'Logo uploadé manuellement (prioritaire sur l\'URL)',
      options: { hotspot: true }
    },
    {
      name: 'type',
      title: 'Type de compétition',
      type: 'string',
      options: {
        list: [
          { title: 'Championnat', value: 'league' },
          { title: 'Coupe nationale', value: 'cup' },
          { title: 'Coupe européenne', value: 'european' },
          { title: 'Compétition internationale', value: 'international' },
          { title: 'Supercoupe', value: 'supercup' }
        ],
        layout: 'radio'
      },
      initialValue: 'league'
    },
    {
      name: 'currentSeason',
      title: 'Saison courante',
      type: 'number',
      description: 'Ex: 2024 pour la saison 2024-2025',
      initialValue: new Date().getFullYear()
    },
    {
      name: 'color',
      title: 'Couleur principale',
      type: 'string',
      description: 'Code hex pour l\'identité visuelle (ex: #DA291C pour la Ligue 1)',
      options: {
        list: [
          { title: 'Ligue 1 (Bleu)', value: '#091C3E' },
          { title: 'Premier League (Violet)', value: '#3D195B' },
          { title: 'La Liga (Orange)', value: '#EE8707' },
          { title: 'Serie A (Bleu)', value: '#024494' },
          { title: 'Bundesliga (Rouge)', value: '#D20515' },
          { title: 'Champions League (Bleu)', value: '#0E1E5B' },
          { title: 'Europa League (Orange)', value: '#F68E1F' },
          { title: 'Personnalisé', value: 'custom' }
        ]
      }
    },
    {
      name: 'customColor',
      title: 'Couleur personnalisée',
      type: 'string',
      description: 'Code hex si "Personnalisé" sélectionné',
      hidden: ({ document }) => document?.color !== 'custom'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Description courte de la compétition'
    },
    {
      name: 'numberOfTeams',
      title: 'Nombre d\'équipes',
      type: 'number',
      description: 'Ex: 18 pour la Ligue 1, 20 pour la Premier League',
      validation: Rule => Rule.integer().positive()
    },
    {
      name: 'isFeatured',
      title: 'Compétition mise en avant',
      type: 'boolean',
      description: 'Afficher en priorité dans les filtres et la navigation',
      initialValue: false
    },
    {
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      description: 'Position dans les listes (1 = premier)',
      validation: Rule => Rule.integer().min(1)
    }
  ],
  preview: {
    select: {
      name: 'name',
      country: 'country',
      type: 'type',
      apiFootballId: 'apiFootballId',
      isFeatured: 'isFeatured'
    },
    prepare({ name, country, type, apiFootballId, isFeatured }) {
      const typeLabels = {
        league: '🏟️',
        cup: '🏆',
        european: '⭐',
        international: '🌍',
        supercup: '🥇'
      }
      return {
        title: `${typeLabels[type] || '🏆'} ${name}${isFeatured ? ' ⭐' : ''}`,
        subtitle: `${country || 'International'} • ID: ${apiFootballId}`
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
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    },
    {
      title: 'Pays',
      name: 'countryAsc',
      by: [{ field: 'country', direction: 'asc' }]
    }
  ]
}
