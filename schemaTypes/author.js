// cms/schemaTypes/author.js
// Auteurs améliorés avec réseaux sociaux, rôles et stats

export default {
  name: 'author',
  title: 'Auteur',
  type: 'document',
  icon: () => '✍️',
  fields: [
    {
      name: 'name',
      title: 'Nom complet',
      type: 'string',
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
      name: 'nickname',
      title: 'Surnom / Pseudo',
      type: 'string',
      description: 'Ex: "Le Prof", "Docteur Stats"'
    },
    {
      name: 'role',
      title: 'Rôle',
      type: 'string',
      options: {
        list: [
          { title: 'Rédacteur', value: 'writer' },
          { title: 'Rédacteur en chef', value: 'editor-in-chief' },
          { title: 'Journaliste', value: 'journalist' },
          { title: 'Analyste', value: 'analyst' },
          { title: 'Présentateur', value: 'host' },
          { title: 'Community Manager', value: 'community-manager' },
          { title: 'Contributeur', value: 'contributor' },
          { title: 'Invité', value: 'guest' }
        ]
      },
      initialValue: 'writer'
    },
    {
      name: 'image',
      title: 'Photo de profil',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: { hotspot: true },
      description: 'Image large pour la page auteur'
    },
    {
      name: 'shortBio',
      title: 'Bio courte',
      type: 'text',
      rows: 2,
      description: 'Une phrase de présentation (pour les cards)',
      validation: Rule => Rule.max(160)
    },
    {
      name: 'bio',
      title: 'Biographie complète',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' }
          ],
          marks: {
            decorators: [
              { title: 'Gras', value: 'strong' },
              { title: 'Italique', value: 'em' }
            ]
          }
        }
      ]
    },
    {
      name: 'expertise',
      title: 'Domaines d\'expertise',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Ligue 1', value: 'ligue-1' },
          { title: 'Premier League', value: 'premier-league' },
          { title: 'La Liga', value: 'la-liga' },
          { title: 'Serie A', value: 'serie-a' },
          { title: 'Bundesliga', value: 'bundesliga' },
          { title: 'Champions League', value: 'ucl' },
          { title: 'Mercato', value: 'mercato' },
          { title: 'Tactique', value: 'tactics' },
          { title: 'Stats & Data', value: 'stats' },
          { title: 'Équipe de France', value: 'france-nt' },
          { title: 'Foot africain', value: 'african-football' },
          { title: 'Foot féminin', value: 'womens-football' }
        ]
      },
      description: 'Sélectionne les domaines d\'expertise'
    },
    {
      name: 'favoriteClub',
      title: 'Club de coeur',
      type: 'reference',
      to: [{ type: 'club' }],
      description: 'Optionnel - pour la transparence'
    },
    {
      name: 'socialMedia',
      title: 'Réseaux sociaux',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
          description: 'Lien profil Twitter'
        },
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url'
        },
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url'
        },
        {
          name: 'tiktok',
          title: 'TikTok',
          type: 'url'
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'url'
        },
        {
          name: 'threads',
          title: 'Threads',
          type: 'url'
        }
      ],
      options: { collapsible: true, collapsed: true }
    },
    {
      name: 'email',
      title: 'Email de contact',
      type: 'string',
      description: 'Email professionnel (visible publiquement si activé)'
    },
    {
      name: 'showEmail',
      title: 'Afficher l\'email publiquement',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'isActive',
      title: 'Auteur actif',
      type: 'boolean',
      description: 'Désactiver pour les anciens auteurs',
      initialValue: true
    },
    {
      name: 'isFeatured',
      title: 'Auteur mis en avant',
      type: 'boolean',
      description: 'Afficher sur la page équipe',
      initialValue: false
    },
    {
      name: 'joinedAt',
      title: 'Date d\'arrivée',
      type: 'date',
      description: 'Date d\'arrivée dans l\'équipe'
    },
    {
      name: 'stats',
      title: 'Statistiques',
      type: 'object',
      fields: [
        {
          name: 'articlesCount',
          title: 'Nombre d\'articles',
          type: 'number',
          readOnly: true,
          initialValue: 0
        },
        {
          name: 'totalViews',
          title: 'Vues totales',
          type: 'number',
          readOnly: true,
          initialValue: 0
        }
      ],
      options: { collapsible: true, collapsed: true }
    },
    {
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      description: 'Position sur la page équipe'
    }
  ],
  preview: {
    select: {
      title: 'name',
      nickname: 'nickname',
      role: 'role',
      media: 'image',
      isActive: 'isActive',
      isFeatured: 'isFeatured'
    },
    prepare({ title, nickname, role, media, isActive, isFeatured }) {
      const roleLabels = {
        'writer': 'Rédacteur',
        'editor-in-chief': 'Réd. en chef',
        'journalist': 'Journaliste',
        'analyst': 'Analyste',
        'host': 'Présentateur',
        'community-manager': 'CM',
        'contributor': 'Contributeur',
        'guest': 'Invité'
      }

      const badges = []
      if (isFeatured) badges.push('⭐')
      if (!isActive) badges.push('🔇')

      return {
        title: `${badges.join(' ')} ${title}${nickname ? ` "${nickname}"` : ''}`.trim(),
        subtitle: roleLabels[role] || role,
        media
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
      title: 'Par rôle',
      name: 'byRole',
      by: [{ field: 'role', direction: 'asc' }, { field: 'name', direction: 'asc' }]
    },
    {
      title: 'Ordre personnalisé',
      name: 'customOrder',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
}
